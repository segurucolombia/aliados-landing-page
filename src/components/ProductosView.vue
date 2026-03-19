<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero compacto -->
    <section class="relative overflow-hidden" style="background-color: #1a3fa8; min-height: 160px;">
      <div class="absolute inset-0">
        <img src="/img/imagen-familia.png" alt="" class="absolute inset-0 w-full h-full object-cover object-right opacity-30" aria-hidden="true" />
        <div class="absolute inset-0" style="background: linear-gradient(to right, #1a3fa8 40%, #1a3fa8bb 70%, transparent 100%);"></div>
      </div>
      <div class="relative z-10 container mx-auto px-6 md:px-10 py-10 md:py-12 flex items-center gap-4">
        <div>
          <p class="text-blue-300 font-semibold text-xs uppercase tracking-widest mb-1">Nuestros Productos</p>
          <h1 class="text-2xl md:text-3xl font-bold text-white leading-tight">
            Seguros para cada necesidad
          </h1>
        </div>
      </div>
    </section>

    <!-- Filtros sticky -->
    <section class="bg-white border-b sticky top-[72px] z-40 shadow-sm">
      <div class="container mx-auto px-6 md:px-10 py-4">
        <div class="flex flex-wrap items-center justify-between gap-3">

          <!-- Botones de categoría -->
          <div class="flex flex-wrap gap-2">
            <button
              @click="selectCategory(null)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                selectedCategoryId === null
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              Todos
            </button>

            <button
              v-for="cat in categorias"
              :key="cat.id"
              @click="selectCategory(cat.id)"
              :class="[
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200',
                selectedCategoryId === cat.id
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <img v-if="cat.imagen" :src="cat.imagen.url" :alt="cat.nombre" class="w-4 h-4 object-contain" />
              {{ cat.nombre }}
            </button>
          </div>

          <!-- Contador -->
          <span class="text-sm text-gray-500">
            <span class="font-semibold text-gray-800">{{ totalProducts }}</span> productos encontrados
          </span>
        </div>
      </div>
    </section>

    <!-- Grid de productos -->
    <section class="py-12">
      <div class="container mx-auto px-6 md:px-10">

        <!-- Loading -->
        <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div v-for="i in 8" :key="i" class="bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
            <div class="h-48 bg-gray-200"></div>
            <div class="p-5 space-y-3">
              <div class="h-5 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-red-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p class="text-gray-500">{{ error }}</p>
        </div>

        <template v-else>
          <!-- Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <ProductCard
              v-for="producto in productos"
              :key="producto.id"
              :producto="producto"
            />
          </div>

          <!-- Empty -->
          <div v-if="productos.length === 0" class="text-center py-20">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
            </svg>
            <p class="text-gray-500 text-lg">No se encontraron productos en esta categoría</p>
          </div>

          <!-- Paginación -->
          <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-200 shadow-sm'
              ]"
            >← Anterior</button>

            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page)"
              :class="[
                'w-10 h-10 rounded-full text-sm font-semibold transition-all',
                page === currentPage
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              ]"
            >{{ page }}</button>

            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-all',
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-primary-600 hover:bg-primary-50 border border-primary-200 shadow-sm'
              ]"
            >Siguiente →</button>
          </div>
        </template>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative overflow-hidden py-16" style="background-color: #1a3fa8;">
      <div class="relative z-10 container mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">¿No encuentras lo que buscas?</h2>
        <p class="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Contáctanos y te ayudaremos a encontrar el seguro perfecto para ti
        </p>
        <a
          href="https://wa.me/573154603134"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-blue-50 px-8 py-3.5 rounded-full font-semibold text-base transition-all duration-200 shadow-lg"
        >
          <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Hablar con un asesor
        </a>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import ProductCard from './ProductCard.vue';
import { ProductosService } from '../services/productos.service';
import { CategoriasProductosService } from '../services/categorias-productos.service';
import type { Producto } from '../types/productos';
import type { CategoriaProducto } from '../types/categorias-productos';

const todosLosProductos = ref<Producto[]>([]);
const categorias = ref<CategoriaProducto[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const selectedCategoryId = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = 12;

// Filtrado en cliente por categoría
const productosFiltrados = computed(() => {
  if (!selectedCategoryId.value) return todosLosProductos.value;
  return todosLosProductos.value.filter(p => p.categoria_id === selectedCategoryId.value);
});

const totalProducts = computed(() => productosFiltrados.value.length);
const totalPages = computed(() => Math.ceil(totalProducts.value / itemsPerPage));

// Página actual de productos
const productos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return productosFiltrados.value.slice(start, start + itemsPerPage);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const loadCategorias = async () => {
  try {
    const response = await CategoriasProductosService.findAll({ estado: true, limit: 50, offset: 0 });
    categorias.value = response.data;
  } catch {
    // silencioso
  }
};

const loadProductos = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await ProductosService.findAll({ limit: 200, offset: 0, estado: true });
    todosLosProductos.value = response.data.filter(p => p.estado !== false);
  } catch {
    error.value = 'Error al cargar los productos';
  } finally {
    loading.value = false;
  }
};

const selectCategory = (id: string | null) => {
  selectedCategoryId.value = id;
  currentPage.value = 1;
};

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  loadCategorias();
  loadProductos();
});
</script>
