import axios from "axios"
import type { TCuponAttributes, TFiltrosBuscarCupones } from "../types/cupones"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/documentos-clientes-polizas'

export class DocumentosClientesPolizasService {
    crear(body:any) {
    return axios.post(`${baseUrl}/crear-documentos-clientes-polizas`, body, {
        headers: {
          Authorization: localStorage.token,
          'Content-Type': 'multipart/form-data',
        }
    })
  }
}