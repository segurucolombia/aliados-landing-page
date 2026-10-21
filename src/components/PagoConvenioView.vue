<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Cargando el plan -->
    <div v-if="state === 'cargando'" class="max-w-xl mx-auto px-4 py-8 space-y-4 animate-pulse" aria-busy="true">
      <div class="h-7 w-2/3 bg-gray-200 rounded"></div>
      <div class="bg-white rounded-2xl shadow p-5 space-y-3">
        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
        <div class="h-4 w-1/3 bg-gray-200 rounded"></div>
        <div class="h-10 w-2/3 bg-gray-200 rounded mt-4"></div>
        <div class="h-4 w-1/2 bg-gray-200 rounded"></div>
      </div>
      <div class="bg-white rounded-2xl shadow p-5 space-y-3">
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-10 bg-gray-200 rounded"></div>
        <div class="h-12 bg-gray-200 rounded mt-4"></div>
      </div>
    </div>

    <!-- 404 / 422 -->
    <div v-else-if="state === 'no-encontrada'" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="text-xl font-bold text-gray-900 mb-2">No encontramos este plan</h1>
        <p class="text-sm text-gray-600">Verifica el enlace que te compartió tu asesor.</p>
      </div>
    </div>

    <!-- Error al cargar (500, sin conexión) -->
    <div v-else-if="state === 'error-carga'" class="min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
        <h1 class="text-xl font-bold text-gray-900 mb-2">No pudimos cargar tu plan</h1>
        <p class="text-sm text-gray-600 mb-6">Revisa tu conexión e intenta de nuevo.</p>
        <button
          @click="cargarVenta"
          class="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>

    <!-- Pago aprobado -->
    <div v-else-if="state === 'exito' && venta" class="min-h-screen bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div class="bg-gradient-to-br from-green-500 to-green-600 px-6 pt-10 pb-8 text-center text-white">
          <div class="w-20 h-20 mx-auto mb-5 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold mb-1">¡Pago exitoso!</h1>
          <p class="text-green-50">Tu plan {{ venta.version_producto?.nombre }} ya está activo</p>
        </div>

        <div class="p-6 space-y-5">
          <dl class="text-sm divide-y divide-gray-100">
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-gray-500">Valor cobrado</dt>
              <dd class="font-semibold text-gray-900">{{ valorTotal }}</dd>
            </div>
            <div class="flex justify-between gap-4 py-2">
              <dt class="text-gray-500">Vigencia</dt>
              <dd class="font-semibold text-gray-900 text-right">{{ vigencia }}</dd>
            </div>
            <div v-if="paymentId" class="flex justify-between gap-4 py-2">
              <dt class="text-gray-500">Referencia del pago</dt>
              <dd class="font-semibold text-gray-900 break-all text-right">{{ paymentId }}</dd>
            </div>
          </dl>

          <p class="text-sm text-gray-700">
            Tu próximo cobro automático será en {{ textoPeriodo }}.
          </p>
          <p v-if="venta.correo" class="text-sm text-gray-700">
            Te enviamos un correo a <span class="font-semibold text-gray-900 break-all">{{ venta.correo }}</span>
            con los detalles de tu plan y tus datos de acceso a la plataforma.
          </p>

          <button
            @click="irPlataforma"
            class="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Ir a la plataforma
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="venta" class="max-w-xl mx-auto px-4 py-6 md:py-10 space-y-4">
      <h1 class="text-2xl font-bold text-gray-900">
        Hola{{ venta.nombres ? `, ${venta.nombres}` : '' }}
      </h1>

      <!-- Error del último intento: siempre en palabras del cliente -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm" role="alert">
        <p class="font-semibold">{{ error.titulo }}</p>
        <p v-if="error.detalle" class="mt-1">{{ error.detalle }}</p>
      </div>

      <!-- La venta no se puede pagar: se explica por qué -->
      <div v-if="avisoEstado" class="bg-white rounded-2xl shadow p-6 text-center">
        <p class="text-gray-800">{{ avisoEstado }}</p>
        <a
          v-if="venta.estado === 'PENDIENTE' && venta.aliado?.telefono"
          :href="`tel:${venta.aliado.telefono}`"
          class="inline-block mt-4 font-semibold text-primary-700"
        >
          Llamar a {{ venta.aliado.nombre || 'tu asesor' }}: {{ venta.aliado.telefono }}
        </a>
      </div>

      <template v-else>
        <!-- Resumen del plan -->
        <section class="bg-white rounded-2xl shadow p-5 md:p-6">
          <p class="text-xs uppercase tracking-wide text-gray-500">Plan</p>
          <p class="text-lg font-bold text-gray-900">{{ venta.version_producto?.nombre }}</p>
          <p v-if="venta.version_producto?.descripcion" class="text-sm text-gray-600 mt-1">
            {{ venta.version_producto.descripcion }}
          </p>
          <p class="text-sm text-gray-600 mt-3">
            Convenio: <span class="font-semibold text-gray-900">{{ venta.entidad?.nombre }}</span>
          </p>

          <div class="mt-5 pt-5 border-t border-gray-100">
            <p class="text-sm text-gray-500">Total a pagar hoy</p>
            <p class="text-4xl font-extrabold text-gray-900 tabular-nums">{{ valorTotal }}</p>
            <p class="text-sm text-gray-600 mt-1">
              {{ formatPriceNoDecimal(venta.valor_mensual) }} mensuales × {{ textoPeriodo }}
            </p>
          </div>

          <p class="text-sm text-gray-600 mt-4">
            Vigencia: <span class="font-semibold text-gray-900">{{ vigencia }}</span>
          </p>

          <div class="mt-4 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl p-4 text-sm">
            <p class="font-semibold">
              Al pagar, autorizas que se cobren {{ valorTotal }} hoy y luego cada {{ textoPeriodo }} de
              forma automática a esta tarjeta.
            </p>
          </div>

          <p v-if="venta.correo" class="text-sm text-gray-600 mt-4">
            El comprobante llegará a <span class="font-semibold text-gray-900 break-all">{{ venta.correo }}</span>
          </p>
        </section>

        <!-- Mercado Pago aún no confirma después de 3 verificaciones -->
        <section v-if="fase === 'verificacion-pendiente'" class="bg-white rounded-2xl shadow p-6 text-center">
          <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
            <svg class="w-7 h-7 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-gray-800">
            Tu pago está en verificación. Te avisaremos por correo
            <template v-if="venta.correo">a <span class="font-semibold break-all">{{ venta.correo }}</span></template>
            cuando se confirme. No es necesario que pagues de nuevo.
          </p>
          <button
            @click="verificarDeNuevo"
            class="w-full mt-6 bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Verificar de nuevo
          </button>
        </section>

        <!-- El formulario de tarjeta de siempre: solo sale el token de un solo uso -->
        <MercadoPagoCardStep
          v-else
          :key="formularioTarjetaKey"
          embebido
          :texto-boton="`Pagar ${valorTotal}`"
          :bloqueado="procesando"
          :initial-doc-type="venta.tipo_documento ?? undefined"
          :initial-doc-number="venta.numero_documento ?? undefined"
          @card-tokenized="pagar"
        />
      </template>
    </div>

    <ProcesandoPagoConvenio :visible="procesando" :mensaje="mensajeCarga" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import ProcesandoPagoConvenio from './ProcesandoPagoConvenio.vue';
import usePagoConvenio from '../composables/pagoConvenio';
import { formatPriceNoDecimal } from '../shared/priceFormat';
import { formatearFechaSinHora } from '../shared/datesFormat';
import { VentasConveniosService, type VentaConvenioDetalle } from '../services/ventas-convenios.service';

const props = defineProps<{ ventaId: string }>();

type State = 'cargando' | 'no-encontrada' | 'error-carga' | 'listo' | 'exito';

const state = ref<State>('cargando');
const venta = ref<VentaConvenioDetalle | null>(null);
/** Referencia de Mercado Pago del cobro hecho en esta página */
const paymentId = ref<string | null>(null);

const esNoEncontrada = (e: any): boolean => [404, 422].includes(e?.response?.status);

/** Vuelve a pedir la venta sin el skeleton, para reflejar su estado real tras un error */
const recargar = async (): Promise<VentaConvenioDetalle | null> => {
  try {
    venta.value = await VentasConveniosService.obtener(props.ventaId);
    return venta.value;
  } catch (e: any) {
    console.error('Error al recargar el plan de convenio:', e);
    if (esNoEncontrada(e)) state.value = 'no-encontrada';
    return null;
  }
};

const { fase, procesando, mensajeCarga, error, formularioTarjetaKey, pagar, verificarDeNuevo } = usePagoConvenio({
  ventaId: () => props.ventaId,
  recargar,
  onPagada: (pagada, referencia) => {
    venta.value = pagada;
    paymentId.value = referencia;
    state.value = 'exito';
    window.scrollTo({ top: 0 });
  },
  onActualizada: (actualizada) => {
    venta.value = actualizada;
  },
  onNoEncontrada: () => {
    state.value = 'no-encontrada';
  },
});

const cargarVenta = async (): Promise<void> => {
  state.value = 'cargando';
  try {
    venta.value = await VentasConveniosService.obtener(props.ventaId);
    state.value = 'listo';
  } catch (e: any) {
    console.error('Error al cargar el plan de convenio:', e);
    state.value = esNoEncontrada(e) ? 'no-encontrada' : 'error-carga';
  }
};

const valorTotal = computed(() => formatPriceNoDecimal(venta.value?.valor_total ?? 0));

const textoPeriodo = computed(() => {
  const meses = venta.value?.periodo_meses ?? 0;
  return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
});

const vigencia = computed(() =>
  venta.value ? `${formatearFechaSinHora(venta.value.fecha_inicio)} – ${formatearFechaSinHora(venta.value.fecha_fin)}` : '',
);

/** Por qué el plan no se puede pagar; vacío si se puede */
const avisoEstado = computed((): string => {
  if (!venta.value) return '';
  switch (venta.value.estado) {
    case 'PAGADA':
      return 'Tu plan ya está pagado y activo ✅. Revisa tu correo para ver los detalles.';
    case 'PENDIENTE':
      return 'Tu asesor aún está completando tus datos. Intenta más tarde o comunícate con él.';
    case 'CANCELADA':
      return 'Este plan fue cancelado. Comunícate con tu asesor.';
  }
  return venta.value.debito_automatico_activo ? '' : 'Este plan no se puede pagar en línea. Comunícate con tu asesor.';
});

const irPlataforma = (): void => {
  window.open(import.meta.env.PUBLIC_ENLACE_PLATAFORMA || 'https://aliados.segurucolombia.com/', '_blank', 'noopener,noreferrer');
};

onMounted(cargarVenta);
</script>
