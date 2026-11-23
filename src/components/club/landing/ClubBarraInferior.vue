<template>
  <div class="fixed inset-x-0 bottom-0 z-40 bg-white border-t border-line pb-[env(safe-area-inset-bottom,0px)]">
    <div class="container mx-auto px-4 md:px-10 py-3 flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4">
      <!-- En el prototipo decía "Desde $X": los precios solo se ven con sesión -->
      <p class="w-full md:w-auto md:flex-1 text-center md:text-left text-xs md:text-sm font-semibold text-muted">
        Precios para miembros del Club · Unirte es gratis
      </p>
      <button type="button" :class="[BTN.principal, 'flex-1 md:flex-none !py-3']" @click="emit('contratar')">Contratar ahora</button>
      <a :class="[BTN.whatsapp, 'flex-1 md:flex-none !py-3']" :href="whatsapp" target="_blank" rel="noopener">WhatsApp</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BTN } from './clubEstilos';

defineProps<{ whatsapp: string }>();
const emit = defineEmits<{ contratar: [] }>();
</script>
