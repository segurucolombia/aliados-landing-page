<template>
  <div class="bg-white rounded-2xl transition-all duration-300 overflow-hidden border border-line flex flex-col hover:border-brand">
    <!-- Imagen -->
    <div class="relative h-48 bg-soft overflow-hidden">
      <img
        v-if="producto.imagen?.url"
        :src="getImagenUrl(producto.imagen)"
        :alt="producto.nombre"
        class="w-full h-full object-cover"
        @error="errorImagen"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg class="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>

      <!-- Badge categoría -->
      <div v-if="producto.categoria" class="absolute top-3 left-3">
        <span class="bg-accent-soft text-accent-ink text-[13px] font-bold px-[11px] py-1 rounded-full">
          {{ producto.categoria.nombre }}
        </span>
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-5 flex flex-col flex-1">
      <h3 class="text-lg font-bold text-gray-900 mb-2 leading-snug">
        {{ producto.nombre }}
      </h3>
      <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 flex-1">
        {{ producto.descripcion }}
      </p>

      <!-- Footer -->
      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <!-- Aseguradora -->
        <span v-if="producto.aseguradora" class="text-xs text-gray-400 truncate max-w-[120px]">
          {{ producto.aseguradora.nombre }}
        </span>
        <span v-else class="text-xs text-gray-400">Seguru</span>

        <a
          :href="enlace"
          class="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2 rounded-btn transition-all duration-200 shadow-sm hover:shadow-sm"
        >
          Ver producto
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Producto, ImagenAws } from '../types/productos';
import { slugDeTexto } from '../config/clubProductos';

interface Props {
  producto: Producto;
}

const props = defineProps<Props>();

/**
 * Ruta del producto: /{slug}/{productoId}. La landing consulta su información por el id;
 * el slug sale del nombre y, si no coincide con el de la landing, ella lo corrige.
 */
const enlace = computed(() => `/${slugDeTexto(props.producto.nombre)}/${props.producto.id}`);
defineEmits(['cotizar', 'ver-detalle']);

const getImagenUrl = (imagen: ImagenAws) => imagen?.url ?? '';

const errorImagen = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
  const parent = target.parentElement;
  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full flex items-center justify-center">
        <svg class="w-16 h-16 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
        </svg>
      </div>`;
  }
};
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
