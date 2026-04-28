import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/debito-automatico';

export interface ConfirmarDebitoCobro {
  transaccion_id?: string;
  estado?: string;
  mensaje?: string;
  [key: string]: unknown;
}

export interface ConfirmarDebitoData {
  venta_id: string;
  preapproval_status: string;
  estado_debito: string;
  cobrado: boolean;
  cobro?: ConfirmarDebitoCobro;
}

export interface ConfirmarDebitoResponse {
  success: boolean;
  data: ConfirmarDebitoData;
  message?: string;
}

export class DebitoAutomaticoService {
  /**
   * Confirma el estado del débito automático tras volver de Mercado Pago.
   * Idempotente: llamarlo varias veces NO duplica cobros.
   */
  static async confirmar(venta_id: string): Promise<ConfirmarDebitoResponse> {
    const response = await axios.post<ConfirmarDebitoResponse>(
      `${baseUrl}/confirmar`,
      { venta_id },
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  }
}
