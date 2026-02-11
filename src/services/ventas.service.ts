import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/ventas';

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
  nit?: string;
  empresa_nombre?: string;
  tipo_persona?: string;
  aliado_id?: string;
  codigo_descuento?: string;
  datos_adicionales?: import('../types/planes').CamposAdicionalesCapturados; // Objeto JSON
}

export interface CreateVentaResponse {
  transaccion_id: string;
}

export class VentasService {
  /**
   * Crea una nueva venta
   * @param data Datos de la venta
   * @returns ID de transacción generado
   */
  static async crear_venta(data: CreateVentaDto): Promise<CreateVentaResponse> {
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
