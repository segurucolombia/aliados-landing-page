import axios from 'axios';

/** Base del backend de aliados (la misma de aliados.service.ts) */
export const API_ALIADOS_URL = import.meta.env.PUBLIC_BASE_URL + '/api-aliados';

/** Documentos aceptados en el registro al Club (ver CLUB_DOCUMENT_TYPES) */
export type TipoDocumento = 'CC' | 'CE' | 'OTRO';
export type TipoPersona = 'Natural' | 'Juridica';

export interface RegistroClienteInput {
  tipo_documento: TipoDocumento;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipo_persona: TipoPersona;
  nit: string | null;
  empresa_nombre: string | null;
  aliado_id?: string;
  acepta_tratamiento_datos: true;
  acepta_compartir_aseguradoras: boolean;
}

export interface RegistroClienteData {
  cliente_id: string;
  email: string;
  correo_enviado: boolean;
}

export interface UsuarioSesion {
  id: string;
  usuario: string;
  rol_nombre?: string;
  persona?: { nombre?: string; telefono?: string; email?: string };
  cliente?: { id: string; [campo: string]: unknown } | null;
}

/** Respuesta de login, Google y activar cuenta */
export interface RespuestaSesion {
  token: string;
  usuario: UsuarioSesion;
  permisos?: unknown;
}

export interface ReenvioActivacionData {
  email: string;
  correo_cambiado: boolean;
  correo_enviado: boolean;
}

/** Error del backend: `message` ya viene en español para mostrarlo tal cual */
export class ClubError extends Error {
  constructor(
    message: string,
    public readonly status: number | null,
    public readonly code: string | null,
  ) {
    super(message);
    this.name = 'ClubError';
  }
}

const MENSAJE_GENERICO = 'No pudimos completar la solicitud. Revisa tu conexión e intenta de nuevo.';

const aClubError = (error: unknown): ClubError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? null;
    const data = error.response?.data as { message?: string | string[]; code?: string } | undefined;
    const mensaje = Array.isArray(data?.message) ? data.message.join('. ') : data?.message;
    if (status === 429 && !mensaje) {
      return new ClubError('Hiciste demasiados intentos. Espera unos minutos y vuelve a intentarlo.', status, null);
    }
    return new ClubError(mensaje || MENSAJE_GENERICO, status, data?.code ?? null);
  }
  return new ClubError(MENSAJE_GENERICO, null, null);
};

const post = async <T>(ruta: string, body: unknown, token?: string): Promise<T> => {
  try {
    const { data } = await axios.post<T>(`${API_ALIADOS_URL}${ruta}`, body, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
    return data;
  } catch (error) {
    throw aClubError(error);
  }
};

export const ClubService = {
  async registrar(input: RegistroClienteInput): Promise<RegistroClienteData> {
    const res = await post<{ data: RegistroClienteData }>('/clientes/registro', input);
    return res.data;
  },

  activarCuenta(token: string): Promise<RespuestaSesion> {
    return post<RespuestaSesion>('/auth/activar-cuenta', { token });
  },

  async reenviarActivacion(numero_documento: string, clave: string, email?: string) {
    const res = await post<{ message: string; data: ReenvioActivacionData }>('/auth/reenviar-activacion', {
      numero_documento,
      clave,
      ...(email && { email }),
    });
    return res;
  },

  login(usuario: string, clave: string): Promise<RespuestaSesion> {
    return post<RespuestaSesion>('/auth/login', { usuario, clave });
  },

  google(id_token: string): Promise<RespuestaSesion> {
    // `origen: 'landing'`: el backend solo deja entrar a clientes del Club.
    // Nunca enviar 'plataforma' desde aquí (ese valor admite cualquier rol).
    return post<RespuestaSesion>('/auth/google', { id_token, origen: 'landing' });
  },

  async logout(token: string): Promise<void> {
    await post<unknown>('/auth/logout', {}, token);
  },
};
