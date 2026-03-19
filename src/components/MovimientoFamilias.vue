<template>
  <section class="relative overflow-hidden" style="background-color: #1a3fa8; min-height: 380px;">

    <!-- Imagen de familia: fondo derecho -->
    <div class="absolute inset-0">
      <img
        src="/img/familia-2.png"
        alt="Movimiento Familias Protegidas"
        class="absolute inset-0 w-full h-full object-cover" style="object-position: right center;"
      />
      <!-- Degradé suave de izquierda a derecha -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to right, #1a3fa8 0%, #1a3fa8 25%, #1a3fa8f0 35%, #1a3fa8cc 46%, #1a3fa890 58%, #1a3fa840 70%, #1a3fa810 82%, transparent 100%);"
      ></div>
    </div>

    <!-- Contenido -->
    <div class="relative z-10 container mx-auto px-6 md:px-6 py-12 md:py-16 flex flex-col items-start text-left">
      <h2 class="text-3xl md:text-5xl font-bold text-white leading-tight mb-3">
        Movimiento Familias Protegidas
      </h2>
      <p class="text-blue-200 font-medium mb-2 tracking-wide">
        Bienestar · Prevención · Protección
      </p>
      <p class="text-blue-100 text-sm mb-7">
        Unidos por más familias protegidas
      </p>
      <a
        href="/productos"
        class="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-blue-50 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Conoce más
      </a>
    </div>

  </section>
</template>

<script setup lang="ts">
</script>
