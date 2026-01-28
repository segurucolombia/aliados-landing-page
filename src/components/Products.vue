<template>
  <section id="productos" class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
          Nuestros Productos
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Descubre nuestra amplia gama de seguros diseñados para protegerte en cada etapa de tu vida
        </p>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <ProductCard
          v-for="producto in displayedProducts"
          :key="producto.id"
          :producto="producto"
        />
      </div>

      <!-- Ver Más Button -->
      <div class="text-center">
        <a
          href="/productos"
          class="inline-flex items-center gap-3 bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg font-semibold text-lg"
        >
          Ver Todos los Productos
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </a>
        <p class="mt-4 text-gray-600">
          Descubre más de <span class="font-semibold text-primary-600">{{ totalProducts }}</span> productos disponibles
        </p>
      </div>

      <!-- Empty State -->
      <div v-if="productos.length === 0" class="text-center py-12">
        <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="text-xl text-gray-500">Los productos se cargarán desde el servidor</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';
import { ProductosService } from '../services/productos.service';
import type { Producto } from '../types/productos';

const productos = ref<Producto[]>([]);
const totalProducts = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);

// Mostrar solo los primeros 6 productos en la página principal
const displayedProducts = computed(() => productos.value);

/**
 * Cargar productos desde la API
 */
const loadProductos = async () => {
  loading.value = true;
  error.value = null;

  try {
    const response = await ProductosService.findAll({
      limit: 6,
      offset: 0
    });

    productos.value = response.data;
    totalProducts.value = response.total;
  } catch (err) {
    console.error('Error al cargar productos:', err);
    error.value = 'Error al cargar los productos';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProductos();
});
</script>
