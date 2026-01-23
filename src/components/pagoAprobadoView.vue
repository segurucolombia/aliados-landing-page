<template>
  <section class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <Toast />
    <LoadingSpinner :visible="isLoading" />
    
    <!-- Estado de Carga -->
    <div v-if="transactionState === 'CHECKING'" class="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Verificando tu pago...</h2>
      <p class="text-gray-600 mb-4">Por favor espera mientras confirmamos tu transacción</p>
      <div class="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
        <p class="text-sm text-blue-800">
          <span class="font-medium">Estado actual:</span> {{ currentStatus || 'Consultando...' }}
        </p>
      </div>
    </div>

    <!-- Estado Aprobado -->
    <div v-else-if="transactionState === 'APPROVED'" class="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center transform animate-fade-in">
      <!-- Ícono de éxito animado -->
      <div class="relative mb-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto animate-bounce-slow">
          <div class="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
            <svg class="w-10 h-10 text-white animate-check-mark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <!-- Partículas de celebración -->
        <div class="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
        <div class="absolute -top-1 -right-3 w-3 h-3 bg-green-400 rounded-full animate-ping" style="animation-delay: 0.5s;"></div>
        <div class="absolute -bottom-1 -left-3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style="animation-delay: 1s;"></div>
      </div>

      <!-- Título principal -->
      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        ¡Pago Aprobado!
      </h1>
      
      <!-- Subtítulo -->
      <p class="text-lg text-gray-600 mb-6">
        Tu suscripción ha sido procesada exitosamente
      </p>

      <!-- Información del pago -->
      <div class="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <div class="flex items-center justify-center mb-4">
          <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-green-800">Transacción Completada</h3>
        </div>
        
        <div class="space-y-2 text-sm text-green-700">
          <div class="flex justify-between">
            <span>Fecha:</span>
            <span>{{ dataTransaccion ? dayjs(dataTransaccion?.updated_at).format('YYYY-MM-DD hh:mm a') : '' }}</span>
          </div>
        </div>
      </div>

      <!-- Instrucciones -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div class="flex items-start">
          <svg class="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
          </svg>
          <div class="text-left">
            <h4 class="font-semibold text-blue-800 mb-2">Próximos pasos:</h4>
            
            <p class="text-blue-700 text-sm mb-2">
              Debes completar la información de tu registro para activar tu plan.
            </p>
            <p class="text-blue-700 text-sm mb-2">
              Hemos enviado un correo electrónico con tus credenciales de acceso a la dirección registrada.
            </p>
            <p class="text-blue-700 text-sm">
              Revisa tu bandeja de entrada y spam para encontrar las instrucciones de acceso.
            </p>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="space-y-4">
        <DocumentosCliente
          v-if="dataPreventaCreada?.cliente_id"
          :show_modal="modalDocumentosClientes"
          :customer_comercial_name="dataPreventaCreada?.nombre_empresa"
          :customer_id="dataPreventaCreada?.cliente_id"
          :customer_name="dataPreventaCreada.nombre_representante"
          :customer_nit="dataPreventaCreada.nit"
          @complete="dataPreventaCreada = null"
        />
        <button 
          v-if="dataPreventaCreada?.cliente_id"
          @click="modalDocumentosClientes = true"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center justify-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
          </svg>

          <p class="pl-2">Completar datos para activar el plan</p>
        </button>
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

    <!-- Estado de Error -->
    <div v-else-if="transactionState === 'DECLINED' || transactionState === 'ERROR'" class="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div class="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-gray-800 mb-4">
        Pago {{ transactionState === 'DECLINED' ? 'Rechazado' : 'Con Error' }}
      </h1>
      
      <p class="text-lg text-gray-600 mb-6">
        {{ errorMessage || 'Hubo un problema procesando tu pago. Por favor intenta nuevamente.' }}
      </p>

      <div class="space-y-4">
        <button 
          @click="retryPayment"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Intentar Nuevamente
        </button>
        
        <button 
          @click="contactSupport"
          class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300"
        >
          Contactar Soporte
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue';
import Toast from 'primevue/toast';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import { useToast } from "primevue/usetoast";
import { TransactionService } from '../services/transactions';
import type { TGetPreventaAtt, TGetTransactionAtt } from '../types/pre-venta';
import dayjs from 'dayjs';
import { PreVentaService } from '../services/pre-venta.service';
import DocumentosCliente from './documentosClientes.vue'

// Servicios
const _TransactionService = new TransactionService();
const _PreVentaService = new PreVentaService()
const toast = useToast();

// Estado reactivo
const transactionState = ref<'CHECKING' | 'APPROVED' | 'DECLINED' | 'ERROR' | 'PENDING'>('CHECKING');
const dataTransaccion = ref<null | TGetTransactionAtt>()
const transactionId = ref<string>('');
const currentStatus = ref<string>('');
const errorMessage = ref<string>('');
const isLoading = ref(false);
const checkInterval = ref<NodeJS.Timeout | null>(null);
const dataPreventaCreada = ref<TGetPreventaAtt | null>()
const modalDocumentosClientes = ref(false)

// Propiedades opcionales
interface Props {
  platformUrl?: string;
  homeUrl?: string;
  checkIntervalMs?: number;
  maxRetries?: number;
}

const props = withDefaults(defineProps<Props>(), {
  platformUrl: 'https://reservas.segurucolombia.com/',
  homeUrl: '/',
  checkIntervalMs: 5000, // 5 segundos
  maxRetries: 20 // máximo 20 intentos (100 segundos)
});

let retryCount = 0;

const consultarDataPreventa = async (id:string) => {
  const {data} = await _PreVentaService.find({id})
  dataPreventaCreada.value = data
}

// Métodos
const consultarTransaccion = async () => {
  const transaccionIdProceso = localStorage.getItem('transaccionProcesoId');
  
  if (!transaccionIdProceso) {
    transactionState.value = 'ERROR';
    errorMessage.value = 'No se encontró información de la transacción';
    return;
  }

  try {
    const { data } = await _TransactionService.consultarTransaccion({
      id: transaccionIdProceso
    });
    dataTransaccion.value = data;
    transactionId.value = transaccionIdProceso;
    currentStatus.value = data?.state || 'CHECKING';

    if (data?.state === 'APPROVED') {
      consultarDataPreventa(data.table_id)
      transactionState.value = 'APPROVED';
      clearInterval(checkInterval.value!);
      // localStorage.removeItem('transaccionProcesoId'); // Limpiar después del éxito
      
      toast.add({ 
        severity: 'success', 
        summary: '¡Pago Aprobado!', 
        detail: 'Tu suscripción ha sido activada exitosamente', 
        life: 5000 
      });
    } else if (data?.state === 'DECLINED') {
      transactionState.value = 'DECLINED';
      clearInterval(checkInterval.value!);
      errorMessage.value = 'Pago rechazado, por favor consulta con tu banco';
    } else if (data?.state === 'PENDING') {
      // Continuar consultando
      retryCount++;
      if (retryCount >= props.maxRetries) {
        transactionState.value = 'ERROR';
        errorMessage.value = 'Tiempo de espera agotado. Por favor contacta soporte.';
        clearInterval(checkInterval.value!);
      }
    }
  } catch (error: any) {
    console.error('Error consultando transacción:', error);
    retryCount++;
    
    if (retryCount >= props.maxRetries) {
      transactionState.value = 'ERROR';
      errorMessage.value = 'Error de conexión. Por favor intenta más tarde.';
      clearInterval(checkInterval.value!);
    }
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const goToPlatform = () => {
  window.location.href = 'https://reservas.segurucolombia.com/login';
};

const goToHome = () => {
  window.location.href = props.homeUrl;
};

const retryPayment = () => {
  window.location.href = '/cotizacion';
};

const contactSupport = () => {
  // Aquí puedes implementar tu lógica de soporte
  toast.add({ 
    severity: 'info', 
    summary: 'Contactando Soporte', 
    detail: 'Serás redirigido a nuestro canal de soporte', 
    life: 3000 
  });
  // Ejemplo: window.location.href = 'mailto:soporte@tudominio.com';
};

// Lifecycle
onMounted(() => {
  // Consultar inmediatamente
  consultarTransaccion();
  
  // Configurar intervalo de consulta
  checkInterval.value = setInterval(consultarTransaccion, props.checkIntervalMs);
});

onUnmounted(() => {
  if (checkInterval.value) {
    clearInterval(checkInterval.value);
  }
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

@keyframes check-mark {
  0% {
    stroke-dasharray: 0 50;
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dasharray: 50 50;
    stroke-dashoffset: -50;
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}

.animate-check-mark {
  stroke-dasharray: 50;
  stroke-dashoffset: 50;
  animation: check-mark 0.6s ease-in-out 0.3s forwards;
}
</style>