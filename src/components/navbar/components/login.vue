<template>
  <!-- Login del Club SEGURU: abre el modal en "Ya soy miembro" (documento y contraseña, o Google) -->
  <button
    type="button"
    class="min-h-[44px] py-2 px-4 rounded-btn border-2 border-line text-brand hover:border-primary-300 hover:bg-page font-bold text-[15px] transition-colors"
    :class="bloque ? 'w-full py-3' : ''"
    @click="abrir({ pestana: 'miembro' })"
  >
    Ingresar
  </button>
</template>

<script setup lang="ts">
import useClubModal from '../../../composables/clubModal';

withDefaults(defineProps<{ bloque?: boolean }>(), { bloque: false });

const { abrir } = useClubModal();
</script>
