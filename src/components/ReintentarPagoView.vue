<template>
  <!-- Sin venta_id → error -->
  <div v-if="state === 'no-venta-id'" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Enlace inválido</h1>
      <p class="text-sm text-gray-600 mb-6">
        No pudimos identificar la venta a reintentar. Asegúrate de abrir el enlace tal como lo recibiste por correo.
      </p>
      <button
        @click="volverInicio"
        class="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  </div>

  <!-- Éxito: la venta quedó registrada con la nueva tarjeta -->
  <PagoProcesandoMensaje
    v-else-if="state === 'registrado'"
    :email="null"
    @volver="volverInicio"
  />

  <!-- Formulario de tarjeta -->
  <div v-else>
    <div class="bg-amber-50 border-b border-amber-200">
      <div class="max-w-2xl mx-auto px-4 py-4 flex items-start gap-3">
        <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p class="text-sm text-amber-900">
          <span class="font-semibold">Hubo un problema con tu pago anterior.</span>
          Intenta con otra tarjeta para activar tu plan.
        </p>
      </div>
    </div>

    <MercadoPagoCardStep
      @card-tokenized="handleCardTokenized"
      @back="volverInicio"
      @cancel="volverInicio"
    />

    <div v-if="errorMessage" class="max-w-2xl mx-auto px-6 -mt-4 mb-8">
      <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
        {{ errorMessage }}
      </div>
    </div>

    <div v-if="submitting" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 flex items-center gap-3 shadow-2xl">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        <p class="text-gray-700 font-medium">Registrando reintento...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import PagoProcesandoMensaje from './PagoProcesandoMensaje.vue';
import { DebitoAutomaticoService } from '../services/debito-automatico.service';

type State = 'loading' | 'no-venta-id' | 'form' | 'registrado';

const state = ref<State>('loading');
const ventaId = ref<string | null>(null);
const submitting = ref(false);
const errorMessage = ref<string | null>(null);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  const venta = params.get('venta_id');
  if (!venta) {
    state.value = 'no-venta-id';
    return;
  }
  ventaId.value = venta;
  state.value = 'form';
});

const handleCardTokenized = async (cardTokenId: string) => {
  if (!ventaId.value) return;
  submitting.value = true;
  errorMessage.value = null;

  try {
    await DebitoAutomaticoService.reintentarPago({
      venta_id: ventaId.value,
      card_token_id: cardTokenId,
      back_url: `${window.location.origin}/procesando-pago`,
    });
    state.value = 'registrado';
  } catch (err: any) {
    console.error('Error al reintentar pago:', err);
    errorMessage.value =
      err?.response?.data?.message ||
      err?.message ||
      'No pudimos registrar el reintento. Verifica los datos de tu tarjeta o intenta más tarde.';
  } finally {
    submitting.value = false;
  }
};

const volverInicio = () => {
  window.location.href = '/';
};
</script>
