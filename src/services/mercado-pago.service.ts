import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/transacciones-mercado-pago';

export interface CrearTransaccionDebitoDto {
  venta_id: string;
  card_token_id: string;
  back_url?: string;
  created_by?: string;
}

export interface CrearTransaccionDebitoData {
  mp_preapproval_id?: string;
  init_point?: string;
  estado?: string;
  [key: string]: unknown;
}

export interface CrearTransaccionDebitoResponse {
  success: boolean;
  data: CrearTransaccionDebitoData;
  message?: string;
}

export class MercadoPagoService {
  /**
   * Crea la transacción de débito automático (preapproval) para una venta existente.
   * El primer cobro lo procesa Mercado Pago de inmediato; si responde ok significa
   * que el preapproval quedó registrado y el cobro fue cursado.
   * POST /transacciones-mercado-pago/crear-transaccion-debito
   */
  static async crearTransaccionDebito(
    data: CrearTransaccionDebitoDto,
  ): Promise<CrearTransaccionDebitoResponse> {
    const response = await axios.post<CrearTransaccionDebitoResponse>(
      `${baseUrl}/crear-transaccion-debito`,
      data,
      { headers: { 'Content-Type': 'application/json' } },
    );
    return response.data;
  }
}
