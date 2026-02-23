import axios from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/transacciones-wompi'

export type EstadoTransaccion = 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING';

export interface ObtenerEstadoTransaccionResponse {
  transaccion: {
    id: string;
    estado: EstadoTransaccion;
    valor: number;
    tabla_nombre: string;
    tabla_id: string;
    error_interno: string | null;
    created_at: string;
  };
  venta: {
    id: string;
    estado: string;
    email: string;
    usuario: string;
    nombres: string;
    apellidos: string;
    created_at: string;
    updated_at: string;
    version_plan: { id: string; nombre: string; precio: number };
    producto: { id: string; nombre: string };
  };
}

export class TransactionService {
    obtenerEstadoTransaccion(params: { transaccion_id: string }): Promise<{ data: ObtenerEstadoTransaccionResponse }> {
        return axios.get(`${baseUrl}/${params.transaccion_id}/estado`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}