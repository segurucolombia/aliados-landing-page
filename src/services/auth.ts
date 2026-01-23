import axios from "axios"
import type { Login } from "../types/auth"
const baseUrl = import.meta.env.PUBLIC_BASE_URL  + '/api'

export class AuthService {
    login (body:Login) {
        return axios.post(`${baseUrl}/auth/login`, body, {
            headers: {
                "Content-Type": 'application/json',
            },
        })
    }
}