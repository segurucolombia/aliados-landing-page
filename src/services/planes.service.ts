import axios from "axios"
import type { TFiltersCotizarPlan, TPlanCotizar, GetPlanesByProductoInput, PaginatedPlanes, PlanWithDetails } from "../types/planes"
import { transformarCamposAdicionalesBackend } from "../utils/transformCamposAdicionales"
import { normalizarCamposTitular } from "../utils/camposTitular"
const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/planes'

/**
 * Deja la versión del plan lista para el formulario: normaliza los campos adicionales
 * y los campos del titular, que son la configuración de qué se le pide a cada uno.
 */
const normalizarVersion = (version: any): any => {
    if (!version) return version;

    return {
        ...version,
        ...(version.campos_adicionales
            ? { campos_adicionales: transformarCamposAdicionalesBackend(version.campos_adicionales) }
            : {}),
        campos_titular: normalizarCamposTitular(version.campos_titular),
    };
}

export class PlanesService {
    async cotizar(body:{filters: TFiltersCotizarPlan[]}):Promise<{data:TPlanCotizar[]}> {
        const response = await axios.post(`${baseUrl}/cotizar-planes`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Transformar campos adicionales en cada capacidad/plan
        const planesTransformados = response.data.map((capacidad: any) => {
            if (!capacidad.planes) return capacidad;

            return {
                ...capacidad,
                planes: capacidad.planes.map((plan: any) => {
                    if (plan.campos_adicionales) {
                        return {
                            ...plan,
                            campos_adicionales: transformarCamposAdicionalesBackend(plan.campos_adicionales)
                        };
                    }
                    return plan;
                })
            };
        });

        return { data: planesTransformados };
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

            // Normalizar la configuración de formularios de cada plan
            const planesTransformados = response.data.data.map(plan => {
                if (!plan.version) return plan;
                return { ...plan, version: normalizarVersion(plan.version) };
            });

            return {
                ...response.data,
                data: planesTransformados as any
            };
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

            if (!response.data.version) return response;

            // Normalizar la configuración de formularios (campos adicionales y titular)
            const planTransformado = {
                ...response.data,
                version: normalizarVersion(response.data.version),
            };

            return { data: planTransformado as any };
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