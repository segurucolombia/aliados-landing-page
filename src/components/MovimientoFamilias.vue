<template>
  <section class="relative overflow-hidden" style="background-color: #141450; min-height: 380px;">

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
        style="background: linear-gradient(to right, #141450 0%, #141450 25%, #141450f0 35%, #141450cc 46%, #14145090 58%, #14145040 70%, #14145010 82%, transparent 100%);"
      ></div>
    </div>

    <!-- Contenido -->
    <div class="relative z-10 container mx-auto px-4 md:px-10 py-12 md:py-16 flex flex-col items-start text-left">
      <p class="text-[12.5px] font-bold tracking-[.1em] uppercase text-orange-300 mb-1.5">
        Bienestar · Prevención · Protección
      </p>
      <h2 class="text-[clamp(25px,6vw,40px)] font-extrabold text-white mb-3">
        Movimiento <em class="not-italic text-accent">Familias Protegidas</em>
      </h2>
      <p class="text-[#D6D6F5] text-[17px] mb-[18px]">
        Unidos por más familias protegidas
      </p>
      <a
        href="/productos"
        class="inline-flex items-center justify-center gap-2 min-h-[50px] bg-accent text-accent-ink hover:brightness-105 px-[22px] py-3 rounded-btn font-bold text-[17px] leading-tight transition"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Conoce más
      </a>
    </div>

  </section>
</template>

<script setup lang="ts">
</script>
