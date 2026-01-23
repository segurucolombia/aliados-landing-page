import axios from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/nuevo-back/ubicaciones'

export type TLocationsColombiaAttributes = {
    code:number;
    dpto:string;
    mpio:string;
    id_mas_servicios:number;
    name:string;
}
export class UbicacionesService {
    buscarUbicacionesColombia(params:{name:string}):Promise<{data:TLocationsColombiaAttributes[]}> {
        return axios.get(`${baseUrl}/buscar-ubicaciones-colombia`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }
}