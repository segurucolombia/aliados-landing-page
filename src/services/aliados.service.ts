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

/**
 * Servicio para manejar operaciones relacionadas con aliados
 */
export class AliadosService {
  /**
   * Obtiene un aliado por su ID
   * @param id ID del aliado
   * @returns Aliado encontrado o null si no existe
   */
  static async find(id: string): Promise<Aliado | null> {
    try {
      const response = await axios.get<Aliado>(`${baseUrl}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener aliado:', error);
      return null;
    }
  }
}
