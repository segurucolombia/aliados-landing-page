import axios from "axios";
import type {
  AdicionalCotizacion,
  CotizacionVenta,
  CotizarVentaInput,
  CotizarVentaResponse,
  RechazoVenta,
  RespuestaCampo,
} from "../types/cotizacion";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/ventas';

export interface CondicionVentaInput {
  ip: string;
  condicion: string;
  created_at: string;
}

/**
 * Body de `POST /ventas`.
 *
 * Los datos del titular van dos veces: en `titular` (indexado por `clave`, el mismo
 * objeto que se mandó a cotizar) y en los campos fijos de siempre, que todavía leen
 * otras partes del sistema. Cuando llega `titular`, el backend deriva de ahí los
 * campos fijos y sobrescribe lo que reciba en ellos: por eso los dos se arman del
 * mismo estado (`src/utils/titularVenta.ts`) y no pueden divergir.
 *
 * Una versión con reglas de cobro sobre el titular **exige** `titular`: sin él la
 * venta se rechaza con 422.
 */
export interface CreateVentaDto {
  producto_id: string;
  version_id: string;
  email?: string;
  clave: string;
  tipo_documento?: string;
  numero_documento?: string;
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  /** Fecha de nacimiento (`FECHA_NACIMIENTO` en la configuración del titular) */
  dob?: string;
  nit?: string;
  empresa_nombre?: string;
  tipo_persona?: string;
  /**
   * Los datos del titular indexados por la `clave` de `version.campos_titular`. Es el
   * mismo objeto que se manda a `POST /ventas/cotizar`: si difieren, el cliente ve un
   * precio y paga otro. Ojo: acá la fecha de nacimiento va con su `clave`
   * (`fecha_nacimiento`), mientras que el campo fijo se sigue llamando `dob`.
   */
  titular?: import('../types/planes').TitularEnvio;
  aliado_id?: string;
  codigo_descuento?: string;
  /** Las mismas respuestas que se cotizaron. El backend recotiza con ellas. */
  respuestas?: RespuestaCampo[];
  datos_adicionales?: import('../types/planes').CamposAdicionalesCapturados;
  condiciones: CondicionVentaInput[];
  debito_automatico?: boolean;
  card_token_id?: string;
  back_url?: string;
}

export interface DebitoAutomaticoVentaResponse {
  id: string | null;
  cliente_id: string | null;
  version_id: string;
  mp_preapproval_id: string | null;
  init_point: string;
  external_reference: string;
  estado: string;
  monto_autorizado: number;
}

export interface CreateVentaResponse {
  transaccion_id?: string;
  venta_id?: string;
  debito_automatico?: DebitoAutomaticoVentaResponse;
}

/**
 * Detalle completo de una venta (GET /ventas/:id).
 */
export interface VentaDetalle {
  id: string;
  usuario: string;
  email: string;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  nit: string | null;
  empresa_nombre: string | null;
  tipo_persona: string | null;
  dob: string | null;
  version_plan_id: string;
  producto_id: string;
  aliado_id: string | null;
  cliente_id: string | null;
  codigo_descuento: string | null;
  /** Precio de la versión al momento de vender */
  valor_version: number;
  /** Suma de los cobros por campos adicionales */
  valores_adicionales: number;
  valor_descuento: number;
  /** Lo único que se cobra: valor_version + valores_adicionales - valor_descuento */
  valor_total: number;
  /**
   * Lo que respondió el cliente y lo que se le cobró por cada respuesta. Las filas
   * sin `concepto` no son cobros (ver `src/utils/adicionalesVenta.ts`).
   */
  adicionales: AdicionalCotizacion[];
  /**
   * Snapshot crudo del formulario, indexado por nombre de campo. Solo sirve para
   * repintar los inputs: los precios salen de `adicionales` y `valor_total`.
   */
  datos_adicionales: import('../types/planes').CamposAdicionalesCapturados | null;
  renovacion_automatica: boolean;
  debito_automatico: boolean;
  venta_renovada: boolean;
  /** Venta de la que salió esta (renovación); null en una venta original */
  venta_origen_id?: string | null;
  estado: 'PENDIENTE' | 'COMPLETADO';
  created_at: string;
  updated_at: string;

  producto: { id: string; nombre: string; descripcion: string };

  cliente: { id: string; nit: string; nombre_comercial: string } | null;

  version_plan: {
    id: string;
    nombre: string;
    descripcion: string;
    valor_asegurado: number;
    vigencia_inicio: string;
    vigencia_numero_meses: number;
    precio: number;
    valor_debito_automatico: number | null;
    campos_adicionales: import('../types/planes').CamposAdicionalesConfig | null;
    plan: { id: string; producto_id: string; version_id: string; estado: boolean; mostrar_publico: boolean } | null;
    coberturas: Array<{
      cobertura_id: string;
      valor: string;
      descripcion: string | null;
      cobertura: { id: string; nombre: string; descripcion: string | null };
    }>;
  };

  aliado: {
    id: string;
    numero_identificacion: string;
    usuario: { persona: { nombre: string; email: string } | null } | null;
  } | null;

  transaccion: {
    id: string;
    estado: string;
    valor: number;
    created_at: string;
    proveedor: 'wompi' | 'mercado_pago';
  } | null;

  suscripcion: { id: string; fecha_inicio: string; fecha_fin: string; estado: string } | null;
}

/**
 * Body de `PUT /ventas/:id/cotizacion`. No lleva `version_id`: la versión del plan
 * la toma de la venta, y el endpoint no la cambia.
 */
export interface ActualizarCotizacionVentaInput {
  /** null (o ausente) quita el cupón: para conservarlo hay que reenviarlo siempre */
  codigo_descuento?: string | null;
  /**
   * Set COMPLETO de respuestas: reemplaza a las guardadas, no hace merge. Si el
   * cliente quitó un registro de un grupo, no se manda y los `numero_registro`
   * que quedan se renumeran desde 1.
   */
  respuestas: RespuestaCampo[];
  /** Snapshot crudo del formulario, para repintarlo al volver a entrar */
  datos_adicionales?: import('../types/planes').CamposAdicionalesCapturados;
}

/** Desglose que quedó guardado en la venta: `valor_total` es lo que se va a cobrar */
export interface CotizacionVentaActualizada extends CotizacionVenta {
  venta_id: string;
}

/**
 * Extrae los motivos de rechazo de un error de venta (HTTP 422).
 * Devuelve [] si el error es de otro tipo.
 */
export function extraerRechazos(error: any): RechazoVenta[] {
  if (error?.response?.status !== 422) return [];
  const rechazos = error?.response?.data?.rechazos;
  return Array.isArray(rechazos) ? rechazos : [];
}

/**
 * Problemas de los datos del titular al crear la venta (HTTP 422 con `problemas`):
 * un obligatorio sin responder, un campo que la versión no pide, una opción inválida.
 * Son textos escritos para el cliente. Devuelve [] si el error es de otro tipo.
 */
export function extraerProblemasTitular(error: any): string[] {
  if (error?.response?.status !== 422) return [];

  const problemas = error?.response?.data?.problemas;
  return Array.isArray(problemas) ? problemas.filter((p: any) => typeof p === 'string') : [];
}

/**
 * La versión cobra por los datos del titular y la venta llegó sin ellos (HTTP 422 sin
 * `problemas` ni `rechazos`). Es un error de la landing, no del cliente: se envía
 * `titular` siempre que la versión configure campos del titular.
 */
export function esTitularNoEnviado(error: any): boolean {
  if (error?.response?.status !== 422) return false;
  if (extraerProblemasTitular(error).length > 0 || extraerRechazos(error).length > 0) return false;

  return /titular/i.test(String(error?.response?.data?.message ?? ''));
}

/**
 * Un campo marcado como no repetible ya tiene ese valor en otra venta (HTTP 409 de
 * `POST /ventas`). Puede ser cualquier campo que el admin haya marcado así, no solo el
 * documento, y el mensaje del backend es el que se le muestra al cliente.
 */
export function mensajeValorRepetido(error: any): string {
  if (error?.response?.status !== 409) return '';

  return String(
    error?.response?.data?.message
      ?? 'Ya existe una venta registrada con estos datos.',
  );
}

/** Los tres motivos por los que el backend rechaza recotizar una venta (HTTP 409) */
export type MotivoConflictoVenta = 'no-pendiente' | 'debito-automatico' | 'pago-en-curso';

/**
 * Distingue cuál de los tres 409 devolvió `PUT /ventas/:id/cotizacion`. El backend los
 * separa por el `message`, así que se identifican por texto.
 */
export function motivoConflicto(error: any): MotivoConflictoVenta | null {
  if (error?.response?.status !== 409) return null;

  const mensaje = String(error?.response?.data?.message ?? '');
  if (/transacci[oó]n de pago en curso|pago en curso/i.test(mensaje)) return 'pago-en-curso';
  if (/d[eé]bito autom[aá]tico/i.test(mensaje)) return 'debito-automatico';
  return 'no-pendiente';
}

export class VentasService {
  /**
   * Cotiza la venta con las respuestas del formulario. No crea ni reserva nada,
   * así que se puede llamar en cada cambio del formulario (con debounce).
   *
   * @throws Error de axios. Un 422 trae los motivos por los que no se puede vender
   *         en `response.data.rechazos` (ver `extraerRechazos`).
   */
  static async cotizar(input: CotizarVentaInput): Promise<CotizacionVenta> {
    const response = await axios.post<CotizarVentaResponse>(`${baseUrl}/cotizar`, input, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.data;
  }

  /**
   * Guarda en la venta el cupón y las respuestas con las que se recotizó, y devuelve
   * el desglose que quedó registrado. El total no se manda: lo recalcula el backend
   * contra la versión del plan de la venta.
   *
   * Hay que llamarlo SIEMPRE antes de crear la transacción de pago, aunque el cliente
   * no haya cambiado nada: si ya hay un intento de pago en curso responde 409, y si
   * el intento está abandonado (más de diez minutos) lo anula y deja cobrar de una.
   *
   * @throws Error de axios. 400 = el cupón no aplica (el `message` es para el
   *         cliente), 422 = las respuestas no permiten vender (`extraerRechazos`),
   *         409 = la venta no se puede recotizar (ver `motivoConflicto`), 404 = no
   *         existe.
   */
  static async actualizarCotizacion(
    id: string,
    input: ActualizarCotizacionVentaInput,
  ): Promise<CotizacionVentaActualizada> {
    const response = await axios.put<{ success: boolean; data: CotizacionVentaActualizada }>(
      `${baseUrl}/${id}/cotizacion`,
      input,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data.data;
  }

  /**
   * Obtiene el detalle completo de una venta por su ID.
   */
  static async obtenerDetalle(id: string): Promise<VentaDetalle> {
    const response = await axios.get<VentaDetalle>(`${baseUrl}/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

  /**
   * Crea una nueva venta
   * @param data Datos de la venta
   * @returns ID de transacción generado
   */
  static async crear_venta(data: CreateVentaDto): Promise<CreateVentaResponse> {
    // Qué datos del titular son obligatorios lo decide la configuración de la versión
    // (`campos_titular`), no este servicio.
    try {
      const response = await axios.post<CreateVentaResponse>(
        `${baseUrl}`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al crear venta:', error);
      throw error;
    }
  }
}
