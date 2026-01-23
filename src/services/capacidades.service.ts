import axios from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/capacidades'

export class CapacidadesService {
    obtenerCapacidadMaxima():Promise<{data:{ capacidad_maxima: number }}> {
        return axios.get(`${baseUrl}/obtener-capacidad-maxima`, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}