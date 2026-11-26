<template>
  <div class="bg-page text-ink min-h-screen" :class="producto ? 'pb-32 md:pb-24' : ''">
    <!-- Sin menú "Otros seguros": la página de un producto se enfoca solo en ese producto -->
    <ClubEncabezado @entrar="acciones.entrar" />

    <!-- Cargando: esqueleto con la estructura del hero y las tarjetas -->
    <div v-if="!producto && cargando" role="status" aria-live="polite">
      <span class="sr-only">Cargando…</span>
      <div class="bg-brand-deep h-[420px] animate-pulse motion-reduce:animate-none"></div>
      <div :class="[CONTENEDOR, 'py-12 grid gap-3 md:grid-cols-3']">
        <div v-for="i in 3" :key="i" class="h-32 rounded-card bg-white border border-line animate-pulse motion-reduce:animate-none"></div>
      </div>
    </div>

    <!-- El producto no tiene landing -->
    <section v-else-if="!producto" :class="[CONTENEDOR, 'py-20 text-center']" aria-labelledby="landing-404">
      <p :class="KICK">Club SEGURU</p>
      <h1 id="landing-404" class="mt-2 font-display text-[clamp(28px,6vw,40px)] font-extrabold">No encontramos esta página</h1>
      <p class="mt-3 text-muted text-lg max-w-[34em] mx-auto">
        Este producto todavía no tiene su página informativa. Puedes ver sus planes, mirar todos nuestros productos o escribirnos.
      </p>
      <div class="mt-6 flex flex-wrap justify-center gap-2.5">
        <!-- Productos sin landing: sus planes (los precios se ven con sesión del Club) -->
        <a :href="`/planes/${encodeURIComponent(productoId)}`" :class="BTN.principal">Ver planes del producto</a>
        <a href="/productos" :class="BTN.borde">Ver productos</a>
        <a :href="whatsappUrl()" target="_blank" rel="noopener" :class="BTN.borde">Hablar por WhatsApp</a>
      </div>
    </section>

    <main v-else :key="producto.productoId">
      <LandingProductoContenido :producto="producto" />
    </main>

    <Footer />
    <ClubBarraInferior v-if="producto" :whatsapp="whatsapp" @contratar="acciones.contratar" />
  </div>

  <!-- Sin Navbar: el modal del Club se monta aquí -->
  <ClubModal />
</template>

<script setup lang="ts">
import { computed, toRef, watch } from 'vue';
import Footer from '../../Footer.vue';
import ClubModal from '../ClubModal.vue';
import ClubEncabezado from './ClubEncabezado.vue';
import ClubBarraInferior from './ClubBarraInferior.vue';
import LandingProductoContenido from './LandingProductoContenido.vue';
import { BTN, CONTENEDOR, KICK } from './clubEstilos';
import { whatsappUrl } from '../../../config/club';
import { PRODUCTOS_CLUB, mensajeWhatsapp, type ProductoClub } from '../../../config/clubProductos';
import useClubAcciones from '../../../composables/clubAcciones';
import useLandingProducto from '../../../composables/landingProducto';

/**
 * Landing de un producto para compartir: /{slug}/{productoId}.
 * Los aliados comparten este enlace (con ?aliado_id=… y opcionalmente ?cupon_descuento=…,
 * que procesa Layout.astro). El contenido viene de la API por `productoId`; el slug es solo
 * para que el enlace sea legible y se corrige si no coincide con el de la landing.
 */
const props = defineProps<{ productoId: string; slug: string }>();

const { producto, cargando } = useLandingProducto(toRef(props, 'productoId'));

// Los botones necesitan un producto aunque todavía no haya cargado (p. ej. "Ya soy miembro")
const productoAcciones = computed<ProductoClub>(() => producto.value ?? PRODUCTOS_CLUB.eq);
const acciones = useClubAcciones(productoAcciones);
const whatsapp = computed(() => whatsappUrl(mensajeWhatsapp(productoAcciones.value)));

const ponerMeta =(nombre: string, valor: string, atributo: 'name' | 'property' = 'name') => {
  let meta = document.head.querySelector<HTMLMetaElement>(`meta[${atributo}="${nombre}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(atributo, nombre);
    document.head.appendChild(meta);
  }
  meta.content = valor;
};

watch(
  producto,
  (p) => {
    if (!p) return;
    const titulo = p.seoTitulo || `${p.kick} · SEGURU`;
    document.title = titulo;
    const descripcion = p.seoDescripcion || p.sub;
    ponerMeta('description', descripcion);
    ponerMeta('og:title', titulo, 'property');
    ponerMeta('og:description', descripcion, 'property');

    // Enlace canónico: /{slug}/{productoId}, conservando la query (aliado, cupón) y el hash
    if (p.slug && p.slug !== props.slug) {
      try {
        const { search, hash } = window.location;
        history.replaceState(null, '', `/${encodeURIComponent(p.slug)}/${encodeURIComponent(p.productoId)}${search}${hash}`);
      } catch {
        // ignore
      }
    }
  },
  { immediate: true },
);
</script>
