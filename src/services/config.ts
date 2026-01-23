import axios from "axios"
const baseUrl = import.meta.env.PUBLIC_BASE_URL_OLD_BACK + '/api/config'

export class ConfigService {
    getConfigTypePerson () {
      return axios.get(`${baseUrl}/get-type-person-config`, {
        headers: {
          Authorization: localStorage.token
        }
      })
    }

    getConfigCustomerDocuments () {
      return axios.get(`${baseUrl}/get-config-customer-documents`, {
        headers: {
          Authorization: localStorage.token
        }
      })
    }
}