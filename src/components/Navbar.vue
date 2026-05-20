<template>
  <nav class="bg-white sticky top-0 z-50 shadow-md">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-[72px]">
        <!-- Logo -->
        <div class="flex items-center">
          <a href="/" class="flex items-center">
            <img src="/img/logo-seguru.png" alt="Seguru" class="h-11 w-auto" />
          </a>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden md:flex items-center space-x-7">
          <a
            v-for="item in menuItems"
            :key="item.key"
            :href="item.href"
            :class="[
              'font-medium text-sm transition-all duration-200',
              activeSection === item.key
                ? 'text-primary-600 border-b-2 border-primary-600 pb-0.5'
                : 'text-gray-700 hover:text-primary-600'
            ]"
          >
            {{ item.label }}
          </a>
        </div>

        <!-- Phone CTA -->
        <div class="hidden md:flex items-center">
          <a
            href="tel:+573154603134"
            class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            +57 315 460 3134
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="md:hidden text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!isMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden py-4 border-t border-gray-100 space-y-1">
        <a
          v-for="item in menuItems"
          :key="item.key"
          :href="item.href"
          @click="isMenuOpen = false"
          :class="[
            'block py-2.5 px-4 rounded-lg font-medium transition-colors',
            activeSection === item.key
              ? 'text-primary-600 bg-primary-50'
              : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
          ]"
        >
          {{ item.label }}
        </a>
        <div class="pt-2 pb-1 px-4">
          <a
            href="tel:+573154603134"
            class="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all duration-200 w-full"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
            </svg>
            +57 315 460 3134
          </a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

type SectionKey = 'inicio' | 'productos' | 'nosotros' | 'contacto';

interface MenuItem {
  key: SectionKey;
  label: string;
  // Si es ancla: '#inicio' o '#productos'. Si es ruta absoluta: '/nosotros'
  anchor?: string;
  path?: string;
}

const baseMenu: MenuItem[] = [
  { key: 'inicio', label: 'Inicio', anchor: '#inicio' },
  { key: 'productos', label: 'Productos', anchor: '#productos' },
  { key: 'nosotros', label: 'Nosotros', path: '/nosotros' },
  { key: 'contacto', label: 'Contacto', path: '/contacto' },
];

const isMenuOpen = ref(false);
const activeSection = ref<SectionKey | ''>('');
const isHome = ref(true);

const menuItems = computed(() =>
  baseMenu.map((item) => ({
    ...item,
    // En home las anclas son relativas; fuera de home prefijamos con / para volver al index
    href: item.path
      ? item.path
      : isHome.value
        ? item.anchor!
        : `/${item.anchor}`,
  }))
);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const updateActiveSection = () => {
  if (!isHome.value) return;
  const anchorKeys: SectionKey[] = ['inicio', 'productos'];
  const scrollPosition = window.scrollY + 100;

  for (const section of anchorKeys) {
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
  const path = window.location.pathname;
  isHome.value = path === '/' || path === '/index.html';

  if (path.startsWith('/contacto')) {
    activeSection.value = 'contacto';
  } else if (path.startsWith('/nosotros')) {
    activeSection.value = 'nosotros';
  } else if (path.startsWith('/productos') || path.startsWith('/planes')) {
    activeSection.value = 'productos';
  } else if (isHome.value) {
    window.addEventListener('scroll', updateActiveSection);
    updateActiveSection();
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection);
});
</script>
