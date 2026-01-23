<template>
  <section class="py-20 bg-gray-50 relative overflow-hidden">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap items-center gap-12">
        <!-- Left Side - Image -->
        <div class="w-full lg:w-5/12 relative">
          <div class="relative">
            <!-- Main Image -->
            <img
              src="/img/about.jpg"
              alt="Protege lo que más importa"
              class="w-full rounded-3xl shadow-2xl relative z-10"
              loading="lazy"
            />

            <!-- Decorative Elements -->
            <div class="absolute -top-6 -left-6 w-32 h-32 bg-primary-200 rounded-3xl -z-0"></div>
            <div class="absolute -bottom-6 -right-6 w-40 h-40 bg-blue-100 rounded-full -z-0"></div>

            <!-- Floating Badge -->
          </div>
        </div>

        <!-- Right Side - Content -->
        <div class="w-full lg:w-6/12 lg:ml-auto">
          <div class="mb-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-1 bg-primary-600"></div>
              <span class="text-primary-600 font-semibold">¿Por qué elegirnos?</span>
            </div>
            <h2 class="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Protege lo que más importa
            </h2>
            <p class="text-xl text-gray-600 leading-relaxed mb-8">
              Ofrecemos las mejores soluciones de seguros con un servicio personalizado, respaldado por más de 15 años de experiencia en el mercado.
            </p>
          </div>

          <!-- Features List -->
          <div class="space-y-6">
            <div v-for="feature in features" :key="feature.title" class="flex items-start gap-4 group">
              <div class="flex-shrink-0 w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-600 transition-colors duration-300">
                <svg class="w-7 h-7 text-primary-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feature.icon"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                  {{ feature.title }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- CTA Button -->
          <div class="mt-10">
            <button class="bg-primary-600 text-white px-8 py-4 rounded-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-lg font-semibold inline-flex items-center gap-2">
              Conocer Más
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl opacity-30 -z-10"></div>
  </section>
</template>

<script setup lang="ts">
const features = [
  {
    title: 'Cobertura Completa',
    description: 'Protección integral para todas tus necesidades con las mejores aseguradoras del país',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    title: 'Atención 24/7',
    description: 'Estamos disponibles cuando nos necesites, todos los días del año',
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    title: 'Precios Competitivos',
    description: 'Las mejores tarifas del mercado con opciones de pago flexibles',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
];
</script>
