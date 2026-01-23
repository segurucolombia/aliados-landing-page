<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <Toast />
    <LoadingSpinner :visible="isLoading" />

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Activando tu prueba gratuita...</h2>
      <p class="text-gray-600 mb-4">Por favor espera un momento</p>
    </div>

    <!-- Estado Aprobado -->
    <div v-else class="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center transform animate-fade-in">
      <!-- Ícono de éxito animado -->
      <div class="relative mb-8">
        <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
          <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
            </svg>
          </div>
        </div>
        <!-- Partículas de celebración -->
        <div class="absolute -top-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
        <div class="absolute -top-1 -right-3 w-3 h-3 bg-blue-500 rounded-full animate-ping" style="animation-delay: 0.5s;"></div>
        <div class="absolute -bottom-1 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style="animation-delay: 1s;"></div>
      </div>

      <!-- Título principal -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        ¡Prueba Gratuita Activada!
      </h1>

      <!-- Subtítulo -->
      <p class="text-lg text-gray-600 mb-6">
        Tu prueba gratuita ha sido activada exitosamente
      </p>

      <!-- Información de la prueba gratuita -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div class="flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-blue-800">Periodo de Prueba</h3>
        </div>

        <div class="space-y-2 text-sm text-blue-700">
          <div class="flex justify-between">
            <span class="font-medium">Inicio:</span>
            <span>{{ dayjs().format('DD/MM/YYYY') }}</span>
          </div>
          <div class="flex justify-between">
            <span class="font-medium">Fin:</span>
            <span>{{ dayjs().add(1, 'month').format('DD/MM/YYYY') }}</span>
          </div>
          <div class="mt-4 p-3 bg-blue-100 rounded-md">
            <p class="text-xs text-blue-800 font-medium">
              ✨ Disfruta de <span class="font-bold">1 mes completamente gratis</span> con acceso a todas las funcionalidades
            </p>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div class="text-left">
            <h4 class="font-semibold text-blue-800 mb-3">¿Qué sigue ahora?</h4>

            <ul class="space-y-2 text-blue-700 text-sm">
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Hemos enviado un correo electrónico con tus credenciales de acceso</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Revisa tu bandeja de entrada y spam</span>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                </svg>
                <span>Accede a la plataforma y empieza a disfrutar de todos los beneficios</span>
              </li>
            </ul>

            <div class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p class="text-xs text-yellow-800">
                <span class="font-semibold">💡 Recordatorio:</span> Después del mes gratuito, continuarás con el pago anual. ¡Cancela cuando quieras sin compromisos!
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="space-y-4">
        <button
          @click="goToPlatform"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300 flex items-center justify-center group"
        >
          <svg class="w-5 h-5 mr-2 group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
          </svg>
          Acceder a la Plataforma
        </button>

        <button
          @click="goToHome"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          Volver al Inicio
        </button>
      </div>

      <!-- Información de soporte -->
      <div class="mt-8 pt-6 border-t border-gray-200">
        <p class="text-xs text-gray-500 mb-2">¿Necesitas ayuda?</p>
        <div class="flex justify-center space-x-4 text-xs">
          <a href="#" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            Soporte
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-800 flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            FAQ
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Toast from 'primevue/toast';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import { useToast } from "primevue/usetoast";
import dayjs from 'dayjs';

const toast = useToast();
const isLoading = ref(true);

// Propiedades opcionales
interface Props {
  platformUrl?: string;
  homeUrl?: string;
}

const props = withDefaults(defineProps<Props>(), {
  platformUrl: 'https://reservas.segurucolombia.com/',
  homeUrl: '/'
});

// Métodos
const goToPlatform = () => {
  window.location.href = 'https://reservas.segurucolombia.com/login';
};

const goToHome = () => {
  window.location.href = props.homeUrl;
};

// Lifecycle
onMounted(() => {
  // Simular una pequeña carga para dar feedback visual
  setTimeout(() => {
    isLoading.value = false;

    // Limpiar localStorage
    localStorage.removeItem('esPruebaGratuita');
    localStorage.removeItem('transaccionProcesoId');

    toast.add({
      severity: 'success',
      summary: '¡Prueba Gratuita Activada!',
      detail: 'Tu prueba de 1 mes ha comenzado',
      life: 5000
    });
  }, 1500);
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce-slow {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
</style>
