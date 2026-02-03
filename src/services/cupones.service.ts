import axios from "axios"
import type { TCuponAttributes, TFiltrosBuscarCupones } from "../types/cupones"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/cupones-descuento'

export interface CuponDescuento {
  id: string;
  estado: boolean;
  codigo: string;
  valor: number;
  aliado_id: string | null;
  aliado_nombre?: string | null;
  aliado_email?: string | null;
  created_at: Date;
  created_by: string;
  updated_at: Date;
  updated_by: string;
}

export class CuponesService {
    buscar(params:TFiltrosBuscarCupones):Promise<{data:TCuponAttributes | null}> {
        return axios.get(`${baseUrl}/buscar`, {
            params,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    /**
     * Obtiene un cupón por su código
     * @param codigo Código del cupón
     * @returns Cupón encontrado o null si no existe
     */
    static async find(codigo: string): Promise<CuponDescuento | null> {
        try {
            const response = await axios.get<CuponDescuento>(`${baseUrl}/codigo/${codigo}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error al obtener cupón:', error);
            return null;
        }
    }
}