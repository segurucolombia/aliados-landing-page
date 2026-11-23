<template>
  <div class="bg-page text-ink pb-32 md:pb-24">
    <ClubEncabezado :productos="opciones" :actual="clave" @entrar="acciones.entrar" @elegir="elegir" />

    <main :key="clave">
      <LandingProductoContenido :producto="producto" />
    </main>

    <Footer />
    <ClubBarraInferior :whatsapp="whatsapp" @contratar="acciones.contratar" />
  </div>

  <!-- En este modo no hay Navbar: el modal del Club se monta aquí -->
  <ClubModal />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Footer from '../../Footer.vue';
import ClubModal from '../ClubModal.vue';
import ClubEncabezado from './ClubEncabezado.vue';
import ClubBarraInferior from './ClubBarraInferior.vue';
import LandingProductoContenido from './LandingProductoContenido.vue';
import { whatsappUrl } from '../../../config/club';
import { CLAVES_PRODUCTO, PRODUCTOS_CLUB, mensajeWhatsapp, type ClaveProducto } from '../../../config/clubProductos';
import useClubAcciones from '../../../composables/clubAcciones';
import useLandingProducto from '../../../composables/landingProducto';

/**
 * Home sin sesión: la landing de los productos del Club con pestañas (#eq, #md, #fp, #hg).
 * El contenido de cada pestaña se pide a la API; mientras llega (o si no existe) se usa
 * el contenido local de `clubProductos.ts`.
 */
const esClave = (v: string): v is ClaveProducto => (CLAVES_PRODUCTO as string[]).includes(v);
const claveDelHash = (): ClaveProducto => {
  const h = window.location.hash.replace('#', '');
  return esClave(h) ? h : 'eq';
};

const clave = ref<ClaveProducto>(claveDelHash());
const local = computed(() => PRODUCTOS_CLUB[clave.value]);
const { producto: desdeApi } = useLandingProducto(
  computed(() => local.value.productoId),
  local,
);
const producto = computed(() => desdeApi.value ?? local.value);

const opciones = CLAVES_PRODUCTO.map((k) => ({ clave: k, etiqueta: PRODUCTOS_CLUB[k].chip }));
const acciones = useClubAcciones(producto);
const whatsapp = computed(() => whatsappUrl(mensajeWhatsapp(producto.value)));

const elegir = (k: string) => {
  if (!esClave(k)) return;
  clave.value = k;
  try {
    history.replaceState(null, '', `#${k}`);
  } catch {
    // ignore
  }
  window.scrollTo(0, 0);
};

const alCambiarHash = () => {
  const h = window.location.hash.replace('#', '');
  if (esClave(h)) clave.value = h;
};

watch(
  producto,
  (p) => {
    document.title = `Club SEGURU · ${p.chip}`;
  },
  { immediate: true },
);

onMounted(() => window.addEventListener('hashchange', alCambiarHash));
onBeforeUnmount(() => window.removeEventListener('hashchange', alCambiarHash));
</script>
