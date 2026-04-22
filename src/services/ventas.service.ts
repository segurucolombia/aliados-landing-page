import axios from "axios";

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
  datos_adicionales?: import('../types/planes').CamposAdicionalesCapturados;
  condiciones: CondicionVentaInput[];
  debito_automatico?: boolean;
  card_token_id?: string;
}

export interface CobroDebitoAutomatico {
  cobrado: boolean;
  payment_id?: string;
  status?: string;
  error?: string;
  [key: string]: unknown;
}

export interface DebitoAutomaticoVentaResponse {
  id: string | null;
  cliente_id: string | null;
  version_id: string;
  mp_preapproval_id: string | null;
  init_point: string | null;
  external_reference: string;
  estado: 'ACTIVO' | 'ERROR' | string;
  monto_autorizado: number;
  cobro: CobroDebitoAutomatico;
}

export interface CreateVentaResponse {
  transaccion_id?: string;
  venta_id?: string;
  debito_automatico?: DebitoAutomaticoVentaResponse;
}

export class VentasService {
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
