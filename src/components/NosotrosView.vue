<template>
  <div class="min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pt-10 pb-24 lg:pt-20 lg:pb-32">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <nav class="mb-4 lg:mb-6">
            <ol class="flex items-center justify-center gap-2 text-xs lg:text-sm text-blue-200">
              <li><a href="/" class="hover:text-white transition-colors">Inicio</a></li>
              <li><span>/</span></li>
              <li class="text-white font-semibold">Nosotros</li>
            </ol>
          </nav>
          <h1 class="text-4xl md:text-5xl font-bold mb-3 lg:mb-6">Conoce a Seguru</h1>
          <p class="text-base lg:text-xl text-blue-100 max-w-md lg:max-w-2xl mx-auto">
            Hacemos los seguros más simples, transparentes y accesibles para todos.
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <!-- Misión / Visión / Valores -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div class="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Misión</h3>
            <p class="text-gray-600">
              Acercar la protección financiera a cada persona y empresa con tecnología clara y precios honestos.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Visión</h3>
            <p class="text-gray-600">
              Ser la plataforma de seguros más confiable de Latinoamérica, donde tomar un seguro tome minutos, no días.
            </p>
          </div>
          <div class="bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow">
            <div class="w-14 h-14 rounded-xl bg-primary-100 flex items-center justify-center mb-4">
              <svg class="w-7 h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Valores</h3>
            <p class="text-gray-600">
              Transparencia, cercanía con el cliente y respaldo de aseguradoras vigiladas por la Superintendencia Financiera.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Datos clave -->
    <section class="bg-white py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Respaldo y experiencia</h2>
            <p class="text-lg text-gray-600">Trabajamos junto a aseguradoras reconocidas en Colombia.</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p class="text-4xl font-bold text-primary-700">+10</p>
              <p class="text-sm text-gray-600 mt-2">Aseguradoras aliadas</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary-700">100%</p>
              <p class="text-sm text-gray-600 mt-2">Proceso digital</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary-700">24/7</p>
              <p class="text-sm text-gray-600 mt-2">Atención al cliente</p>
            </div>
            <div>
              <p class="text-4xl font-bold text-primary-700">SFC</p>
              <p class="text-sm text-gray-600 mt-2">Vigilado</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">¿Listo para protegerte?</h2>
        <p class="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Explora nuestros planes o contáctanos para asesoría personalizada.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/productos" class="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Ver productos
          </a>
          <a href="/contacto" class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors">
            Contáctanos
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>
