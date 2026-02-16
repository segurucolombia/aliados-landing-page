import axios from 'axios';

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados';

/**
 * Representa una ciudad de Colombia
 */
export interface Ciudad {
  id: number;
  nombre: string; // Formato: "Ciudad, Departamento"
}

/**
 * Respuesta del endpoint de ciudades
 */
export interface CiudadesResponse {
  data: Ciudad[];
  total: number;
}

/**
 * Parámetros para buscar ciudades
 */
export interface BuscarCiudadesParams {
  limit: number; // Requerido (1-100)
  search?: string; // Opcional - Búsqueda por nombre
}

/**
 * Servicio para manejar operaciones relacionadas con ciudades de Colombia
 */
export class CiudadesColombiaService {
  /**
   * Busca ciudades de Colombia
   * @param params Parámetros de búsqueda
   * @returns Listado de ciudades y total de resultados
   * @throws Error si los parámetros no son válidos o si hay un error en la petición
   */
  static async buscar(params: BuscarCiudadesParams): Promise<CiudadesResponse> {
    try {
      // Validar parámetros
      if (!params.limit) {
        throw new Error('Limit is required');
      }

      if (params.limit < 1 || params.limit > 100) {
        throw new Error('Limit must be between 1 and 100');
      }

      if (params.search !== undefined && params.search.length < 1) {
        throw new Error('Search must have at least 1 character');
      }

      const response = await axios.get<CiudadesResponse>(`${baseUrl}/ciudades`, {
        params: {
          limit: params.limit,
          ...(params.search && { search: params.search }),
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Error al buscar ciudades');
      }
      throw error;
    }
  }

  /**
   * Obtiene todas las ciudades (paginadas)
   * @param limit Número máximo de resultados (1-100)
   * @returns Listado de ciudades y total de resultados
   */
  static async listar(limit: number = 20): Promise<CiudadesResponse> {
    return this.buscar({ limit });
  }

  /**
   * Busca ciudades por nombre
   * @param search Término de búsqueda
   * @param limit Número máximo de resultados (1-100)
   * @returns Listado de ciudades filtradas y total de resultados
   */
  static async buscarPorNombre(search: string, limit: number = 20): Promise<CiudadesResponse> {
    return this.buscar({ limit, search });
  }
}
