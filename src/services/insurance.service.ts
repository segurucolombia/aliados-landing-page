import axios from "axios"
import type { BodyCatalogInsurance } from "../types/insurance"
const baseUrl = import.meta.env.PUBLIC_INSURANCE_URL + '/api'

export class InsuranceService {
    auth () {
        const email = import.meta.env.PUBLIC_MAS_EMAIL
        const password = import.meta.env.PUBLIC_MAS_PASS
        const tipo = import.meta.env.PUBLIC_MAS_TIPO
        return axios.post(`${baseUrl}/auth/token`, {
            email,
            password,
            tipo
        })
    }
    catalog (token:string, body:BodyCatalogInsurance) {
        return axios.post(`${baseUrl}/catalog`, body, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
    }
}