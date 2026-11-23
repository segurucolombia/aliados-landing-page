<template>
  <section :id="id" :class="['py-12 md:py-16 focus:outline-none scroll-mt-32', FONDOS[fondo]]" :aria-labelledby="`${id}-t`" :tabindex="enfocable ? -1 : undefined">
    <div :class="CONTENEDOR">
      <div :class="['mb-8 md:mb-10', centrado ? 'text-center' : '']">
        <!-- Antetítulo en mayúsculas -->
        <p :class="[KICK, oscuro ? '!text-orange-300' : '']">{{ kick }}</p>
        <h2 :id="`${id}-t`" :class="['mt-1.5 font-display text-[clamp(25px,6vw,36px)] font-extrabold', oscuro ? 'text-white' : 'text-ink']">
          {{ titulo }}
        </h2>
        <p v-if="lead" :class="['mt-3 text-lg max-w-[36em]', centrado ? 'mx-auto' : '', oscuro ? 'text-[#D6D6F5]' : 'text-muted']">
          {{ lead }}
        </p>
      </div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CONTENEDOR, KICK } from './clubEstilos';

type Fondo = 'blanco' | 'azulClaro' | 'azul';

const props = withDefaults(
  defineProps<{ id: string; kick: string; titulo: string; lead?: string; fondo?: Fondo; centrado?: boolean; enfocable?: boolean }>(),
  { fondo: 'blanco', centrado: false, enfocable: false, lead: '' },
);

const FONDOS: Record<Fondo, string> = {
  blanco: 'bg-page',
  azulClaro: 'bg-white',
  azul: 'bg-brand-deep text-white',
};

const oscuro = computed(() => props.fondo === 'azul');
</script>
