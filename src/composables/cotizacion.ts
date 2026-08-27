import { computed, ref } from 'vue';
import { VentasService, extraerRechazos } from '../services/ventas.service';
import type { CotizacionVenta, CotizarVentaInput, RechazoVenta } from '../types/cotizacion';

/** Espera entre el último cambio del formulario y la llamada a cotizar */
export const DEBOUNCE_COTIZACION_MS = 500;

const MENSAJE_ERROR_GENERICO = 'No pudimos calcular el valor de tu compra. Intenta de nuevo.';

/**
 * Cotiza la venta contra el backend cada vez que cambia el formulario.
 *
 * El estado es propio de cada componente que lo use (no es compartido como el cupón):
 * el desglose siempre corresponde a la última respuesta recibida del backend.
 */
export default function useCotizacion() {
  const cotizacion = ref<CotizacionVenta | null>(null);
  /** Motivos por los que la venta no se puede hacer (HTTP 422) */
  const rechazos = ref<RechazoVenta[]>([]);
  /** Mensaje general del 422 */
  const mensajeRechazo = ref('');
  /** Error de otro tipo: cupón inválido (400), versión inexistente (404), red… */
  const errorCotizacion = ref('');
  const cotizando = ref(false);

  let temporizador: ReturnType<typeof setTimeout> | null = null;
  /** Descarta respuestas que llegan fuera de orden */
  let peticionVigente = 0;

  /** Solo se puede pagar con una cotización vigente y sin rechazos */
  const puedePagar = computed(
    () => cotizacion.value !== null
      && rechazos.value.length === 0
      && errorCotizacion.value === ''
      && !cotizando.value,
  );

  const hayRechazos = computed(() => rechazos.value.length > 0);

  /** Mensaje de rechazo de un campo, para marcarlo dentro del formulario */
  const rechazoDeCampo = (campoClave: string): string => {
    return rechazos.value.find((rechazo) => rechazo.campo_clave === campoClave)?.mensaje ?? '';
  };

  const limpiarRechazos = (): void => {
    rechazos.value = [];
    mensajeRechazo.value = '';
  };

  /** Registra los rechazos de un error 422 (de cotizar o de crear la venta) */
  const registrarRechazos = (error: any): boolean => {
    const encontrados = extraerRechazos(error);
    if (encontrados.length === 0) return false;

    rechazos.value = encontrados;
    mensajeRechazo.value = error?.response?.data?.message
      || 'La venta no se puede realizar con los datos ingresados';
    return true;
  };

  /** Cotiza de inmediato, sin esperar el debounce */
  const cotizarAhora = async (input: CotizarVentaInput): Promise<CotizacionVenta | null> => {
    if (!input.version_id) return null;

    const peticion = ++peticionVigente;
    cotizando.value = true;

    try {
      const resultado = await VentasService.cotizar(input);
      if (peticion !== peticionVigente) return null; // llegó una respuesta más nueva

      cotizacion.value = resultado;
      limpiarRechazos();
      errorCotizacion.value = '';
      return resultado;
    } catch (error: any) {
      if (peticion !== peticionVigente) return null;

      // Con rechazos el desglose anterior ya no aplica: no se puede pagar
      cotizacion.value = null;

      if (registrarRechazos(error)) {
        errorCotizacion.value = '';
      } else {
        limpiarRechazos();
        errorCotizacion.value = error?.response?.data?.message || MENSAJE_ERROR_GENERICO;
      }
      return null;
    } finally {
      if (peticion === peticionVigente) cotizando.value = false;
    }
  };

  /** Cotiza con debounce: pensado para llamarse en cada cambio del formulario */
  const cotizar = (input: CotizarVentaInput, debounceMs: number = DEBOUNCE_COTIZACION_MS): void => {
    if (temporizador) clearTimeout(temporizador);

    // Desde el primer cambio la cotización queda pendiente: mientras tanto no se
    // puede pagar, para que nadie avance con un total que ya no corresponde
    cotizando.value = true;

    temporizador = setTimeout(() => {
      temporizador = null;
      void cotizarAhora(input);
    }, debounceMs);
  };

  /** Cancela una cotización pendiente (al salir del paso o cerrar el flujo) */
  const cancelarCotizacion = (): void => {
    if (temporizador) clearTimeout(temporizador);
    temporizador = null;
    peticionVigente++;
    cotizando.value = false;
  };

  return {
    cotizacion,
    rechazos,
    mensajeRechazo,
    errorCotizacion,
    cotizando,
    puedePagar,
    hayRechazos,
    rechazoDeCampo,
    registrarRechazos,
    limpiarRechazos,
    cotizar,
    cotizarAhora,
    cancelarCotizacion,
  };
}
