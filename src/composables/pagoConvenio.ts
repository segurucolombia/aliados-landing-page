import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  VentasConveniosService,
  motivoErrorPago,
  motivoRechazoMercadoPago,
  type ResultadoPagoConvenio,
  type VentaConvenioDetalle,
} from '../services/ventas-convenios.service';

/**
 * - `formulario`: se pide la tarjeta.
 * - `procesando`: hay un cobro o una verificación en curso; la pantalla de carga tapa todo
 *   hasta tener un resultado final.
 * - `verificacion-pendiente`: después de 3 verificaciones Mercado Pago aún no confirma.
 */
export type FasePagoConvenio = 'formulario' | 'procesando' | 'verificacion-pendiente';

export interface ErrorPagoConvenio {
  titulo: string;
  detalle: string;
}

interface OpcionesPagoConvenio {
  ventaId: () => string;
  /** Vuelve a pedir la venta (GET) sin pantalla de carga. null si no se pudo. */
  recargar: () => Promise<VentaConvenioDetalle | null>;
  /** La venta quedó PAGADA. `paymentId` es null si se supo al recargarla. */
  onPagada: (venta: VentaConvenioDetalle, paymentId: string | null) => void;
  onActualizada?: (venta: VentaConvenioDetalle) => void;
  onNoEncontrada: () => void;
}

/** Verificaciones automáticas de un pago en proceso (202) y la espera entre cada una */
const MAX_VERIFICACIONES = 3;
const ESPERA_VERIFICACION_MS = 10000;

export const MENSAJE_PAGO_EN_VERIFICACION =
  'Tu pago está siendo confirmado por Mercado Pago, esto puede tardar un poco más…';

/**
 * Pago por débito automático de una venta de convenio. El token de la tarjeta es de un
 * solo uso: solo se reenvía al verificar un pago en proceso, en el que el backend no
 * vuelve a cobrar. Cualquier otro reintento exige una tarjeta nueva.
 */
export default function usePagoConvenio(opciones: OpcionesPagoConvenio) {
  const fase = ref<FasePagoConvenio>('formulario');
  /** Texto de la pantalla de carga; vacío = el de un pago recién enviado */
  const mensajeCarga = ref('');
  const error = ref<ErrorPagoConvenio | null>(null);
  /** Cambiarla monta un formulario de tarjeta vacío, para generar un token nuevo */
  const formularioTarjetaKey = ref(0);

  const procesando = computed(() => fase.value === 'procesando');

  let tokenEnCurso: string | null = null;
  let temporizador: ReturnType<typeof setTimeout> | null = null;
  let activo = true;

  // Mientras se procesa, se advierte al cliente si intenta salir o recargar
  const advertirSalida = (event: BeforeUnloadEvent): void => {
    event.preventDefault();
    event.returnValue = '';
  };

  watch(procesando, (enCurso) => {
    if (enCurso) window.addEventListener('beforeunload', advertirSalida);
    else window.removeEventListener('beforeunload', advertirSalida);
  });

  onBeforeUnmount(() => {
    activo = false;
    if (temporizador) clearTimeout(temporizador);
    window.removeEventListener('beforeunload', advertirSalida);
  });

  const esperar = (ms: number) =>
    new Promise<void>((resolve) => {
      temporizador = setTimeout(resolve, ms);
    });

  const mensajeBackend = (e: any): string => String(e?.response?.data?.message ?? '');

  const llamarPago = (token: string): Promise<ResultadoPagoConvenio> =>
    VentasConveniosService.pagar({
      venta_id: opciones.ventaId(),
      card_token_id: token,
      back_url: window.location.href,
    });

  const terminar = (): void => {
    fase.value = 'formulario';
    mensajeCarga.value = '';
  };

  /** El token ya no sirve: se limpia la tarjeta para que se genere uno nuevo */
  const pedirTarjetaNueva = (titulo: string, detalle = ''): void => {
    tokenEnCurso = null;
    error.value = { titulo, detalle };
    formularioTarjetaKey.value++;
    terminar();
  };

  /** Devuelve si el pago sigue en proceso (202) */
  const procesarResultado = (resultado: ResultadoPagoConvenio): boolean => {
    if (resultado.resultado === 'aprobado') {
      terminar();
      opciones.onPagada(resultado.venta, resultado.payment_id);
      return false;
    }
    opciones.onActualizada?.(resultado.venta);
    return true;
  };

  const manejarError = async (e: any): Promise<void> => {
    console.error('Error al pagar la venta de convenio:', e);
    const mensaje = mensajeBackend(e);

    switch (motivoErrorPago(e)) {
      case 'rechazado':
        pedirTarjetaNueva(
          'Tu pago fue rechazado. Verifica los datos o intenta con otra tarjeta.',
          motivoRechazoMercadoPago(e),
        );
        return;

      case 'mercado-pago':
        pedirTarjetaNueva(mensaje || 'No pudimos procesar tu tarjeta. Ingrésala de nuevo.');
        return;

      case 'pago-en-curso':
        if (tokenEnCurso) {
          await verificar({ esperarPrimero: true, mensaje: 'Ya estamos procesando tu pago.' });
          return;
        }
        terminar();
        await opciones.recargar();
        return;

      case 'ya-pagada':
        // La vista que usa el composable muestra el plan ya pagado al recargar la venta
        terminar();
        await opciones.recargar();
        return;

      case 'conflicto':
        terminar();
        error.value = { titulo: mensaje || 'Este plan no se puede pagar en este momento.', detalle: '' };
        await opciones.recargar();
        return;

      case 'no-encontrada':
        terminar();
        opciones.onNoEncontrada();
        return;

      case 'validacion':
        terminar();
        error.value = { titulo: mensaje || 'Revisa los datos e intenta de nuevo.', detalle: '' };
        return;

      case 'inesperado': {
        // Puede que el cobro sí haya pasado: se revisa la venta antes de dejar reintentar
        const actual = await opciones.recargar();
        if (actual?.estado === 'PAGADA') {
          terminar();
          opciones.onPagada(actual, null);
          return;
        }
        pedirTarjetaNueva('Tuvimos un problema procesando tu pago.', 'Ingresa tu tarjeta de nuevo para reintentar.');
      }
    }
  };

  /** Verifica con el mismo token un pago en proceso, sin quitar la pantalla de carga */
  const verificar = async (config: {
    intentos?: number;
    esperarPrimero: boolean;
    mensaje?: string;
  }): Promise<void> => {
    const intentos = config.intentos ?? MAX_VERIFICACIONES;
    fase.value = 'procesando';
    mensajeCarga.value = config.mensaje ?? MENSAJE_PAGO_EN_VERIFICACION;

    for (let intento = 0; intento < intentos; intento++) {
      if (intento > 0 || config.esperarPrimero) {
        await esperar(ESPERA_VERIFICACION_MS);
        if (!activo) return;
        mensajeCarga.value = MENSAJE_PAGO_EN_VERIFICACION;
      }

      try {
        if (!procesarResultado(await llamarPago(tokenEnCurso!))) return;
      } catch (e: any) {
        const motivo = motivoErrorPago(e);
        if (motivo === 'pago-en-curso') continue;
        if (motivo === 'mercado-pago' || motivo === 'rechazado') {
          // Mercado Pago descartó el intento anterior: el token ya no sirve
          console.error('Error al verificar el pago de la venta de convenio:', e);
          pedirTarjetaNueva('No pudimos confirmar tu pago. Por favor ingresa tu tarjeta de nuevo.');
          return;
        }
        await manejarError(e);
        return;
      }
    }

    fase.value = 'verificacion-pendiente';
    mensajeCarga.value = '';
  };

  /** Cobra con el token recién generado por el formulario de tarjeta */
  const pagar = async (token: string): Promise<void> => {
    // El backend también bloquea el doble envío, pero no debe llegar a pasar
    if (fase.value !== 'formulario') return;

    tokenEnCurso = token;
    error.value = null;
    fase.value = 'procesando';
    mensajeCarga.value = '';

    try {
      // 202 no es un error: la venta sigue GESTIONADA hasta que se confirme el cobro
      if (procesarResultado(await llamarPago(token))) {
        await verificar({ esperarPrimero: true });
      }
    } catch (e: any) {
      await manejarError(e);
    }
  };

  /** "Verificar de nuevo" después de agotar las verificaciones automáticas */
  const verificarDeNuevo = async (): Promise<void> => {
    if (fase.value !== 'verificacion-pendiente' || !tokenEnCurso) return;
    error.value = null;
    await verificar({ intentos: 1, esperarPrimero: false });
  };

  return {
    fase,
    procesando,
    mensajeCarga,
    error,
    formularioTarjetaKey,
    pagar,
    verificarDeNuevo,
  };
}
