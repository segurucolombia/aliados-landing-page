import { onBeforeUnmount, onMounted, ref } from 'vue';
import { AliadosService } from '../services/aliados.service';
import { CLAVES_STORAGE } from '../config/club';

/**
 * Nombre del aliado que compartió el enlace, para "Te lo compartió {nombre}…".
 *
 * `Layout.astro` valida el `aliado_id` del enlace, lo guarda en localStorage junto con
 * el nombre y emite `aliado:enlazado`. Solo se muestra un nombre mientras exista
 * `aliado_id` (la compra lo borra al terminar). Si hay id pero no nombre (enlaces
 * anteriores a este cambio), se consulta una vez.
 */
export default function useAliadoActual() {
  const nombre = ref<string | null>(null);

  const leer = (clave: string): string | null => {
    try {
      return localStorage.getItem(clave);
    } catch {
      return null;
    }
  };

  const cargar = async () => {
    const id = leer('aliado_id');
    if (!id) {
      nombre.value = null;
      return;
    }
    const guardado = leer(CLAVES_STORAGE.aliadoNombre);
    if (guardado) {
      nombre.value = guardado;
      return;
    }
    const aliado = await AliadosService.find(id).catch(() => null);
    // Solo el nombre de la persona: el usuario puede ser un número de documento
    const encontrado = aliado?.usuario?.persona?.nombre?.trim() || null;
    if (encontrado && leer('aliado_id') === id) {
      nombre.value = encontrado;
      try {
        localStorage.setItem(CLAVES_STORAGE.aliadoNombre, encontrado);
      } catch {
        // sin storage: se muestra solo en esta visita
      }
    }
  };

  const alEnlazar = (evento: Event) => {
    // Un enlace nuevo reemplaza al aliado anterior, aunque el nuevo no tenga nombre
    const detalle = (evento as CustomEvent<{ nombre?: string | null }>).detail;
    nombre.value = detalle?.nombre || null;
  };

  onMounted(() => {
    cargar();
    window.addEventListener('aliado:enlazado', alEnlazar);
  });
  onBeforeUnmount(() => window.removeEventListener('aliado:enlazado', alEnlazar));

  return { nombre };
}
