<template>
  <section id="inicio" class="relative bg-primary-900 text-white overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0">
      <img
        src="/img/header-background.jpg"
        alt="Seguru Background"
        class="w-full h-full object-cover opacity-30"
      />
      <div class="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-primary-700/80"></div>
    </div>

    <!-- Content -->
    <div class="relative container mx-auto px-4 py-24 md:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg">
          Seguru, tus seguros de confianza
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-50 drop-shadow">
          Protección a tu medida para cada momento de tu vida
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/productos" class="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg text-center">
            Cotizar Ahora
          </a>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-all transform hover:scale-105">
            Conocer Más
          </button>
        </div>
      </div>
    </div>

    <!-- Decorative wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
        <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>
