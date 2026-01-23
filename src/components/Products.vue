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
import type { Producto } from '../types/productos';

// Datos de ejemplo - serán reemplazados por consumo de API
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
  }
]);

// Mostrar solo los primeros 6 productos en la página principal
const displayedProducts = computed(() => productos.value.slice(0, 6));
const totalProducts = computed(() => 12); // Total de productos disponibles

onMounted(() => {
  // Aquí se consumirá la API cuando esté disponible
  // loadProductos();
});

// Función para cargar productos desde la API (preparada para futura implementación)
// const loadProductos = async () => {
//   try {
//     const data = await ProductosService.getProductos();
//     productos.value = data.slice(0, 6); // Solo primeros 6
//   } catch (error) {
//     console.error('Error al cargar productos:', error);
//   }
// };
</script>
