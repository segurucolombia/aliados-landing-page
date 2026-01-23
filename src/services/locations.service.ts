import axios from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api'

type TParamsSearchLocation = {
    name:string
}
export default class LocationsService {
    search (params:TParamsSearchLocation) {
        return axios.get(`${baseUrl}/locations/search-locations`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        }) 
    }
}