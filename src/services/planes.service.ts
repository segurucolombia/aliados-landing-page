import axios from "axios"
import type { TFiltersCotizarPlan, TPlanCotizar, GetPlanesByProductoInput, PaginatedPlanes, PlanWithDetails } from "../types/planes"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/planes'

export class PlanesService {
    cotizar(body:{filters: TFiltersCotizarPlan[]}):Promise<{data:TPlanCotizar[]}> {
        return axios.post(`${baseUrl}/cotizar-planes`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    /**
     * Obtiene los planes por producto con sus coberturas
     * @param params Parámetros de búsqueda (producto_id, limit, offset, estado)
     * @returns Lista paginada de planes con coberturas
     */
    static async obtenerPlanesPorProducto(params: Partial<GetPlanesByProductoInput>): Promise<PaginatedPlanes> {
        try {
            const queryParams: GetPlanesByProductoInput = {
                producto_id: params.producto_id || '',
                limit: params.limit || 50,
                offset: params.offset || 0,
                estado: params.estado !== undefined ? params.estado : true
            };

            const response = await axios.get<PaginatedPlanes>(`${baseUrl}`, {
                params: queryParams,
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error al obtener planes por producto:', error);
            throw error;
        }
    }

    /**
     * Obtiene el detalle de un plan por su ID
     * @param planId ID del plan a buscar
     * @returns Plan con todos sus detalles (producto, versión, coberturas, documento)
     */
    static async findById(planId: string): Promise<{data:PlanWithDetails}> {
        try {
            const response = await axios.get<PlanWithDetails>(`${baseUrl}/${planId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response;
        } catch (error) {
            console.error('Error al obtener detalle del plan:', error);
            throw error;
        }
    }

    /**
     * Obtiene la URL firmada de un documento de AWS S3
     * @param documentoId ID del documento
     * @returns URL firmada para acceder al documento
     */
    static async getDocumentoUrl(documentoId: string): Promise<string> {
        try {
            const documentosBaseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/documentos';
            const response = await axios.get<{ url: string }>(`${documentosBaseUrl}/${documentoId}/url`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            return response.data.url;
        } catch (error) {
            console.error('Error al obtener URL del documento:', error);
            throw error;
        }
    }
}