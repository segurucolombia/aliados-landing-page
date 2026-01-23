<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-32 pt-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <ol class="flex items-center gap-2 text-sm text-blue-200">
              <li><a href="/" class="hover:text-white transition-colors">Inicio</a></li>
              <li><span>/</span></li>
              <li><a href="/productos" class="hover:text-white transition-colors">Productos</a></li>
              <li><span>/</span></li>
              <li class="text-white font-semibold">{{ productoPlanes.productoNombre }}</li>
            </ol>
          </nav>

          <div class="text-center">
            <div class="flex items-center justify-center gap-3 mb-">
              <div class="w-12 h-1 bg-blue-300"></div>
              <span class="text-blue-200 font-semibold">Planes Disponibles</span>
              <div class="w-12 h-1 bg-blue-300"></div>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              {{ productoPlanes.productoNombre }}
            </h1>

            <p v-if="productoPlanes.productoDescripcion" class="text-xl text-blue-100 max-w-3xl mx-auto">
              {{ productoPlanes.productoDescripcion }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.planes.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Planes disponibles</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.coberturas.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Coberturas incluidas</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-4xl font-bold">24/7</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Atención disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <!-- Planes Comparison Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <!-- Titulo de la sección -->
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compara nuestros planes
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <!-- Tabla de Comparación -->
        <PlanesTable
          :planes="productoPlanes.planes"
          :coberturas="productoPlanes.coberturas"
          @seleccionar-plan="handleSeleccionarPlan"
        />
      </div>
    </section>

    <!-- Info adicional -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Información Importante</h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Todos los planes incluyen atención al cliente 24/7</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Puedes cambiar de plan en cualquier momento</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Sin cargos ocultos, precio transparente</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Cobertura respaldada por aseguradoras reconocidas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Nuestros asesores están listos para ayudarte a encontrar el plan perfecto
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Llamar Ahora
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors text-lg inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chat en Vivo
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PlanesTable from './PlanesTable.vue';
import type { ProductoPlanes, Plan } from '../types/planes';

// Datos de ejemplo - Serán reemplazados por consumo de API
const productoPlanes = ref<ProductoPlanes>({
  productoId: '1',
  productoNombre: 'Seguro de Auto',
  productoDescripcion: 'Protección completa para tu vehículo con múltiples opciones de cobertura',
  coberturas: [
    { id: '1', nombre: 'Responsabilidad Civil', descripcion: 'Cubre daños a terceros', orden: 1 },
    { id: '2', nombre: 'Daños Materiales', descripcion: 'Cubre daños al vehículo asegurado', orden: 2 },
    { id: '3', nombre: 'Robo Total', descripcion: 'Cubre el robo total del vehículo', orden: 3 },
    { id: '4', nombre: 'Asistencia Vial 24/7', descripcion: 'Servicio de grúa y asistencia mecánica', orden: 4 },
    { id: '5', nombre: 'Conductor Elegido', descripcion: 'Cubre solo conductor designado', orden: 5 },
    { id: '6', nombre: 'Gastos Médicos', descripcion: 'Cobertura médica para ocupantes', orden: 6 },
    { id: '7', nombre: 'Auto Sustituto', descripcion: 'Vehículo de reemplazo durante reparación', orden: 7 },
    { id: '8', nombre: 'Cristales y Lunas', descripcion: 'Reemplazo de vidrios', orden: 8 },
  ],
  planes: [
    {
      id: '1',
      nombre: 'Básico',
      descripcion: 'Protección esencial',
      precio: 450000,
      moneda: 'COP',
      periodicidad: 'anual',
      destacado: false,
      coberturas: [
        { coberturaId: '1', aplica: true, valorCubierto: 50000000, descripcion: 'Hasta $50M' },
        { coberturaId: '2', aplica: false },
        { coberturaId: '3', aplica: false },
        { coberturaId: '4', aplica: true, descripcion: 'Básica', detalles: 'Hasta 100km' },
        { coberturaId: '5', aplica: true },
        { coberturaId: '6', aplica: false },
        { coberturaId: '7', aplica: false },
        { coberturaId: '8', aplica: false },
      ]
    },
    {
      id: '2',
      nombre: 'Completo',
      descripcion: 'Cobertura amplia',
      precio: 850000,
      moneda: 'COP',
      periodicidad: 'anual',
      destacado: true,
      coberturas: [
        { coberturaId: '1', aplica: true, valorCubierto: 100000000, descripcion: 'Hasta $100M' },
        { coberturaId: '2', aplica: true, valorCubierto: 80000000, descripcion: 'Hasta $80M' },
        { coberturaId: '3', aplica: true, valorCubierto: 150000000, descripcion: 'Valor comercial' },
        { coberturaId: '4', aplica: true, descripcion: 'Completa', detalles: 'Ilimitado' },
        { coberturaId: '5', aplica: false, descripcion: 'Cualquier conductor' },
        { coberturaId: '6', aplica: true, valorCubierto: 20000000, descripcion: 'Hasta $20M' },
        { coberturaId: '7', aplica: true, descripcion: '15 días', detalles: 'Vehículo categoría similar' },
        { coberturaId: '8', aplica: true, descripcion: 'Sin deducible' },
      ]
    },
    {
      id: '3',
      nombre: 'Premium',
      descripcion: 'Máxima protección',
      precio: 1200000,
      moneda: 'COP',
      periodicidad: 'anual',
      destacado: false,
      coberturas: [
        { coberturaId: '1', aplica: true, valorCubierto: 200000000, descripcion: 'Hasta $200M' },
        { coberturaId: '2', aplica: true, valorCubierto: 150000000, descripcion: 'Valor total' },
        { coberturaId: '3', aplica: true, valorCubierto: 200000000, descripcion: 'Valor total + 10%' },
        { coberturaId: '4', aplica: true, descripcion: 'Premium', detalles: 'Ilimitado + taxi' },
        { coberturaId: '5', aplica: false, descripcion: 'Cualquier conductor' },
        { coberturaId: '6', aplica: true, valorCubierto: 50000000, descripcion: 'Hasta $50M' },
        { coberturaId: '7', aplica: true, descripcion: '30 días', detalles: 'Vehículo gama alta' },
        { coberturaId: '8', aplica: true, descripcion: 'Sin deducible + tintado' },
      ]
    }
  ]
});

const handleSeleccionarPlan = (plan: Plan) => {
  console.log('Plan seleccionado:', plan);
  // Aquí implementarás la lógica para cotizar o contratar el plan
  alert(`Has seleccionado el plan: ${plan.nombre}`);
};
</script>
