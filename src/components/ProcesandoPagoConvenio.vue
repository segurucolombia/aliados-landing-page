<template>
  <!-- Tapa toda la página: no se puede interactuar hasta tener un resultado final -->
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
      aria-live="polite"
      aria-labelledby="procesando-pago-titulo"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md px-6 py-10 text-center">
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="absolute inset-0 rounded-full border-4 border-blue-100"></div>
          <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          <svg class="absolute inset-0 m-auto w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        </div>

        <h2 id="procesando-pago-titulo" class="text-2xl font-bold text-gray-900 mb-3">Procesando tu pago</h2>

        <p class="text-sm text-gray-600 leading-relaxed">
          <template v-if="mensaje">{{ mensaje }}</template>
          <template v-else>
            Estamos confirmando tu pago con Mercado Pago. Esto puede tardar unos segundos,
            <span class="font-semibold text-gray-900">no cierres ni recargues esta página.</span>
          </template>
        </p>
        <p v-if="mensaje" class="text-sm font-semibold text-gray-900 mt-2">No cierres ni recargues esta página.</p>

        <p v-else class="text-sm font-medium text-blue-600 mt-5 min-h-[1.25rem]">{{ PASOS[paso] }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  /** Reemplaza el texto por defecto (p. ej. cuando Mercado Pago aún no confirma) */
  mensaje?: string;
}>();

const PASOS = ['Validando tu tarjeta…', 'Confirmando el cobro…', 'Activando tu plan…'];
const INTERVALO_PASOS_MS = 3000;

const paso = ref(0);
let intervalo: ReturnType<typeof setInterval> | null = null;

const detener = (): void => {
  if (intervalo) clearInterval(intervalo);
  intervalo = null;
};

watch(
  () => props.visible,
  (visible) => {
    detener();
    paso.value = 0;
    if (visible) {
      intervalo = setInterval(() => {
        paso.value = (paso.value + 1) % PASOS.length;
      }, INTERVALO_PASOS_MS);
    }
  },
  { immediate: true },
);

onBeforeUnmount(detener);
</script>
