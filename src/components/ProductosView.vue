<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white py-20">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-12 h-1 bg-blue-300"></div>
            <span class="text-blue-200 font-semibold">Nuestros Productos</span>
            <div class="w-12 h-1 bg-blue-300"></div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            Seguros para cada necesidad
          </h1>
          <p class="text-xl text-blue-100">
            Descubre nuestra amplia gama de seguros diseñados para protegerte en cada etapa de tu vida
          </p>
        </div>
      </div>

      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="py-8 bg-white border-b sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <!-- Category Filters -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectedCategory = null"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all',
                selectedCategory === null
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Todos
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all',
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              {{ category }}
            </button>
          </div>

          <!-- Results Count -->
          <div class="text-gray-600">
            <span class="font-semibold">{{ totalProducts }}</span> productos encontrados
          </div>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
          <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
          <p class="text-gray-600 mt-4">Cargando productos...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <p class="text-xl text-red-500">{{ error }}</p>
        </div>

        <template v-else>
          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ProductCard
              v-for="producto in productos"
              :key="producto.id"
              :producto="producto"
              @cotizar="handleCotizar"
              @ver-detalle="handleVerDetalle"
            />
          </div>

          <!-- Empty State -->
          <div v-if="productos.length === 0" class="text-center py-16">
            <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-xl text-gray-500">No se encontraron productos</p>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
            <!-- Previous Button -->
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all',
                currentPage === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-600'
              ]"
            >
              Anterior
            </button>

            <!-- Page Numbers -->
            <div class="flex gap-2">
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="goToPage(page)"
                :class="[
                  'w-10 h-10 rounded-lg font-semibold transition-all',
                  page === currentPage
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                ]"
              >
                {{ page }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-lg font-semibold transition-all',
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-600'
              ]"
            >
              Siguiente
            </button>
          </div>
        </template>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿No encuentras lo que buscas?
        </h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Contáctanos y te ayudaremos a encontrar el seguro perfecto para ti
        </p>
        <button class="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg inline-flex items-center gap-2">
          Hablar con un Asesor
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import ProductCard from './ProductCard.vue';
import { ProductosService } from '../services/productos.service';
import type { Producto } from '../types/productos';

const productos = ref<Producto[]>([]);
const totalProducts = ref<number>(0);
const loading = ref<boolean>(false);
const error = ref<string | null>(null);
const selectedCategory = ref<string | null>(null);

// Paginación
const currentPage = ref<number>(1);
const itemsPerPage = 12;

// Calcular total de páginas
const totalPages = computed(() => {
  return Math.ceil(totalProducts.value / itemsPerPage);
});

// Calcular páginas visibles para la paginación
const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);

  // Ajustar el inicio si estamos cerca del final
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

// Obtener categorías únicas
const categories = computed(() => {
  // Por ahora retornamos categorías vacías, se pueden cargar desde la API si es necesario
  return [];
});

/**
 * Cargar productos desde la API
 */
const loadProductos = async () => {
  loading.value = true;
  error.value = null;

  try {
    const offset = (currentPage.value - 1) * itemsPerPage;
    const response = await ProductosService.findAll({
      limit: itemsPerPage,
      offset: offset
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

/**
 * Cambiar de página
 */
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    // Scroll hacia arriba al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/**
 * Manejar evento de cotización
 */
const handleCotizar = (producto: Producto) => {
  console.log('Cotizar:', producto);
  // Aquí implementarás la lógica de cotización
};

/**
 * Manejar evento de ver detalle
 */
const handleVerDetalle = (producto: Producto) => {
  console.log('Ver detalle:', producto);
  // Aquí implementarás la navegación al detalle del producto
};

// Cargar productos al montar el componente
onMounted(() => {
  loadProductos();
});

// Recargar productos cuando cambia la página
watch(currentPage, () => {
  loadProductos();
});
</script>
