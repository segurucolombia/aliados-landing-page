import axios from "axios"
import type { CoverageGetAtt } from "../types/coverage"
const baseUrl = `${import.meta.env.PUBLIC_BASE_URL}/api/coverage`

export default class CoverageService {
  getAll ():Promise<{data:CoverageGetAtt[]}> {
    return axios.get(`${baseUrl}/get-all-coverage`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  create (body:{name:string}):Promise<any> {
    return axios.post(`${baseUrl}/create-coverage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  update (body:CoverageGetAtt) {
    return axios.put(`${baseUrl}/update-coverage`, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  
}