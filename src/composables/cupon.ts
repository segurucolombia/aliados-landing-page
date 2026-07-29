import { computed, ref } from 'vue';
import { CuponesService } from '../services/cupones.service';
import type { CuponValidado } from '../types/cupones';

/** Cupón aplicado persistido: se guarda contra qué plan quedó validado */
interface CuponPersistido {
  cupon: CuponValidado;
  plan_id: string;
}

const STORAGE_KEY = 'cupon_aplicado';
const MENSAJE_ERROR_GENERICO = 'Ocurrió un error al validar el cupón. Intenta nuevamente.';

// Estado compartido: el resumen de compra, el formulario y la creación de la venta
// trabajan sobre el mismo cupón dentro del flujo de compra.
const codigoIngresado = ref('');
const cuponAplicado = ref<CuponValidado | null>(null);
/** Plan contra el que se validó el cupón aplicado */
const planIdValidado = ref<string | null>(null);
/** Último plan sobre el que se mostró el resumen de compra */
const planIdActual = ref<string | null>(null);
const errorCupon = ref('');
const validandoCupon = ref(false);
let restaurado = false;

const hayStorage = (): boolean => typeof window !== 'undefined';

const guardarEnStorage = (cupon: CuponValidado, planId: string): void => {
  if (!hayStorage()) return;
  const persistido: CuponPersistido = { cupon, plan_id: planId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistido));
};

const borrarDeStorage = (): void => {
  if (!hayStorage()) return;
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * Recupera el cupón aplicado de una sesión anterior (ej. al recargar la página).
 * Solo se ejecuta una vez por carga de página.
 */
const restaurarDesdeStorage = (): void => {
  if (restaurado || !hayStorage()) return;
  restaurado = true;

  const guardado = localStorage.getItem(STORAGE_KEY);
  if (!guardado) return;

  try {
    const persistido = JSON.parse(guardado) as CuponPersistido;
    if (!persistido?.cupon?.codigo || !persistido.plan_id) {
      borrarDeStorage();
      return;
    }
    cuponAplicado.value = persistido.cupon;
    planIdValidado.value = persistido.plan_id;
    codigoIngresado.value = persistido.cupon.codigo;
  } catch {
    borrarDeStorage();
  }
};

/** Descarta el cupón aplicado pero conserva el código escrito por el usuario */
const descartarCuponAplicado = (): void => {
  cuponAplicado.value = null;
  planIdValidado.value = null;
  borrarDeStorage();
};

const extraerMensajeError = (error: any): string => {
  return error?.response?.data?.message || MENSAJE_ERROR_GENERICO;
};

export default function useCupon() {
  /** Monto fijo a descontar del total */
  const valorDescuento = computed(() => cuponAplicado.value?.valor ?? 0);

  const cuponValidado = computed(() => cuponAplicado.value !== null);

  /** El botón "Aplicar" se habilita solo con un código escrito y sin validación en curso */
  const puedeAplicar = computed(() => codigoIngresado.value.trim() !== '' && !validandoCupon.value);

  /** Total a pagar con el descuento aplicado; nunca baja de 0 */
  const totalConDescuento = (precio: number): number => {
    return Math.max(0, precio - valorDescuento.value);
  };

  /**
   * Valida el código contra el plan que se está comprando y lo aplica si es válido.
   * @returns true si el cupón quedó aplicado
   */
  const aplicarCupon = async (planId: string): Promise<boolean> => {
    errorCupon.value = '';

    const codigo = codigoIngresado.value.trim();
    if (!codigo) {
      errorCupon.value = 'Ingresa un código de descuento';
      return false;
    }

    if (!planId) {
      errorCupon.value = MENSAJE_ERROR_GENERICO;
      return false;
    }

    validandoCupon.value = true;

    try {
      const resultado = await CuponesService.validarCupon(codigo, planId);

      if (!resultado.valido || !resultado.cupon) {
        descartarCuponAplicado();
        errorCupon.value = resultado.mensaje || 'El cupón no es válido para este plan.';
        return false;
      }

      cuponAplicado.value = resultado.cupon;
      planIdValidado.value = planId;
      codigoIngresado.value = resultado.cupon.codigo;
      guardarEnStorage(resultado.cupon, planId);
      return true;
    } catch (error) {
      descartarCuponAplicado();
      errorCupon.value = extraerMensajeError(error);
      return false;
    } finally {
      validandoCupon.value = false;
    }
  };

  /** Quita el cupón aplicado y limpia el input (acción explícita del usuario) */
  const quitarCupon = (): void => {
    descartarCuponAplicado();
    codigoIngresado.value = '';
    errorCupon.value = '';
  };

  /**
   * Ajusta el cupón al plan que se está comprando: si se aplicó contra otro plan
   * se descarta y se vuelve a validar contra el nuevo plan antes de mantenerlo.
   */
  const sincronizarConPlan = async (planId: string): Promise<void> => {
    restaurarDesdeStorage();

    if (!planId) return;

    // Un error de otro plan ya no aplica al resumen del plan actual
    if (planIdActual.value !== planId) {
      errorCupon.value = '';
      planIdActual.value = planId;
    }

    if (!cuponAplicado.value || planIdValidado.value === planId) return;

    // El descuento deja de aplicar de inmediato: solo vuelve si el nuevo plan lo acepta
    descartarCuponAplicado();
    await aplicarCupon(planId);
  };

  /**
   * Código a enviar en `codigo_descuento` al crear la venta.
   * Solo se envía si el cupón quedó validado contra ese mismo plan.
   */
  const codigoParaVenta = (planId: string): string | undefined => {
    if (!cuponAplicado.value || planIdValidado.value !== planId) return undefined;
    return cuponAplicado.value.codigo;
  };

  /**
   * El backend rechazó el cupón al crear la venta (400): se limpia del resumen
   * y se muestra el mensaje que devolvió.
   */
  const rechazarCuponDesdeVenta = (mensaje: string): void => {
    descartarCuponAplicado();
    errorCupon.value = mensaje;
  };

  return {
    codigoIngresado,
    cuponAplicado,
    errorCupon,
    validandoCupon,
    valorDescuento,
    cuponValidado,
    puedeAplicar,
    totalConDescuento,
    aplicarCupon,
    quitarCupon,
    sincronizarConPlan,
    codigoParaVenta,
    rechazarCuponDesdeVenta,
    restaurarCupon: restaurarDesdeStorage,
  };
}
