import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/debito-automatico';

export interface ReintentarPagoDto {
  venta_id: string;
  card_token_id: string;
  back_url: string;
}

export interface ReintentarPagoData {
  venta_id: string;
  mp_preapproval_id?: string;
  init_point?: string;
  external_reference?: string;
  estado?: string;
  monto_autorizado?: number;
  [key: string]: unknown;
}

export interface ReintentarPagoResponse {
  success: boolean;
  data: ReintentarPagoData;
  message?: string;
}

export class DebitoAutomaticoService {
  /**
   * Registra un nuevo intento de cobro para una venta cuyo preapproval anterior fue rechazado.
   * El backend cancela el preapproval previo y crea uno nuevo con la tarjeta provista.
   */
  static async reintentarPago(data: ReintentarPagoDto): Promise<ReintentarPagoResponse> {
    const response = await axios.post<ReintentarPagoResponse>(
      `${baseUrl}/reintentar-pago`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  }
}
