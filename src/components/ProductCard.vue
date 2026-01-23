<template>
  <div
    class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
  >
    <!-- Product Image -->
    <div class="relative h-56 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200">
      <img
        v-if="producto.imagen"
        :src="producto.imagen"
        :alt="producto.nombre"
        class="w-full h-full object-cover"
      />
      <div v-else class="flex items-center justify-center h-full">
        <svg class="w-20 h-20 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
        </svg>
      </div>

      <!-- Category Badge -->
      <div v-if="producto.categoria" class="absolute top-4 right-4 bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
        {{ producto.categoria }}
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
          href="/planes"
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
import type { Producto } from '../types/productos';

interface Props {
  producto: Producto;
}

defineProps<Props>();
defineEmits(['cotizar', 'ver-detalle']);
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
