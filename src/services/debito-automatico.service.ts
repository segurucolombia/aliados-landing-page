import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/debito-automatico';

export interface CrearPreapprovalDto {
  venta_id: string;
  card_token_id: string;
  created_by: string;
}

export interface CobroPreapproval {
  cobrado: boolean;
  error?: string;
  [key: string]: unknown;
}

export interface CrearPreapprovalResponse {
  cobro?: CobroPreapproval;
  [key: string]: unknown;
}

export class DebitoAutomaticoService {
  /**
   * Crea un preapproval en Mercado Pago y cobra la primera venta.
   * @param data Datos necesarios para crear el preapproval
   * @returns Respuesta con el resultado del cobro
   */
  static async crear_preapproval(data: CrearPreapprovalDto): Promise<CrearPreapprovalResponse> {
    try {
      const response = await axios.post<CrearPreapprovalResponse>(
        `${baseUrl}/crear-preapproval`,
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error al crear preapproval de débito automático:', error);
      throw error;
    }
  }
}
