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
          <a
            href="#inicio"
            :class="[
              'font-medium transition-all duration-200',
              activeSection === 'inicio'
                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            Inicio
          </a>
          <a
            href="#productos"
            :class="[
              'font-medium transition-all duration-200',
              activeSection === 'productos'
                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            Productos
          </a>
          <a
            href="#nosotros"
            :class="[
              'font-medium transition-all duration-200',
              activeSection === 'nosotros'
                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            Nosotros
          </a>
          <a
            href="#contacto"
            :class="[
              'font-medium transition-all duration-200',
              activeSection === 'contacto'
                ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            Contacto
          </a>
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
        <a
          href="#inicio"
          :class="[
            'block py-2 transition-colors',
            activeSection === 'inicio'
              ? 'text-primary-600 font-semibold bg-primary-50 px-4 rounded'
              : 'text-gray-700 hover:text-primary-600'
          ]"
        >
          Inicio
        </a>
        <a
          href="#productos"
          :class="[
            'block py-2 transition-colors',
            activeSection === 'productos'
              ? 'text-primary-600 font-semibold bg-primary-50 px-4 rounded'
              : 'text-gray-700 hover:text-primary-600'
          ]"
        >
          Productos
        </a>
        <a
          href="#nosotros"
          :class="[
            'block py-2 transition-colors',
            activeSection === 'nosotros'
              ? 'text-primary-600 font-semibold bg-primary-50 px-4 rounded'
              : 'text-gray-700 hover:text-primary-600'
          ]"
        >
          Nosotros
        </a>
        <a
          href="#contacto"
          :class="[
            'block py-2 transition-colors',
            activeSection === 'contacto'
              ? 'text-primary-600 font-semibold bg-primary-50 px-4 rounded'
              : 'text-gray-700 hover:text-primary-600'
          ]"
        >
          Contacto
        </a>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const isMenuOpen = ref(false);
const activeSection = ref('inicio');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const updateActiveSection = () => {
  const sections = ['inicio', 'productos', 'nosotros', 'contacto'];
  const scrollPosition = window.scrollY + 100;

  for (const section of sections) {
    const element = document.getElementById(section);
    if (element) {
      const offsetTop = element.offsetTop;
      const offsetBottom = offsetTop + element.offsetHeight;

      if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
        activeSection.value = section;
        break;
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection);
});
</script>
