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

export interface FindCuponResult {
  cupon: CuponDescuento;
  aplica: boolean;
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

    static async find(codigo: string, versionId: string): Promise<FindCuponResult | null> {
        try {
            const response = await axios.get<FindCuponResult>(`${baseUrl}/codigo/${codigo}`, {
                params: { version_id: versionId },
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