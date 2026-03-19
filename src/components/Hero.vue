<template>
  <section id="inicio" class="relative overflow-hidden" style="background-color: #1a3fa8;">

    <!-- Imagen de familia: cubre todo el fondo -->
    <div class="absolute inset-0">
      <img
        src="/img/imagen-familia.png"
        alt="Familia protegida"
        class="absolute inset-0 w-full h-full object-cover object-right"
      />
      <!-- Degradé suave de izquierda a derecha sobre toda la imagen -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to right, #1a3fa8 0%, #1a3fa8 22%, #1a3fa8f5 32%, #1a3fa8d0 42%, #1a3fa898 54%, #1a3fa850 66%, #1a3fa818 78%, transparent 100%);"
      ></div>
      <!-- Degradé de abajo para las estadísticas -->
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to top, #1a3fa8cc 0%, #1a3fa822 15%, transparent 28%);"
      ></div>
    </div>

    <!-- Contenido -->
    <div class="relative z-10 container mx-auto px-6 md:px-10 py-20 md:py-28">
      <div class="max-w-xl">
        <h1 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
          Protegemos tu familia<br />y tu patrimonio
        </h1>
        <p class="text-blue-100 text-lg leading-relaxed mb-8 max-w-md">
          Soluciones simples y accesibles para cuidar tu bienestar, tranquilidad y el futuro de tu familia.
        </p>
        <div class="flex flex-col items-start gap-3">
          <!-- Botón naranja principal -->
          <a
            href="/productos"
            class="inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
            Calcula tu protección en 30 segundos
          </a>

          <!-- Botón WhatsApp verde -->
          <a
            href="https://wa.me/573154603134"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-2.5 bg-green-500 hover:bg-green-600 text-white px-7 py-3.5 rounded-full font-semibold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Habla con un asesor
          </a>
        </div>
      </div>
    </div>

    <!-- Barra de estadísticas -->
    <div class="relative z-10 bg-white shadow-lg">
      <div class="container mx-auto px-6 md:px-10 py-5">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">

          <!-- Familias protegidas -->
          <div class="flex items-center gap-4 justify-center md:justify-start">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background: #fff3e0;">
              <svg viewBox="0 0 48 48" class="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Casa -->
                <path d="M24 8 L8 22 L8 40 L20 40 L20 30 L28 30 L28 40 L40 40 L40 22 Z" fill="#f97316" rx="2"/>
                <path d="M24 8 L8 22" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>
                <path d="M24 8 L40 22" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>
                <!-- Personas dentro -->
                <circle cx="18" cy="23" r="3" fill="#fff"/>
                <circle cx="30" cy="23" r="3" fill="#fff"/>
                <ellipse cx="18" cy="31" rx="4" ry="3" fill="#fff"/>
                <ellipse cx="30" cy="31" rx="4" ry="3" fill="#fff"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-900 font-bold text-2xl leading-none">+2,000</p>
              <p class="text-gray-500 text-sm mt-1">familias protegidas</p>
            </div>
          </div>

          <!-- Eventos de salud -->
          <div class="flex items-center gap-4 justify-center md:justify-start pl-0 md:pl-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background: #e8f5e9;">
              <svg viewBox="0 0 48 48" class="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Escudo -->
                <path d="M24 4 L8 11 L8 26 C8 35 24 44 24 44 C24 44 40 35 40 26 L40 11 Z" fill="#22c55e"/>
                <path d="M24 4 L8 11 L8 26 C8 35 24 44 24 44 C24 44 40 35 40 26 L40 11 Z" stroke="#16a34a" stroke-width="1.5" fill="#22c55e"/>
                <!-- Cruz -->
                <rect x="21" y="15" width="6" height="18" rx="2" fill="white"/>
                <rect x="15" y="21" width="18" height="6" rx="2" fill="white"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-900 font-bold text-2xl leading-none">+8,000</p>
              <p class="text-gray-500 text-sm mt-1">eventos de salud cubiertos</p>
            </div>
          </div>

          <!-- Aseguradoras aliadas -->
          <div class="flex items-center gap-4 justify-center md:justify-start pl-0 md:pl-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background: #fff8e1;">
              <svg viewBox="0 0 48 48" class="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Caja/paquete -->
                <rect x="8" y="20" width="32" height="22" rx="3" fill="#f59e0b"/>
                <path d="M6 20 L24 10 L42 20 L24 28 Z" fill="#fbbf24"/>
                <!-- Lazo -->
                <path d="M24 10 L24 42" stroke="#d97706" stroke-width="2.5"/>
                <path d="M8 20 L42 20" stroke="#d97706" stroke-width="2.5"/>
                <!-- Lazo superior -->
                <path d="M24 10 C20 6 14 8 16 12 C18 16 24 14 24 10" fill="#fde68a"/>
                <path d="M24 10 C28 6 34 8 32 12 C30 16 24 14 24 10" fill="#fde68a"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-900 font-bold text-2xl leading-none">+12</p>
              <p class="text-gray-500 text-sm mt-1">aseguradoras aliadas</p>
            </div>
          </div>

          <!-- Protección aliados -->
          <div class="flex items-center gap-4 justify-center md:justify-start pl-0 md:pl-6">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style="background: #e8eaf6;">
              <svg viewBox="0 0 48 48" class="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Persona principal -->
                <circle cx="24" cy="14" r="7" fill="#3b82f6"/>
                <path d="M10 40 C10 30 38 30 38 40" fill="#3b82f6"/>
                <!-- Check de protección -->
                <circle cx="34" cy="34" r="8" fill="#1d4ed8"/>
                <path d="M30 34 L33 37 L38 31" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <div>
              <p class="text-gray-900 font-bold text-2xl leading-none">100%</p>
              <p class="text-gray-500 text-sm mt-1">protección de aliados</p>
            </div>
          </div>

        </div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
</script>
