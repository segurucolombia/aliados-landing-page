import { ref, watch, type Ref } from 'vue';
import { LandingProductosService, adaptarLanding } from '../services/landing-productos.service';
import { productoClubPorId, type ProductoClub } from '../config/clubProductos';
import { USAR_CONTENIDO_LOCAL_DE_RESPALDO } from '../config/club';
import type { ProductoLandingApi } from '../types/landing-producto';

type Origen = 'api' | 'local';

/** Datos del producto que trae la API junto con la landing (nombre, imagen, aseguradora) */
export type InfoProductoLanding = Omit<ProductoLandingApi, 'datos_landing'>;

type Resultado =
  | { tipo: 'ok'; producto: ProductoClub; info: InfoProductoLanding | null; origen: Origen }
  | { tipo: 'no-encontrado' };

/** Solo se guardan respuestas de la API (200 y 404). Los errores de red o 5xx no, para reintentar. */
const cache = new Map<string, Promise<Resultado>>();

const cargar = (productoId: string): Promise<Resultado> => {
  const enCache = cache.get(productoId);
  if (enCache) return enCache;

  const promesa = LandingProductosService.obtenerPorProducto(productoId).then(
    (data): Resultado => {
      // 404 / 422 o landing desactivada: no se muestra (tampoco el contenido local)
      if (!data || data.datos_landing.activo === false) return { tipo: 'no-encontrado' };
      const { datos_landing, ...info } = data;
      return { tipo: 'ok', producto: adaptarLanding(datos_landing), info, origen: 'api' };
    },
    (error): Resultado => {
      // Red caída o 5xx: respaldo local (si está encendido) y se reintenta en la próxima visita
      console.error('No se pudo cargar la landing del producto:', error);
      cache.delete(productoId);
      const local = USAR_CONTENIDO_LOCAL_DE_RESPALDO ? productoClubPorId(productoId) : null;
      return local ? { tipo: 'ok', producto: local, info: null, origen: 'local' } : { tipo: 'no-encontrado' };
    },
  );
  cache.set(productoId, promesa);
  return promesa;
};

/**
 * Contenido de la landing de un producto.
 * - API 200 → contenido de la API.
 * - API 404/422 → `noEncontrado` (no se usa el contenido local: el admin pudo desactivarla).
 * - Error de red o 5xx → contenido local, si `USAR_CONTENIDO_LOCAL_DE_RESPALDO` está encendido.
 *
 * `inicial` (la home con pestañas) se muestra mientras carga y se conserva si no hay landing.
 */
export default function useLandingProducto(productoId: Ref<string | null>, inicial?: Ref<ProductoClub | null>) {
  const producto = ref<ProductoClub | null>(inicial?.value ?? null);
  const info = ref<InfoProductoLanding | null>(null);
  const cargando = ref(false);
  const noEncontrado = ref(false);
  const origen = ref<Origen | null>(null);

  watch(
    productoId,
    async (id) => {
      noEncontrado.value = false;
      info.value = null;
      origen.value = null;
      if (!id) {
        producto.value = null;
        return;
      }
      producto.value = inicial?.value ?? null;
      cargando.value = true;
      const r = await cargar(id);
      if (id !== productoId.value) return; // cambió mientras cargaba
      cargando.value = false;
      if (r.tipo === 'ok') {
        producto.value = r.producto;
        info.value = r.info;
        origen.value = r.origen;
      } else if (!inicial?.value) {
        producto.value = null;
        noEncontrado.value = true;
      }
    },
    { immediate: true },
  );

  return { producto, info, cargando, noEncontrado, origen };
}
