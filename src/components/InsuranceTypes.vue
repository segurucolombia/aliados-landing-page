<template>
  <section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Nuestros Seguros
        </h2>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Soluciones de seguros adaptadas a tus necesidades
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="insurance in insuranceTypes" :key="insurance.type"
             class="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow cursor-pointer">
          <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="insurance.icon"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ insurance.type }}</h3>
          <p class="text-gray-600 text-sm mb-4">{{ insurance.description }}</p>
          <button class="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            Más información →
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// Esta data será reemplazada por consumo de endpoints
const insuranceTypes = [
  {
    type: 'Seguro de Vida',
    description: 'Protege el futuro de tu familia',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  },
  {
    type: 'Seguro de Auto',
    description: 'Tu vehículo siempre protegido',
    icon: 'M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2'
  },
  {
    type: 'Seguro de Hogar',
    description: 'Cuida tu patrimonio familiar',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
  },
  {
    type: 'Seguro de Salud',
    description: 'Atención médica cuando la necesites',
    icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
  }
];
</script>
