import axios from "axios"
import type { TFiltersCotizarPlan, TPlanCotizar } from "../types/planes"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/planes'

export class PlanesService {
    cotizar(body:{filters: TFiltersCotizarPlan[]}):Promise<{data:TPlanCotizar[]}> {
        return axios.post(`${baseUrl}/cotizar-planes`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}