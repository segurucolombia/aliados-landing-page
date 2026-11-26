<template>
  <ClubSeccion id="club-resenas" kick="Lo que dicen nuestros clientes" titulo="Reseñas reales en Google" :fondo="fondo">
    <!-- Trustindex pinta el widget junto a su script; por eso el script se inserta aquí dentro -->
    <div ref="contenedor" class="min-h-[280px]"></div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ClubSeccion from './ClubSeccion.vue';
import { TRUSTINDEX_RESENAS_SRC } from '../../../config/club';

withDefaults(defineProps<{ fondo?: 'blanco' | 'azulClaro' }>(), { fondo: 'blanco' });

const contenedor = ref<HTMLDivElement | null>(null);

onMounted(() => {
  if (!contenedor.value || contenedor.value.querySelector('script')) return;
  const script = document.createElement('script');
  script.src = TRUSTINDEX_RESENAS_SRC;
  script.defer = true;
  script.async = true;
  contenedor.value.appendChild(script);
});
</script>
