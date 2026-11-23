<template>
  <ClubSeccion :id="id" :kick="kick" :titulo="titulo" :fondo="fondo">
    <div class="grid gap-3 md:gap-4" :class="columnas.length > 1 ? 'md:grid-cols-2' : ''">
      <div
        v-for="col in columnas"
        :key="col.titulo"
        class="rounded-card p-[18px] md:p-7"
        :class="col.tipo === 'con' ? 'bg-green-50' : 'bg-red-50'"
      >
        <h3 class="flex items-center gap-3 text-[19px] font-bold" :class="col.tipo === 'con' ? 'text-green-600' : 'text-red-600'">
          <span
            class="w-9 h-9 rounded-full flex items-center justify-center text-white text-base"
            :class="col.tipo === 'con' ? 'bg-green-500' : 'bg-red-500'"
            aria-hidden="true"
          >{{ col.tipo === 'con' ? '✓' : '✕' }}</span>
          {{ col.titulo }}
        </h3>
        <ul class="mt-5 space-y-3">
          <li v-for="item in col.items" :key="item" class="flex gap-3 text-gray-700">
            <span class="font-bold shrink-0" :class="col.tipo === 'con' ? 'text-green-600' : 'text-red-600'" aria-hidden="true">
              {{ col.tipo === 'con' ? '✓' : '✕' }}
            </span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>
    </div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import ClubSeccion from './ClubSeccion.vue';

withDefaults(
  defineProps<{
    id: string;
    kick: string;
    titulo: string;
    fondo?: 'blanco' | 'azulClaro';
    columnas: { tipo: 'sin' | 'con'; titulo: string; items: string[] }[];
  }>(),
  { fondo: 'blanco' },
);
</script>
