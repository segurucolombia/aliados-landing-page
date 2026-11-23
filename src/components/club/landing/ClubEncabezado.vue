<template>
  <!-- Encabezado: blanco, fijo, con línea inferior -->
  <header class="bg-white/95 backdrop-blur sticky top-0 z-50 border-b border-line">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center gap-3 h-[72px]">
        <a href="/" class="flex items-center shrink-0" :class="FOCO">
          <img src="/img/logo-seguru.png" alt="Seguru, inicio" class="h-11 w-auto" />
        </a>
        <div class="flex items-center gap-1.5 sm:gap-3">
          <!-- Otros productos: discreto, el cliente llega directo a la landing de un producto -->
          <div v-if="otros.length" ref="contenedorMenu" class="relative">
            <button
              ref="botonMenu"
              type="button"
              class="inline-flex items-center gap-1 min-h-[44px] px-2 sm:px-3 rounded-btn text-sm font-semibold text-muted hover:text-brand hover:bg-page transition-colors"
              :class="FOCO"
              aria-haspopup="true"
              :aria-expanded="abierto ? 'true' : 'false'"
              aria-controls="menu-otros-productos"
              @click="abierto = !abierto"
            >
              Otros seguros
              <svg class="w-4 h-4 transition-transform" :class="abierto ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <ul
              v-show="abierto"
              id="menu-otros-productos"
              class="absolute right-0 mt-1 w-56 bg-white border border-line rounded-card p-1.5 shadow-[0_8px_24px_rgba(20,20,80,.12)]"
              @keydown.esc="cerrar(true)"
            >
              <li v-for="p in otros" :key="p.clave">
                <component
                  :is="p.href ? 'a' : 'button'"
                  :href="p.href"
                  :type="p.href ? undefined : 'button'"
                  class="w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 rounded-xl text-[15px] font-semibold text-ink hover:bg-page hover:text-brand"
                  :class="FOCO"
                  @click="elegir(p)"
                >
                  {{ p.etiqueta }}
                  <svg class="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </component>
              </li>
            </ul>
          </div>

          <template v-if="montado && esMiembro">
            <span :class="[PILL_OK, 'hidden min-[400px]:inline-flex']">{{ CLUB.etiquetaMiembro }}</span>
          </template>
          <template v-else>
            <span :class="[PILL, 'hidden md:inline-flex']">{{ CLUB.etiquetaInvitado }}</span>
            <button
              type="button"
              class="min-h-[44px] py-2 px-3 sm:px-4 rounded-btn border-2 border-line text-brand hover:border-primary-300 font-bold text-[15px] transition-colors whitespace-nowrap"
              :class="FOCO"
              @click="emit('entrar')"
            >
              Ya soy miembro
            </button>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { CLUB } from '../../../config/club';
import { FOCO, PILL, PILL_OK } from './clubEstilos';
import useClubSesion from '../../../composables/clubSesion';

export interface OpcionProducto {
  clave: string;
  etiqueta: string;
  /** Con href es un enlace (página de producto); sin href emite `elegir` (home con pestañas) */
  href?: string;
}

const props = withDefaults(defineProps<{ productos?: OpcionProducto[]; actual?: string }>(), {
  productos: () => [],
  actual: '',
});
const emit = defineEmits<{ entrar: []; elegir: [clave: string] }>();

/** El producto actual no se lista: el menú es para ir a otro */
const otros = computed(() => props.productos.filter((p) => p.clave !== props.actual));

const { esMiembro } = useClubSesion();
// La sesión vive en localStorage: se lee después de montar para no desajustar la hidratación
const montado = ref(false);

const abierto = ref(false);
const contenedorMenu = ref<HTMLElement | null>(null);
const botonMenu = ref<HTMLButtonElement | null>(null);

const cerrar = (devolverFoco = false) => {
  abierto.value = false;
  if (devolverFoco) botonMenu.value?.focus();
};

const elegir = (p: OpcionProducto) => {
  cerrar();
  if (!p.href) emit('elegir', p.clave);
};

const alClicFuera = (e: MouseEvent) => {
  if (abierto.value && contenedorMenu.value && !contenedorMenu.value.contains(e.target as Node)) cerrar();
};
const alTecla = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && abierto.value) cerrar(true);
};

onMounted(() => {
  montado.value = true;
  document.addEventListener('click', alClicFuera);
  document.addEventListener('keydown', alTecla);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', alClicFuera);
  document.removeEventListener('keydown', alTecla);
});
</script>
