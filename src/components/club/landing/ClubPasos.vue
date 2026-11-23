<template>
  <ClubSeccion :id="id" :kick="kick" :titulo="titulo" :fondo="fondo">
    <ol class="grid gap-3 md:gap-4 md:grid-cols-3" role="list">
      <li v-for="(paso, i) in pasos" :key="i" :class="[TARJETA, 'px-[18px] py-4 md:p-6 relative']">
        <span class="w-[30px] h-[30px] rounded-full bg-brand text-white font-display font-extrabold flex items-center justify-center" aria-hidden="true">
          {{ i + 1 }}
        </span>
        <template v-if="typeof paso === 'string'">
          <p class="mt-3 text-ink text-[17px]"><span class="sr-only">Paso {{ i + 1 }}: </span>{{ paso }}</p>
        </template>
        <template v-else>
          <h3 class="mt-1.5 text-[19px] font-bold text-ink"><span class="sr-only">Paso {{ i + 1 }}: </span>{{ paso.titulo }}</h3>
          <p v-if="paso.detalle" class="mt-1.5 text-muted text-base">{{ paso.detalle }}</p>
        </template>
      </li>
    </ol>
  </ClubSeccion>
</template>

<script setup lang="ts">
import type { ItemConDetalle } from '../../../config/clubProductos';
import ClubSeccion from './ClubSeccion.vue';
import { TARJETA } from './clubEstilos';

withDefaults(
  defineProps<{ id: string; kick: string; titulo: string; pasos: (string | ItemConDetalle)[]; fondo?: 'blanco' | 'azulClaro' }>(),
  { fondo: 'blanco' },
);
</script>
