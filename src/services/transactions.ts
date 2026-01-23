import axios from "axios"
import type {  TGetTransactionAtt } from "../types/pre-venta"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/transacciones'
export class TransactionService {
    consultarTransaccion(params:{id:string}):Promise<{data:TGetTransactionAtt | null}> {
        return axios.get(`${baseUrl}/consultar-transaccion`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    crear(body:{ table_name:string; table_id:string; amount:number; }):Promise<{data:{ transaccion_id: string; hash: string; }}> {
        return axios.post(`${baseUrl}/crear-transaccion`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}