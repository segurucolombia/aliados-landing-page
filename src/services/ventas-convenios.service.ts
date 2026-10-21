import axios from 'axios';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados';

export type EstadoVentaConvenio = 'PENDIENTE' | 'GESTIONADA' | 'PAGADA' | 'CANCELADA';

export interface VersionProductoConvenio {
  id: string;
  producto_convenio_id: string;
  nombre: string;
  descripcion: string | null;
  /** Valor mensual de esa versión */
  valor: number;
}

/**
 * Detalle de una venta de convenio (GET /ventas-convenios/:id). Las fechas son fechas
 * sin hora aunque lleguen en ISO con `T00:00:00.000Z`: se leen en UTC.
 */
export interface VentaConvenioDetalle {
  id: string;
  estado: EstadoVentaConvenio;
  aliado_id: string;
  version_producto_id: string;
  entidad_id: string;
  periodo_meses: number;
  fecha_inicio: string;
  fecha_fin: string;
  valor_mensual: number;
  valor_total: number;
  renovacion_automatica: boolean;
  /** Si es false la venta no se puede pagar */
  debito_automatico_activo: boolean;

  // Datos del cliente: null mientras la venta está PENDIENTE
  dob: string | null;
  tipo_documento: string | null;
  numero_documento: string | null;
  nombres: string | null;
  apellidos: string | null;
  ciudad: string | null;
  departamento: string | null;
  correo: string | null;
  celular_1: string | null;
  celular_2: string | null;

  created_at: string;
  updated_at: string;

  /** Versión con la que se vendió */
  version_producto: VersionProductoConvenio;
  producto: {
    id: string;
    publico: boolean;
    deleted_at: string | null;
    /** Versión actual del producto */
    version_vigente: VersionProductoConvenio | null;
  };
  entidad: { id: string; nombre: string; estado: boolean };
  /** El asesor */
  aliado: {
    id: string;
    numero_identificacion: string | null;
    codigo_unico: string | null;
    nombre: string | null;
    email: string | null;
    telefono: string | null;
  };
}

/** Body de `PUT /gestionar-ventas-convenios`. `dob` va como YYYY-MM-DD. */
export interface GestionarVentaConvenioInput {
  venta_id: string;
  dob: string;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  ciudad: string;
  departamento: string;
  correo: string;
  celular_1: string;
  celular_2: string | null;
}

/**
 * Body de `PUT /gestionar-ventas-convenios` cuando ya es cliente. El backend completa
 * con su última venta lo que no venga, y lo que venga reemplaza al de esa venta: por
 * eso los campos vacíos se omiten, nunca se mandan como "".
 */
export interface GestionarVentaConvenioConClienteInput
  extends Partial<Omit<GestionarVentaConvenioInput, 'venta_id' | 'tipo_documento' | 'numero_documento'>> {
  venta_id: string;
  cliente_id: string;
  tipo_documento: string;
  numero_documento: string;
}

/** 422 con cliente_id: su última venta no tiene estos datos y hay que pedirlos */
const PREFIJO_DATOS_FALTANTES = 'Faltan datos del cliente que su última venta no tiene:';

/** Los campos que pidió el backend, o null si el error no es de datos faltantes */
export const datosFaltantesCliente = (error: any): string[] | null => {
  const mensaje = String(error?.response?.data?.message ?? '');
  if (error?.response?.status !== 422 || !mensaje.startsWith(PREFIJO_DATOS_FALTANTES)) return null;

  return mensaje
    .slice(PREFIJO_DATOS_FALTANTES.length)
    .split(',')
    .map((campo) => campo.trim())
    .filter(Boolean);
};

/** 404 porque el cliente_id ya no existe (no la venta) */
export const esClienteNoEncontrado = (error: any): boolean =>
  error?.response?.status === 404
  && String(error?.response?.data?.message ?? '').startsWith('No se encontró el cliente con id');

interface RespuestaVentaConvenio {
  success: boolean;
  data: VentaConvenioDetalle;
  message: string;
}

/** Body de `POST /ventas-convenios/pagar`. Solo viaja el token de Mercado Pago, nunca la tarjeta. */
export interface PagarVentaConvenioInput {
  venta_id: string;
  /** Token de un solo uso: solo se reutiliza para verificar un pago en proceso (202) */
  card_token_id: string;
  back_url?: string;
}

export type CobroVentaConvenio =
  | { cobrado: true; payment_id: string }
  | { cobrado: false; status: 'en_proceso' };

/**
 * Resultado de pagar. `aprobado` (200) trae la venta ya PAGADA; `en_proceso` (202) no es
 * un error: Mercado Pago autorizó la tarjeta pero aún no confirma el cobro.
 */
export type ResultadoPagoConvenio =
  | { resultado: 'aprobado'; venta: VentaConvenioDetalle; payment_id: string; message: string }
  | { resultado: 'en_proceso'; venta: VentaConvenioDetalle; message: string };

interface RespuestaPagoConvenio {
  success: boolean;
  data: { venta: VentaConvenioDetalle; cobro: CobroVentaConvenio };
  message: string;
}

/** Cómo se debe reaccionar a un error de `POST /ventas-convenios/pagar` */
export type MotivoErrorPago =
  /** 402: Mercado Pago rechazó el cobro. Se puede reintentar con otra tarjeta. */
  | 'rechazado'
  /** 4xx con `code`: Mercado Pago no aceptó la suscripción (token vencido, datos de tarjeta...) */
  | 'mercado-pago'
  /** 409 "Ya hay un pago en curso": se verifica como un 202 */
  | 'pago-en-curso'
  /** 409 porque la venta ya está pagada */
  | 'ya-pagada'
  /** 409 por estado: cancelada, no gestionada o débito desactivado */
  | 'conflicto'
  | 'no-encontrada'
  | 'validacion'
  | 'inesperado';

export const motivoErrorPago = (error: any): MotivoErrorPago => {
  const status = error?.response?.status;
  const data = error?.response?.data ?? {};

  if (status === 402) return 'rechazado';
  if (status === 404) return 'no-encontrada';
  if (status === 409) {
    const mensaje = String(data.message ?? '');
    if (/pago en curso/i.test(mensaje)) return 'pago-en-curso';
    return /pagada/i.test(mensaje) ? 'ya-pagada' : 'conflicto';
  }
  if (status === 422) return 'validacion';
  if (status >= 400 && status < 500 && data.code) return 'mercado-pago';
  return 'inesperado';
};

/** Motivos de rechazo de Mercado Pago (`detalle` de un 402) en palabras del cliente */
const MOTIVOS_RECHAZO_MP: Record<string, string> = {
  cc_rejected_insufficient_amount: 'La tarjeta no tiene fondos suficientes.',
  cc_rejected_bad_filled_security_code: 'El código de seguridad (CVV) no es correcto.',
  cc_rejected_bad_filled_date: 'La fecha de vencimiento no es correcta.',
  cc_rejected_bad_filled_card_number: 'El número de la tarjeta no es correcto.',
  cc_rejected_bad_filled_other: 'Revisa los datos de la tarjeta.',
  cc_rejected_call_for_authorize: 'Tu banco necesita que autorices el pago. Comunícate con él.',
  cc_rejected_card_disabled: 'La tarjeta no está activa. Comunícate con tu banco.',
  cc_rejected_max_attempts: 'Superaste el número de intentos permitidos con esta tarjeta.',
  cc_rejected_duplicated_payment: 'Ya hiciste un pago por este valor.',
  cc_rejected_high_risk: 'El pago no fue aprobado por seguridad.',
  cc_rejected_blacklist: 'El pago no fue aprobado por seguridad.',
};

/** El motivo de un 402 para el cliente; vacío si no se reconoce (nunca el código técnico) */
export const motivoRechazoMercadoPago = (error: any): string =>
  MOTIVOS_RECHAZO_MP[String(error?.response?.data?.detalle ?? '')] ?? '';

/** Las ventas en estos estados todavía admiten que el cliente complete o corrija sus datos */
export const esGestionable = (estado: EstadoVentaConvenio): boolean =>
  estado === 'PENDIENTE' || estado === 'GESTIONADA';

export class VentasConveniosService {
  /**
   * Obtiene una venta de convenio por su ID.
   *
   * @throws Error de axios. 404 = no existe, 422 = el id no es un UUID válido.
   */
  static async obtener(id: string): Promise<VentaConvenioDetalle> {
    const response = await axios.get<RespuestaVentaConvenio>(`${baseUrl}/ventas-convenios/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.data;
  }

  /**
   * Guarda los datos del cliente y deja la venta en GESTIONADA. Devuelve la venta
   * completa, así que no hace falta volver a pedirla.
   *
   * @throws Error de axios. 422 = validación (el `message` empieza con el campo),
   *         404 = no existe la venta o el cliente (`esClienteNoEncontrado`),
   *         409 = la venta ya no está en un estado gestionable.
   *         Con cliente_id, un 422 puede ser de datos faltantes (`datosFaltantesCliente`).
   */
  static async gestionar(
    input: GestionarVentaConvenioInput | GestionarVentaConvenioConClienteInput,
  ): Promise<VentaConvenioDetalle> {
    const response = await axios.put<RespuestaVentaConvenio>(
      `${baseUrl}/gestionar-ventas-convenios`,
      input,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data.data;
  }

  /**
   * Activa el débito automático y cobra `valor_total`. Puede tardar unos 10 segundos.
   * Llamarlo otra vez con el mismo token después de un 202 no vuelve a cobrar: el
   * backend revisa primero el intento anterior con Mercado Pago.
   *
   * @throws Error de axios. Ver `motivoErrorPago`; el `message` siempre es para el cliente.
   */
  static async pagar(input: PagarVentaConvenioInput): Promise<ResultadoPagoConvenio> {
    const response = await axios.post<RespuestaPagoConvenio>(
      `${baseUrl}/ventas-convenios/pagar`,
      input,
      { headers: { 'Content-Type': 'application/json' }, timeout: 30000 },
    );

    const { venta, cobro } = response.data.data;
    if (response.status === 200 && cobro.cobrado) {
      return { resultado: 'aprobado', venta, payment_id: cobro.payment_id, message: response.data.message };
    }
    return { resultado: 'en_proceso', venta, message: response.data.message };
  }
}
