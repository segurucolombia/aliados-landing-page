<template>
  <!-- Miembro del Club: la home de siempre, sin cambios -->
  <template v-if="esMiembro">
    <Navbar />
    <Hero />
    <CategoriasProductos />
    <MovimientoFamilias />
    <Features />
    <Products />
    <Team />
    <FAQ />
    <Footer />
  </template>

  <!-- Sin sesión: la página del Club SEGURU -->
  <ClubLanding v-else />
</template>

<script setup lang="ts">
import { watch } from 'vue';
import Navbar from './Navbar.vue';
import Hero from './Hero.vue';
import CategoriasProductos from './CategoriasProductos.vue';
import MovimientoFamilias from './MovimientoFamilias.vue';
import Features from './Features.vue';
import Products from './Products.vue';
import Team from './Team.vue';
import FAQ from './FAQ.vue';
import Footer from './Footer.vue';
import ClubLanding from './club/landing/ClubLanding.vue';
import useClubSesion from '../composables/clubSesion';

/**
 * Home según la sesión del Club. La sesión vive en localStorage, así que esta isla se
 * monta solo en el cliente (`client:only`); mientras tanto `index.astro` pinta un
 * esqueleto neutro. Al iniciar o cerrar sesión cambia sola, porque `esMiembro` es
 * estado compartido entre islas y pestañas.
 */
const { esMiembro } = useClubSesion();

const TITULO_MIEMBRO = 'Seguru - Seguros para tu Tranquilidad';

watch(esMiembro, (miembro, antes) => {
  if (miembro) document.title = TITULO_MIEMBRO;
  // Al cambiar de experiencia se empieza desde arriba
  if (antes !== undefined) window.scrollTo(0, 0);
}, { immediate: true });
</script>
