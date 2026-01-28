<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
  >
    <!-- Product Image -->
    <div class="relative h-56 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
      <img
        v-if="producto.imagen?.url"
        :src="getImagenUrl(producto.imagen)"
        :alt="producto.nombre"
        class="w-full h-full object-cover"
        @error="errorImagen"
      />
      <div v-else class="flex items-center justify-center h-full">
        <svg class="w-20 h-20 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>
    </div>

    <!-- Product Content -->
    <div class="p-6">
      <h3 class="text-2xl font-bold text-gray-900 mb-3">
        {{ producto.nombre }}
      </h3>
      <p class="text-gray-600 mb-6 leading-relaxed line-clamp-3">
        {{ producto.descripcion }}
      </p>

      <!-- Action Buttons -->
      <div class="flex gap-3">
        <a
          :href="`/planes/${producto.id}`"
          class="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold text-center"
        >
          Ver Planes
        </a>
        <button
          @click="$emit('ver-detalle', producto)"
          class="flex-1 border-2 border-primary-600 text-primary-600 px-4 py-3 rounded-lg hover:bg-primary-50 transition-colors font-semibold"
        >
          Más Info
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Producto, ImagenAws } from '../types/productos';

interface Props {
  producto: Producto;
}

defineProps<Props>();
defineEmits(['cotizar', 'ver-detalle']);

const getImagenUrl = (imagen: ImagenAws) => {
  if (!imagen?.url) return '';

  // Por ahora usar solo la URL que viene del backend
  // El archivo en S3 está guardado con el ID como nombre
  console.log('Usando URL del backend:', imagen.url);
  return imagen.url;
};

const errorImagen = (event: Event) => {
  const target = event.target as HTMLImageElement;
  console.error('Error cargando imagen:', target.src);

  // Ocultar la imagen y mostrar el placeholder
  target.style.display = 'none';
  const parent = target.parentElement;

  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center">
        <svg class="w-20 h-20 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
      </div>
    `;
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
