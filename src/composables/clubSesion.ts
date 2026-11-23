import axios, { type InternalAxiosRequestConfig } from 'axios';
import { computed, ref } from 'vue';
import { CLAVES_STORAGE } from '../config/club';
import { API_ALIADOS_URL, ClubService, type RespuestaSesion } from '../services/club.service';

/**
 * Sesión del Club SEGURU.
 *
 * El estado vive a nivel de módulo: las islas de Astro de una misma página (Navbar,
 * PlanesView…) importan este mismo módulo y comparten la sesión. Entre pestañas se
 * sincroniza con el evento `storage`.
 *
 * En localStorage solo se guarda el token y datos para mostrar o prellenar formularios.
 * Nunca la contraseña.
 */

/** Datos no sensibles para prellenar el titular del wizard de compra */
export interface PerfilClub {
  nombre?: string;
  email?: string;
  telefono?: string;
  numero_documento?: string;
  tipo_documento?: string;
  nombres?: string;
  apellidos?: string;
  dob?: string;
}

const enNavegador = typeof window !== 'undefined';

const leer = (clave: string): string | null => {
  if (!enNavegador) return null;
  try {
    return localStorage.getItem(clave);
  } catch {
    return null;
  }
};

const leerPerfil = (): PerfilClub => {
  try {
    return JSON.parse(leer(CLAVES_STORAGE.perfil) || '{}') as PerfilClub;
  } catch {
    return {};
  }
};

const token = ref<string | null>(leer(CLAVES_STORAGE.token));
const nombre = ref<string | null>(leer(CLAVES_STORAGE.nombre));
const usuarioId = ref<string | null>(leer(CLAVES_STORAGE.usuarioId));
const clienteId = ref<string | null>(leer(CLAVES_STORAGE.clienteId));
const perfil = ref<PerfilClub>(leerPerfil());

const esMiembro = computed(() => !!token.value);

const recargarDesdeStorage = () => {
  token.value = leer(CLAVES_STORAGE.token);
  nombre.value = leer(CLAVES_STORAGE.nombre);
  usuarioId.value = leer(CLAVES_STORAGE.usuarioId);
  clienteId.value = leer(CLAVES_STORAGE.clienteId);
  perfil.value = leerPerfil();
};

const texto = (valor: unknown): string | undefined =>
  typeof valor === 'string' && valor.trim() ? valor.trim() : undefined;

/** Primer nombre para saludar ("¡Ya eres parte del Club, Ana!") */
export const primerNombre = (completo: string | null | undefined): string =>
  (completo || '').trim().split(/\s+/)[0] || '';

const guardar = (clave: string, valor: string | null | undefined) => {
  try {
    if (valor) localStorage.setItem(clave, valor);
    else localStorage.removeItem(clave);
  } catch {
    // Sin storage (modo privado): la sesión dura lo que dure la página
  }
};

/** Guarda la sesión con la respuesta de login, Google o activar cuenta */
const iniciarSesion = (respuesta: RespuestaSesion) => {
  const { usuario } = respuesta;
  const cliente = (usuario.cliente ?? {}) as Record<string, unknown>;

  const nuevoPerfil: PerfilClub = {
    nombre: texto(usuario.persona?.nombre),
    email: texto(usuario.persona?.email) ?? texto(cliente.email),
    telefono: texto(usuario.persona?.telefono) ?? texto(cliente.telefono),
    // El usuario con el que se inicia sesión es el número de documento
    numero_documento: texto(cliente.numero_documento) ?? texto(usuario.usuario),
    tipo_documento: texto(cliente.tipo_documento),
    nombres: texto(cliente.nombres),
    apellidos: texto(cliente.apellidos),
    dob: texto(cliente.dob),
  };

  const nombreSesion = nuevoPerfil.nombre
    ?? [nuevoPerfil.nombres, nuevoPerfil.apellidos].filter(Boolean).join(' ')
    ?? null;

  guardar(CLAVES_STORAGE.token, respuesta.token);
  guardar(CLAVES_STORAGE.nombre, nombreSesion || null);
  guardar(CLAVES_STORAGE.usuarioId, usuario.id);
  guardar(CLAVES_STORAGE.clienteId, usuario.cliente?.id ?? null);
  guardar(CLAVES_STORAGE.perfil, JSON.stringify(nuevoPerfil));

  token.value = respuesta.token;
  nombre.value = nombreSesion || null;
  usuarioId.value = usuario.id;
  clienteId.value = usuario.cliente?.id ?? null;
  perfil.value = nuevoPerfil;
};

/** Borra la sesión local sin llamar al backend (token vencido o inválido) */
const cerrarSesionLocal = () => {
  for (const clave of [
    CLAVES_STORAGE.token,
    CLAVES_STORAGE.nombre,
    CLAVES_STORAGE.usuarioId,
    CLAVES_STORAGE.clienteId,
    CLAVES_STORAGE.perfil,
  ]) {
    guardar(clave, null);
  }
  token.value = null;
  nombre.value = null;
  usuarioId.value = null;
  clienteId.value = null;
  perfil.value = {};
};

/** Cierra la sesión en el backend y en el navegador. La local se borra aunque falle la llamada. */
const cerrarSesion = async () => {
  const actual = token.value;
  cerrarSesionLocal();
  if (!actual) return;
  try {
    await ClubService.logout(actual);
  } catch {
    // El token ya no está en el navegador; si el backend no respondió, vence solo
  }
};

// ---------------------------------------------------------------------------
// Interceptores: se instalan una sola vez por página
// ---------------------------------------------------------------------------

/** Rutas públicas de autenticación: no llevan el token de la sesión */
const RUTAS_SIN_TOKEN = [
  '/auth/login',
  '/auth/google',
  '/auth/activar-cuenta',
  '/auth/reenviar-activacion',
  '/clientes/registro',
];

const esDelBackendAliados = (config: InternalAxiosRequestConfig): boolean => {
  const url = config.url ?? '';
  const completa = config.baseURL && !/^https?:\/\//.test(url) ? config.baseURL + url : url;
  return completa.startsWith(API_ALIADOS_URL);
};

const instalarInterceptores = () => {
  const global = globalThis as { __clubInterceptores?: boolean };
  if (!enNavegador || global.__clubInterceptores) return;
  global.__clubInterceptores = true;

  axios.interceptors.request.use((config) => {
    if (!token.value || !esDelBackendAliados(config)) return config;
    if (RUTAS_SIN_TOKEN.some((ruta) => (config.url ?? '').includes(ruta))) return config;
    if (!config.headers.has('Authorization')) {
      config.headers.set('Authorization', `Bearer ${token.value}`);
    }
    return config;
  });

  axios.interceptors.response.use(undefined, (error) => {
    // Un 401 de una llamada que llevaba el token de la sesión: el token ya no sirve
    const enviado = error?.config?.headers?.get?.('Authorization') ?? error?.config?.headers?.Authorization;
    if (error?.response?.status === 401 && token.value && enviado === `Bearer ${token.value}`) {
      cerrarSesionLocal();
    }
    return Promise.reject(error);
  });

  window.addEventListener('storage', (evento) => {
    if (evento.key === null || evento.key.startsWith('club_')) recargarDesdeStorage();
  });
};

instalarInterceptores();

export default function useClubSesion() {
  return {
    token,
    nombre,
    usuarioId,
    clienteId,
    perfil,
    esMiembro,
    iniciarSesion,
    cerrarSesion,
    cerrarSesionLocal,
  };
}
