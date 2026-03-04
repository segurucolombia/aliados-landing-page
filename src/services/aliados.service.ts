import axios from "axios";

const baseUrl = import.meta.env.PUBLIC_BASE_URL + '/api-aliados/aliados';

export interface Persona {
  nombre: string;
  usuario_id: string;
  email: string;
  telefono: string;
  created_at: string;
  updated_at: string;
}

export interface Usuario {
  id: string;
  usuario: string;
  estado: boolean;
  rol_id: string;
  created_at: string;
  updated_at: string;
  persona?: Persona;
}

export interface CiudadColombia {
  code: number;
  dpto: string;
  mpio: string;
  id_mas_servicios: number | null;
}

export interface Aliado {
  id: string;
  codigo_unico?: string;
  direccion: string | null;
  ciudad_id: number | null;
  usuario_id: string;
  padre_id: string | null;
  tipo_identificacion: string | null;
  numero_identificacion: string | null;
  created_at: Date;
  created_by: string | null;
  updated_at: Date;
  updated_by: string | null;
  usuario?: Usuario;
  padre?: Aliado;
  hijos?: Aliado[];
  ciudad?: CiudadColombia;
  ciudad_nombre?: string;
}

export interface EncontrarAliadoParams {
  codigo_unico?: string;
  email?: string;
  telefono?: string;
}

export interface CondicionVentaInput {
  ip: string;
  condicion: string;
  created_at: string;
}

export interface CreateAliadoDto {
  tipo_identificacion: string;
  numero_identificacion: string;
  direccion?: string;
  ciudad_id?: number;
  padre_id?: string;
  created_by?: string;
  condiciones?: CondicionVentaInput[];
  usuario: {
    usuario: string;
    clave: string;
    estado?: boolean;
  };
  persona: {
    nombre: string;
    email: string;
    telefono?: string;
  };
}

export interface ValidationErrorResponse {
  message: string | string[];
  statusCode: number;
}

export interface BuscarAliadosResponse {
  data: Aliado[];
  total: number;
}

/**
 * Servicio para manejar operaciones relacionadas con aliados
 */
export class AliadosService {
  /**
   * Obtiene un aliado por su ID
   */
  static async find(id: string): Promise<Aliado | null> {
    try {
      const response = await axios.get<Aliado>(`${baseUrl}/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener aliado:', error);
      return null;
    }
  }

  /**
   * Busca aliados por nombre de usuario o nombre de persona
   */
  static async buscar(search: string, limit: number = 10): Promise<BuscarAliadosResponse> {
    const response = await axios.get<BuscarAliadosResponse>(baseUrl, {
      params: { search, limit },
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  }

  /**
   * Encuentra un aliado por codigo_unico, email o telefono.
   * @returns Aliado si lo encuentra, null si 404
   * @throws Error con mensaje de validación en caso de 422
   */
  static async encontrarAliado(params: EncontrarAliadoParams): Promise<Aliado | null> {
    try {
      const response = await axios.get<Aliado>(`${baseUrl}/encontrar-aliado`, {
        params,
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 404) return null;
        const data = error.response.data as ValidationErrorResponse;
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(msg || 'Error al buscar el aliado');
      }
      throw error;
    }
  }

  /**
   * Crea un nuevo aliado
   * @throws Error con el mensaje de validación en caso de 422
   */
  static async create(dto: CreateAliadoDto): Promise<Aliado> {
    try {
      const response = await axios.post<Aliado>(baseUrl, dto, {
        headers: { 'Content-Type': 'application/json' },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data as ValidationErrorResponse;
        const msg = Array.isArray(data.message) ? data.message.join(', ') : data.message;
        throw new Error(msg || 'Error al crear el aliado');
      }
      throw error;
    }
  }
}
