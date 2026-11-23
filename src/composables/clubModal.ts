import { ref } from 'vue';
import { CLAVES_STORAGE } from '../config/club';

/**
 * Estado del modal del Club, compartido entre islas (Navbar lo monta; PlanesView y
 * el login de la navbar lo abren).
 */

export type PestanaClub = 'unirme' | 'miembro';

/**
 * - `contratar`: venía de "Contratar" / "Elegir plan" (se muestran los pasos 1 → 2).
 * - `cotizacion`: "Solo enviarme la cotización" (registro sin intención de compra).
 * - `ninguna`: lo abrió desde la navbar.
 */
export type IntencionClub = 'contratar' | 'cotizacion' | 'ninguna';

export interface AbrirClubOpciones {
  pestana?: PestanaClub;
  intencion?: IntencionClub;
  /** Correo a precargar en "Unirme" (p. ej. el de Google cuando no está registrado) */
  email?: string;
  /** Se llama cuando la persona inicia sesión desde el modal (no al registrarse: queda pendiente de activar) */
  alIniciarSesion?: () => void;
  /** URL interna a la que vuelve "Continuar a contratar" tras activar la cuenta (por defecto, la actual) */
  retorno?: string;
}

const visible = ref(false);
const pestana = ref<PestanaClub>('unirme');
const intencion = ref<IntencionClub>('ninguna');
const emailInicial = ref('');
let callbackSesion: (() => void) | undefined;

/** Guarda la página actual para volver a ella después de activar la cuenta */
export const guardarRetorno = (url = window.location.pathname + window.location.search + window.location.hash) => {
  try {
    localStorage.setItem(CLAVES_STORAGE.retorno, url);
  } catch {
    // sin storage: se vuelve a la home
  }
};

/** URL a la que vuelve "Continuar a contratar". Solo rutas internas. */
export const leerRetorno = (): string => {
  try {
    const url = localStorage.getItem(CLAVES_STORAGE.retorno);
    if (url && url.startsWith('/') && !url.startsWith('//')) return url;
  } catch {
    // ignore
  }
  return '/';
};

export const limpiarRetorno = () => {
  try {
    localStorage.removeItem(CLAVES_STORAGE.retorno);
  } catch {
    // ignore
  }
};

const abrir = (opciones: AbrirClubOpciones = {}) => {
  pestana.value = opciones.pestana ?? 'unirme';
  intencion.value = opciones.intencion ?? 'ninguna';
  emailInicial.value = opciones.email ?? '';
  callbackSesion = opciones.alIniciarSesion;
  if (intencion.value !== 'ninguna') guardarRetorno(opciones.retorno);
  visible.value = true;
};

const cerrar = () => {
  visible.value = false;
  callbackSesion = undefined;
};

/** Lo llama el modal cuando la persona inicia sesión */
const notificarSesionIniciada = () => {
  const callback = callbackSesion;
  cerrar();
  callback?.();
};

export default function useClubModal() {
  return { visible, pestana, intencion, emailInicial, abrir, cerrar, notificarSesionIniciada };
}
