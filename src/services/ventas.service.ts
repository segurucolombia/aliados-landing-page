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

export interface CreateVentaDto {
  producto_id: string;
  version_id: string;
  email: string;
  clave: string;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  dob?: string;
  nit?: string;
  empresa_nombre?: string;
  tipo_persona?: string;
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
 * Extrae los motivos de rechazo de un error de venta (HTTP 422).
 * Devuelve [] si el error es de otro tipo.
 */
export function extraerRechazos(error: any): RechazoVenta[] {
  if (error?.response?.status !== 422) return [];
  const rechazos = error?.response?.data?.rechazos;
  return Array.isArray(rechazos) ? rechazos : [];
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
    if (!data.dob) throw new Error('La fecha de nacimiento (dob) es requerida para personas naturales.');
    console.log('data creando venta', data)
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
