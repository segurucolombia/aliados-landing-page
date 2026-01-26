import axios from "axios"
import type { TCrearPreventaAtt, TGetPreventaAtt } from "../types/pre-venta"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/pre-venta'
export class PreVentaService {
    crearPreVenta(body:TCrearPreventaAtt):Promise<{data:{ id_transaction: string, hash: string }}> {
        return axios.post(`${baseUrl}/crear-preventa`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
    find(params:{ id?: string; cliente_id?:string; }):Promise<{data:TGetPreventaAtt}> {
        return axios.get(`${baseUrl}/find-preventa`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}