import axios from "axios"
import type { TCuponAttributes, TFiltrosBuscarCupones } from "../types/cupones"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/cupones'

export class CuponesService {
    buscar(params:TFiltrosBuscarCupones):Promise<{data:TCuponAttributes | null}> {
        return axios.get(`${baseUrl}/buscar`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}