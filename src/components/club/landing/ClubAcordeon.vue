<template>
  <ClubSeccion :id="id" :kick="kick" :titulo="titulo" :fondo="fondo">
    <!-- Mismo estilo del acordeón de FAQ.vue, con details/summary -->
    <div class="grid gap-4 lg:grid-cols-2 lg:gap-x-8 items-start">
      <details
        v-for="p in preguntas"
        :key="p.pregunta"
        class="group border border-line rounded-[14px] overflow-hidden bg-white transition-colors duration-200 open:border-brand"
      >
        <summary
          class="list-none [&::-webkit-details-marker]:hidden cursor-pointer flex items-center gap-4 p-5 md:p-6 text-left hover:bg-gray-50 transition-colors"
          :class="FOCO"
        >
          <span
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 transition-all duration-300 group-open:bg-primary-600 group-open:text-white"
            aria-hidden="true"
          >
            <svg class="w-5 h-5 transition-transform duration-300 group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </span>
          <span class="font-semibold text-gray-900">{{ p.pregunta }}</span>
        </summary>
        <div class="px-5 md:px-6 pb-6 pl-[4.25rem] md:pl-[4.5rem] text-gray-600 leading-relaxed">{{ p.respuesta }}</div>
      </details>
    </div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import type { Pregunta } from '../../../config/clubProductos';
import ClubSeccion from './ClubSeccion.vue';
import { FOCO } from './clubEstilos';

withDefaults(defineProps<{ id: string; kick: string; titulo: string; preguntas: Pregunta[]; fondo?: 'blanco' | 'azulClaro' }>(), {
  fondo: 'blanco',
});
</script>
