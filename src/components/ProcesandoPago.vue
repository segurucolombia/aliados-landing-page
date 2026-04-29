<template>
  <PagoProcesandoMensaje
    v-if="esDebitoAutomatico"
    :email="resumen?.comprador_email"
    @volver="volverInicio"
  />
  <div v-else :class="transaccionEstado === 'APPROVED' ? 'from-green-300 to-green-400' : 'from-primary-700 to-primary-900'" class="min-h-screen bg-gradient-to-br flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

      <!-- Header: PENDING -->
      <div v-if="transaccionEstado === 'PENDING'"
        class="bg-gradient-to-br from-primary-600 to-primary-800 px-8 pt-10 pb-8 text-center text-white">
        <div class="relative flex items-center justify-center mb-6 h-28">
          <div class="absolute w-28 h-28 rounded-full border-4 border-white/20 animate-ping"></div>
          <div class="absolute w-24 h-24 rounded-full border-4 border-white/20"></div>
          <div class="absolute w-20 h-20 rounded-full border-[5px] border-white/20 border-t-white animate-spin"></div>
          <div class="absolute flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-1">Procesando tu pago</h1>
        <p class="text-blue-100 text-sm">Por favor espera mientras confirmamos tu transacción</p>
        <div class="flex justify-center gap-2 mt-4">
          <span class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-white rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
      </div>

      <!-- Header: APPROVED -->
      <div v-else-if="transaccionEstado === 'APPROVED'"
        class="bg-gradient-to-br from-green-500 to-green-700 px-8 pt-10 pb-8 text-center text-white">
        <div class="relative flex items-center justify-center mb-6 h-28">
          <div class="absolute w-28 h-28 rounded-full bg-white/10"></div>
          <div class="absolute w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-1">¡Pago completado!</h1>
        <p class="text-green-100 text-sm">Tu transacción fue aprobada exitosamente</p>
      </div>

      <!-- Header: DECLINED / ERROR -->
      <div v-else
        class="bg-gradient-to-br from-red-500 to-red-700 px-8 pt-10 pb-8 text-center text-white">
        <div class="relative flex items-center justify-center mb-6 h-28">
          <div class="absolute w-28 h-28 rounded-full bg-white/10"></div>
          <div class="absolute w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-1">{{ transaccionEstado === 'DECLINED' ? 'Pago rechazado' : 'Error en el pago' }}</h1>
        <p class="text-red-100 text-sm">{{ transaccionEstado === 'DECLINED' ? 'Tu pago no pudo ser procesado' : 'Ocurrió un error durante el pago' }}</p>
      </div>

      <!-- Cuerpo -->
      <div class="p-6">

        <!-- Badge de estado -->
        <div class="flex justify-center mb-5">
          <span
            class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
            :class="statusBadgeClass"
          >
            <span class="w-2 h-2 rounded-full" :class="statusDotClass"></span>
            {{ statusLabel }}
          </span>
        </div>

        <!-- Mensaje APPROVED -->
        <div v-if="transaccionEstado === 'APPROVED'" class="mb-5 bg-white border-l-4 border-green-500 rounded-r-xl shadow-sm p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-semibold mb-0.5">Revisa tu correo electrónico</p>
              <p class="text-gray-600 text-sm">
                Enviamos los datos de acceso a <span class="font-semibold text-gray-800">{{ resumen?.comprador_email }}</span>
              </p>
            </div>
          </div>
          <button
            @click="irAPlataforma"
            class="mt-4 w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Acceder a la plataforma
          </button>
        </div>

        <!-- Mensaje DECLINED / ERROR -->
        <div v-if="transaccionEstado === 'DECLINED' || transaccionEstado === 'ERROR'" class="mb-5 bg-white border-l-4 border-red-500 rounded-r-xl shadow-sm p-4">
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-0.5">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-gray-900 font-semibold mb-0.5">No pudimos procesar el cobro</p>
              <p class="text-gray-600 text-sm">
                Puedes intentar nuevamente con otra tarjeta o medio de pago.
              </p>
            </div>
          </div>
          <button
            @click="reiniciarFlujo"
            class="mt-4 w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Intentar con otra tarjeta
          </button>
        </div>

        <!-- Resumen de compra -->
        <div v-if="resumen" class="space-y-4">
          <h2 class="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
            Resumen de tu compra
          </h2>

          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-xs text-gray-400 uppercase tracking-wide">Plan</p>
              <p class="font-semibold text-gray-900">{{ resumen.plan_nombre }}</p>
            </div>
            <p :class="transaccionEstado === 'APPROVED' ? 'text-green-600' : 'text-primary-700'" class="font-bold text-xl whitespace-nowrap">
              {{ formatCurrency(resumen.precio) }}
            </p>
          </div>

          <div class="h-px bg-gray-100"></div>

          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Datos del comprador</p>

          <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div>
              <p class="text-xs text-gray-400">Nombre</p>
              <p class="font-medium text-gray-800">{{ resumen.comprador_nombre }} {{ resumen.comprador_apellido }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Correo</p>
              <p class="font-medium text-gray-800 break-all">{{ resumen.comprador_email }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Documento</p>
              <p class="font-medium text-gray-800">{{ resumen.comprador_documento_tipo }} {{ resumen.comprador_documento }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-400">Teléfono</p>
              <p class="font-medium text-gray-800">{{ resumen.comprador_telefono }}</p>
            </div>
          </div>

          <div class="h-px bg-gray-100"></div>

          <div class="bg-gray-50 rounded-xl p-3">
            <p class="text-xs text-gray-400 mb-1">ID de Transacción</p>
            <p class="font-mono text-sm text-gray-700 break-all">{{ resumen.transaccion_id }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ formatDate(resumen.fecha_compra) }}</p>
          </div>
        </div>

        <!-- Estado de carga del resumen -->
        <div v-else class="text-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-3"></div>
          <p class="text-sm text-gray-400">Cargando información de tu compra...</p>
        </div>

        <!-- Nota al pie -->
        <p v-if="transaccionEstado === 'PENDING'" class="text-xs text-gray-400 text-center mt-5 leading-relaxed">
          Verificamos el estado de tu pago automáticamente.<br />No cierres esta ventana.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { TransactionService } from '../services/transactions';
import type { EstadoTransaccion } from '../services/transactions';
import PagoProcesandoMensaje from './PagoProcesandoMensaje.vue';

interface CompraResumen {
  transaccion_id: string;
  plan_nombre: string;
  precio: number;
  comprador_nombre: string;
  comprador_apellido: string;
  comprador_email: string;
  comprador_documento_tipo: string;
  comprador_documento: string;
  comprador_telefono: string;
  fecha_compra: string;
  debito_automatico?: boolean;
}

const resumen = ref<CompraResumen | null>(null);
const transaccionEstado = ref<EstadoTransaccion>('PENDING');
let pollingInterval: ReturnType<typeof setInterval> | null = null;

const esDebitoAutomatico = computed(() => resumen.value?.debito_automatico === true);

const irAPlataforma = () => {
  window.open(import.meta.env.PUBLIC_ENLACE_PLATAFORMA || 'https://aliados.segurucolombia.com/', '_blank', 'noopener,noreferrer');
  localStorage.removeItem('transaccion_id');
  localStorage.removeItem('venta_pendiente_id');
  localStorage.removeItem('compra_resumen');
  localStorage.removeItem('cupon');
  localStorage.removeItem('cupon_valor');
  localStorage.removeItem('aliado_id');
  window.location.href = '/';
};

const reiniciarFlujo = () => {
  localStorage.removeItem('transaccion_id');
  localStorage.removeItem('venta_pendiente_id');
  localStorage.removeItem('compra_resumen');
  window.location.href = '/productos';
};

const volverInicio = () => {
  localStorage.removeItem('transaccion_id');
  localStorage.removeItem('venta_pendiente_id');
  localStorage.removeItem('compra_resumen');
  localStorage.removeItem('cupon');
  localStorage.removeItem('cupon_valor');
  localStorage.removeItem('aliado_id');
  window.location.href = '/';
};

const ESTADOS_FINALES: EstadoTransaccion[] = ['APPROVED', 'DECLINED', 'ERROR'];

const statusLabel = computed(() => {
  const estados: Record<EstadoTransaccion, string> = {
    APPROVED: 'Pago aprobado',
    DECLINED: 'Pago rechazado',
    ERROR: 'Error en el pago',
    PENDING: 'Procesando pago...',
  };
  return estados[transaccionEstado.value] ?? 'Procesando pago...';
});

const statusBadgeClass = computed(() => {
  const clases: Record<EstadoTransaccion, string> = {
    APPROVED: 'bg-green-600 text-white',
    DECLINED: 'bg-red-600 text-white',
    ERROR: 'bg-red-600 text-white',
    PENDING: 'bg-blue-600 text-white',
  };
  return clases[transaccionEstado.value] ?? 'bg-blue-600 text-white';
});

const statusDotClass = computed(() => {
  const clases: Record<EstadoTransaccion, string> = {
    APPROVED: 'bg-white',
    DECLINED: 'bg-white',
    ERROR: 'bg-white',
    PENDING: 'bg-white animate-pulse',
  };
  return clases[transaccionEstado.value] ?? 'bg-white animate-pulse';
});

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(value);

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));

const consultarEstado = async () => {
  const transaccionId = localStorage.getItem('transaccion_id');
  if (!transaccionId) return;

  try {
    const service = new TransactionService();
    const response = await service.obtenerEstadoTransaccion({ transaccion_id: transaccionId });
    const estado = response.data?.transaccion?.estado;

    if (estado) {
      transaccionEstado.value = estado;

      if (ESTADOS_FINALES.includes(estado)) {
        clearInterval(pollingInterval!);
        pollingInterval = null;
      }
    }
  } catch (err) {
    console.error('Error al consultar estado de transacción:', err);
  }
};

onMounted(() => {
  const resumenRaw = localStorage.getItem('compra_resumen');
  if (resumenRaw) {
    try {
      resumen.value = JSON.parse(resumenRaw);
    } catch {
      console.error('Error al parsear el resumen de compra');
    }
  }

  // Para débito automático no hacemos polling: el cobro lo procesa MP en background
  // y el cliente recibe el resultado por correo (PagoProcesandoMensaje cubre la pantalla).
  if (esDebitoAutomatico.value) return;

  consultarEstado();
  pollingInterval = setInterval(consultarEstado, 10_000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
});
</script>
