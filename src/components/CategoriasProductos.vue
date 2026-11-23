<template>
  <section class="py-12 md:py-16 bg-page">
    <div class="container mx-auto px-4 md:px-10">

      <!-- Título -->
      <div class="text-center mb-10">
        <p class="text-[12.5px] font-bold tracking-[.1em] uppercase text-brand mb-1.5">Nuestras soluciones</p>
        <h2 class="text-[clamp(25px,6vw,36px)] font-extrabold text-ink">
          ¿Qué solución estás buscando?
        </h2>
      </div>

      <!-- Skeleton mientras carga -->
      <div v-if="loading" class="flex justify-evenly flex-wrap gap-y-5 max-w-4xl mx-auto">
        <div
          v-for="i in 4"
          :key="i"
          class="w-44 bg-white rounded-card border border-line p-6 flex flex-col items-center gap-3 animate-pulse"
        >
          <div class="w-20 h-20 bg-gray-200 rounded-2xl"></div>
          <div class="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center text-gray-500 py-8">
        No se pudieron cargar las categorías.
      </div>

      <!-- Categorías -->
      <div v-else class="flex justify-evenly flex-wrap gap-y-5 max-w-4xl mx-auto">
        <a
          v-for="categoria in categorias"
          :key="categoria.id"
          href="/productos"
          class="group w-44 bg-white rounded-card p-6 flex flex-col items-center gap-3 transition-colors duration-200 cursor-pointer border border-line hover:border-brand"
        >
          <!-- Imagen de la categoría -->
          <div class="w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center bg-transparent">
            <img
              v-if="categoria.imagen"
              :src="categoria.imagen.url"
              :alt="categoria.nombre"
              class="w-full h-full object-contain p-1"
            />
            <!-- Fallback si no hay imagen -->
            <svg v-else class="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <p class="text-sm font-semibold text-gray-700 text-center group-hover:text-primary-600 transition-colors leading-tight">
            {{ categoria.nombre }}
          </p>
        </a>
      </div>

      <!-- Botón CTA -->
      <div class="flex justify-center mt-10">
        <a
          href="/productos"
          class="inline-flex items-center justify-center gap-2 min-h-[50px] bg-accent text-accent-ink hover:brightness-105 px-[22px] py-3 rounded-btn font-bold text-[17px] leading-tight transition"
        >
          Cotiza tu protección ahora
        </a>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { CategoriasProductosService } from '../services/categorias-productos.service';
import type { CategoriaProducto } from '../types/categorias-productos';

const categorias = ref<CategoriaProducto[]>([]);
const loading = ref(true);
const error = ref(false);

onMounted(async () => {
  try {
    const response = await CategoriasProductosService.getActivas(5);
    categorias.value = response.data;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>
