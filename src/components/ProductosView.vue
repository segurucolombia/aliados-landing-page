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
            <span class="font-semibold">{{ filteredProducts.length }}</span> productos encontrados
          </div>
        </div>
      </div>
    </section>

    <!-- Products Grid -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <ProductCard
            v-for="producto in filteredProducts"
            :key="producto.id"
            :producto="producto"
            @cotizar="handleCotizar"
            @ver-detalle="handleVerDetalle"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
          <p class="text-xl text-gray-500">No se encontraron productos en esta categoría</p>
        </div>
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
import { ref, computed } from 'vue';
import ProductCard from './ProductCard.vue';
import type { Producto } from '../types/productos';

// Datos de ejemplo - Serán reemplazados por consumo de API
const productos = ref<Producto[]>([
  {
    id: '1',
    nombre: 'Seguro de Vida',
    descripcion: 'Protege el futuro financiero de tu familia con una cobertura completa que garantiza su bienestar en caso de fallecimiento o invalidez.',
    imagen: '',
    categoria: 'Personas',
    activo: true
  },
  {
    id: '2',
    nombre: 'Seguro de Auto',
    descripcion: 'Cobertura integral para tu vehículo con asistencia 24/7, protección contra robo, daños y responsabilidad civil.',
    imagen: '',
    categoria: 'Vehículos',
    activo: true
  },
  {
    id: '3',
    nombre: 'Seguro de Hogar',
    descripcion: 'Protege tu patrimonio familiar contra incendios, robos, desastres naturales y daños estructurales.',
    imagen: '',
    categoria: 'Propiedad',
    activo: true
  },
  {
    id: '4',
    nombre: 'Seguro de Salud',
    descripcion: 'Acceso a atención médica de calidad con cobertura hospitalaria, medicamentos y consultas especializadas.',
    imagen: '',
    categoria: 'Salud',
    activo: true
  },
  {
    id: '5',
    nombre: 'Seguro de Viaje',
    descripcion: 'Viaja tranquilo con cobertura médica internacional, cancelación de viajes y protección de equipaje.',
    imagen: '',
    categoria: 'Viajes',
    activo: true
  },
  {
    id: '6',
    nombre: 'Seguro Empresarial',
    descripcion: 'Protección integral para tu negocio incluyendo responsabilidad civil, daños y compensación laboral.',
    imagen: '',
    categoria: 'Empresas',
    activo: true
  },
  {
    id: '7',
    nombre: 'Seguro de Responsabilidad Civil',
    descripcion: 'Protección contra reclamaciones por daños a terceros en tu vida personal o profesional.',
    imagen: '',
    categoria: 'Personas',
    activo: true
  },
  {
    id: '8',
    nombre: 'Seguro de Moto',
    descripcion: 'Cobertura especializada para motocicletas con asistencia vial y protección contra accidentes.',
    imagen: '',
    categoria: 'Vehículos',
    activo: true
  },
  {
    id: '9',
    nombre: 'Seguro de Educación',
    descripcion: 'Asegura el futuro educativo de tus hijos con un plan que garantiza su formación académica.',
    imagen: '',
    categoria: 'Personas',
    activo: true
  },
  {
    id: '10',
    nombre: 'Seguro de Mascotas',
    descripcion: 'Cuida la salud de tus mascotas con cobertura veterinaria y gastos médicos.',
    imagen: '',
    categoria: 'Personas',
    activo: true
  },
  {
    id: '11',
    nombre: 'Seguro Dental',
    descripcion: 'Cobertura completa para tratamientos dentales, ortodoncia y cirugías especializadas.',
    imagen: '',
    categoria: 'Salud',
    activo: true
  },
  {
    id: '12',
    nombre: 'Seguro de Alquiler',
    descripcion: 'Protege tu propiedad en alquiler contra daños, impagos y problemas legales.',
    imagen: '',
    categoria: 'Propiedad',
    activo: true
  }
]);

const selectedCategory = ref<string | null>(null);

// Obtener categorías únicas
const categories = computed(() => {
  const cats = new Set(productos.value.map(p => p.categoria).filter(Boolean));
  return Array.from(cats);
});

// Filtrar productos por categoría
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return productos.value;
  }
  return productos.value.filter(p => p.categoria === selectedCategory.value);
});

const handleCotizar = (producto: Producto) => {
  console.log('Cotizar:', producto);
  // Aquí implementarás la lógica de cotización
};

const handleVerDetalle = (producto: Producto) => {
  console.log('Ver detalle:', producto);
  // Aquí implementarás la navegación al detalle del producto
};
</script>
