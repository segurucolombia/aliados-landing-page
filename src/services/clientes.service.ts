import axios from 'axios';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/clientes';

/**
 * Cliente tal como lo devuelve `GET /clientes/documento/:tipo_documento/:numero_documento`.
 * Los datos ya vienen enmascarados del backend ("Ma*** Pa***", "pa***@gmail.com",
 * "******4567"): se muestran tal cual, sin procesarlos.
 */
export interface ClientePorDocumento {
  cliente_id: string;
  nombre: string | null;
  correo: string | null;
  telefono: string | null;
}

export class ClientesService {
  /**
   * Busca un cliente por tipo y número de documento.
   *
   * @returns El cliente, o null si no existe (404: no es un error).
   * @throws Error de axios en cualquier otro caso.
   */
  static async buscarPorDocumento(tipo: string, numero: string): Promise<ClientePorDocumento | null> {
    const url = `${baseUrl}/documento/${encodeURIComponent(tipo.trim())}/${encodeURIComponent(numero.trim())}`;
    try {
      const response = await axios.get<ClientePorDocumento>(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error: any) {
      if (error?.response?.status === 404) return null;
      throw error;
    }
  }
}
