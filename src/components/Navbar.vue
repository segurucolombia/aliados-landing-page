<template>
  <nav class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center">
            <img src="/img/logo-seguru.png" alt="Seguru" class="h-12 w-auto hover:opacity-80 transition-opacity cursor-pointer" />
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-8">
          <a href="#inicio" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Inicio
          </a>
          <a href="#productos" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Productos
          </a>
          <a href="#nosotros" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Nosotros
          </a>
          <a href="#contacto" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Contacto
          </a>
          <button class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
            Cotizar
          </button>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="md:hidden text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden py-4 border-t">
        <a href="#inicio" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
          Inicio
        </a>
        <a href="#productos" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
          Productos
        </a>
        <a href="#nosotros" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
          Nosotros
        </a>
        <a href="#contacto" class="block py-2 text-gray-700 hover:text-primary-600 transition-colors">
          Contacto
        </a>
        <button class="mt-4 w-full bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
          Cotizar
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>
