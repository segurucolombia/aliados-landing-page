<template>
  <LoadingSpinner :visible="isProcessing" />

  <!-- Paso de tarjeta MP (débito automático) -->
  <MercadoPagoCardStep
    v-if="showCardStep"
    :initial-doc-type="venta?.tipo_documento"
    :initial-doc-number="venta?.numero_documento"
    @card-tokenized="handleCardTokenized"
    @back="cancelarCardStep"
    @cancel="cancelarCardStep"
  />

  <!-- Modal: Retomar compra -->
  <Dialog
    v-model:visible="modalRetomarCompra"
    modal
    header="Retomar compra"
    class="w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/3 max-w-3xl"
    :closable="!isProcessing"
  >
    <div v-if="venta">
      <p class="font-medium mb-4">¿Deseas finalizar tu proceso de compra?</p>

      <!-- Detalle del plan / comprador -->
      <div class="grid grid-cols-1 sm:grid-cols-2 border p-3 rounded-md gap-2 text-sm">
        <div class="w-full">
          <p>Producto: <span class="font-bold">{{ venta.producto?.nombre }}</span></p>
        </div>
        <div class="w-full">
          <p>Plan seleccionado: <span class="font-bold">{{ venta.version_plan?.nombre }}</span></p>
        </div>
        <div class="w-full">
          <p>Tipo de persona: <span class="font-bold">{{ venta.tipo_persona || (venta.nit ? 'Juridica' : 'Natural') }}</span></p>
        </div>
        <div class="w-full">
          <p>Vigencia: <span class="font-bold">{{ formatVigencia(venta.version_plan?.vigencia_numero_meses) || '—' }}</span></p>
        </div>
        <div class="w-full" v-if="venta.empresa_nombre">
          <p>Nombre empresa: <span class="font-bold">{{ venta.empresa_nombre }}</span></p>
        </div>
        <div class="w-full" v-if="venta.nit">
          <p>NIT: <span class="font-bold">{{ venta.nit }}</span></p>
        </div>
        <div class="w-full">
          <p>Nombre: <span class="font-bold">{{ venta.nombres }} {{ venta.apellidos }}</span></p>
        </div>
        <div class="w-full">
          <p>Documento: <span class="font-bold">{{ venta.tipo_documento }} - {{ venta.numero_documento }}</span></p>
        </div>
        <div class="w-full">
          <p>Email: <span class="font-bold">{{ venta.email }}</span></p>
        </div>
        <div class="w-full">
          <p>Teléfono: <span class="font-bold">{{ venta.telefono }}</span></p>
        </div>
      </div>

      <!-- Detalle de lo que va a pagar: plan, cobros por campos adicionales y cupón -->
      <div class="mt-4">
        <DesgloseCotizacion
          :cotizacion="desgloseVigente"
          :plan-nombre="`Plan ${venta.version_plan?.nombre ?? ''}`"
          :cotizando="cotizando"
          :rechazos="rechazos"
          :mensaje-rechazo="mensajeRechazo"
          :error-cotizacion="errorCotizacion"
          mensaje-vacio="Estamos actualizando el detalle de tu compra…"
        />
      </div>

      <!-- Datos del plan: se pueden revisar y cambiar, y cada cambio se recotiza -->
      <div v-if="tieneCamposAdicionales && ventaRecotizable" class="mt-4">
        <button type="button" class="toggle-formulario" @click="mostrarFormulario = !mostrarFormulario">
          {{ mostrarFormulario ? 'Ocultar los datos de mi plan' : 'Revisar o cambiar los datos de mi plan' }}
        </button>

        <div v-if="mostrarFormulario" class="mt-3">
          <CamposAdicionales
            :campos-adicionales="camposAdicionales"
            :respuestas-iniciales="respuestasIniciales"
            :rechazos="rechazos"
            @update:respuestas="handleRespuestasUpdate"
            @update:datos="handleDatosUpdate"
            @update:valid="handleValidUpdate"
          />
        </div>

        <div v-if="respuestasCambiaron" class="aviso-cambios">
          <p>Cambiaste los datos de tu compra. {{ mensajeCambios }}</p>
          <button type="button" class="aviso-cambios-btn" @click="deshacerCambios">
            Deshacer cambios
          </button>
        </div>
      </div>

      <!-- Venta de débito automático: su monto ya está autorizado, no se recotiza -->
      <p v-if="venta.debito_automatico" class="nota-debito">{{ MENSAJE_VENTA_DEBITO }}</p>

      <!-- Descuento aplicado -->
      <div class="p-4 bg-green-200 border rounded-md mt-4" v-if="venta.codigo_descuento && venta.valor_descuento > 0">
        <p class="text-green-600">
          ¡Felicidades! Tienes un descuento de
          <span class="font-bold">{{ formatPrice(venta.valor_descuento) }}</span>
          con tu código {{ venta.codigo_descuento }}
        </p>
        <p class="text-blue-600">
          Tu valor a pagar es
          <span class="text-blue-600 font-bold">{{ formatPrice(totalAPagar) }}</span>
        </p>
      </div>

      <!-- Coberturas -->
      <div v-if="venta.version_plan?.coberturas?.length" class="mt-4">
        <p class="font-semibold text-gray-800 mb-2">Coberturas incluidas</p>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <li
            v-for="cob in venta.version_plan.coberturas"
            :key="cob.cobertura_id"
            class="flex items-start gap-2"
          >
            <svg width="16" height="16" fill="#16a34a" viewBox="0 0 20 20" class="mt-0.5 flex-shrink-0"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
            <span>
              {{ cob.cobertura?.nombre }}
              <span v-if="cob.valor && Number(cob.valor) > 0" class="text-gray-500">— {{ formatPrice(Number(cob.valor)) }}</span>
            </span>
          </li>
        </ul>
      </div>

      <!-- Un intento de pago sigue vivo: no se recotiza ni se cobra hasta que caduque -->
      <div v-if="pagoEnCurso" class="aviso-pago-en-curso">
        <p>{{ MENSAJE_PAGO_EN_CURSO }}</p>
        <button type="button" class="aviso-pago-btn" @click="reintentarPago">Reintentar</button>
      </div>

      <!-- Acciones -->
      <div class="mt-6">
        <p v-if="motivoBloqueo" class="motivo-bloqueo">{{ motivoBloqueo }}</p>

        <div class="flex justify-end gap-2">
          <button
            @click="cerrarRetomar"
            class="p-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            @click="irAPagar"
            :disabled="!puedeIrAPagar"
            class="p-2 px-4 bg-blue-600 text-white font-bold rounded-md flex gap-2 items-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            Ir a pagar
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>
    </div>
  </Dialog>

  <!-- Modal de selección de método de pago -->
  <div v-if="showPaymentModal" class="payment-modal-overlay" @click.self="showPaymentModal = false">
    <div class="payment-modal">
      <h3 class="payment-modal-title">¿Cómo deseas pagar?</h3>
      <p class="payment-modal-subtitle">Elige cómo quieres gestionar la renovación de tu seguro</p>

      <div class="payment-options">
        <!-- Débito automático -->
        <div v-if="tieneDebitoAutomatico" class="payment-option payment-option-recommended">
          <div class="payment-option-badge">Recomendado</div>
          <div class="payment-option-top">
            <div class="payment-option-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="26" height="26">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="payment-option-info">
              <span class="payment-option-label">Débito automático</span>
              <span class="payment-option-price">{{ formatPrice(precioDebito) }} <span class="payment-option-period">/ {{ vigenciaLabel }}</span></span>
            </div>
            <div v-if="ahorroDebito > 0" class="payment-option-saving">
              Ahorra {{ formatPrice(ahorroDebito) }}
            </div>
          </div>
          <ul class="payment-option-details">
            <li>
              <svg width="14" height="14" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Tu seguro se renueva automáticamente — sin que tengas que hacer nada
            </li>
            <li>
              <svg width="14" height="14" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Vincula tu tarjeta de forma segura con <strong>Mercado Pago</strong>
            </li>
            <li>
              <svg width="14" height="14" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Precio especial por activar la renovación automática
            </li>
          </ul>

          <button
            type="button"
            class="debito-continue-btn"
            :disabled="!puedeIrAPagar"
            @click="handleSelectDebito"
          >
            Pagar con débito
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>

        <!-- Otros medios de pago (Wompi) -->
        <div class="payment-option payment-option-secondary payment-option-wompi">
          <div class="payment-option-top">
            <div class="payment-option-icon payment-option-icon-secondary">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="26" height="26">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div class="payment-option-info">
              <span class="payment-option-label">Otros medios de pago</span>
              <span class="payment-option-price payment-option-price-secondary">
                {{ formatPrice(totalAPagar) }}
                <span class="payment-option-period">/ {{ vigenciaLabel }}</span>
                <span v-if="descuentoVigente > 0" class="cupon-applied-badge">Descuento aplicado</span>
              </span>
            </div>
          </div>
          <ul class="payment-option-details payment-option-details-secondary">
            <li>
              <svg width="14" height="14" fill="#6b7280" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
              En cada renovación debes ingresar a la plataforma y gestionar el pago
            </li>
            <li>
              <svg width="14" height="14" fill="#6b7280" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/><path fill-rule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clip-rule="evenodd"/></svg>
              Procesado por <strong>Wompi</strong>
            </li>
          </ul>

          <!-- Cupón: si la venta ya trae uno se muestra aplicado; si no, se puede agregar -->
          <div v-if="ventaRecotizable || cuponDeLaVenta" class="modal-cupon-section">
            <div v-if="cuponDeLaVenta" class="modal-cupon-aplicado">
              <svg width="14" height="14" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Cupón {{ cuponDeLaVenta.codigo }} aplicado:
              <strong>- {{ formatPrice(cuponDeLaVenta.valor) }}</strong>
            </div>

            <template v-else>
              <div v-if="cuponAgregado" class="modal-cupon-aplicado">
                <svg width="14" height="14" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                Cupón {{ cuponAgregado }} aplicado:
                <strong>- {{ formatPrice(descuentoVigente) }}</strong>
                <button type="button" class="cupon-quitar" @click="quitarCupon">Quitar</button>
              </div>

              <div v-else class="modal-cupon-input">
                <input
                  v-model="codigoCupon"
                  type="text"
                  placeholder="¿Tienes un cupón?"
                  class="modal-cupon-field"
                  :class="{ 'modal-cupon-field-error': errorCupon }"
                  @keydown.enter.prevent="aplicarCupon"
                />
                <button
                  type="button"
                  class="modal-cupon-btn"
                  :disabled="!puedeAplicarCupon"
                  @click="aplicarCupon"
                >
                  {{ aplicandoCupon ? 'Validando...' : 'Aplicar' }}
                </button>
              </div>

              <p v-if="errorCupon" class="modal-cupon-error">{{ errorCupon }}</p>
            </template>
          </div>

          <button
            type="button"
            class="wompi-continue-btn"
            :disabled="!puedeIrAPagar"
            @click="handleSelectWompi"
          >
            Pagar con Wompi
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>

      <p v-if="motivoBloqueo" class="motivo-bloqueo-modal">{{ motivoBloqueo }}</p>

      <button class="payment-modal-close" @click="showPaymentModal = false">Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { Dialog } from 'primevue';
import Swal from 'sweetalert2';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import DesgloseCotizacion from './DesgloseCotizacion.vue';
import { VentasService, extraerRechazos, motivoConflicto, type VentaDetalle } from '../services/ventas.service';
import { TransactionService } from '../services/transactions';
import { MercadoPagoService } from '../services/mercado-pago.service';
import { formatPrice } from '../shared/priceFormat';
import { formatVigencia } from '../utils/vigencia';
import { transformarCamposAdicionalesBackend } from '../utils/transformCamposAdicionales';
import { cotizacionDeVenta, mismasRespuestas, respuestasDesdeAdicionales } from '../utils/adicionalesVenta';
import useCotizacion, { DEBOUNCE_COTIZACION_MS } from '../composables/cotizacion';
import type { CotizarVentaInput, RespuestaCampo } from '../types/cotizacion';
import type { CamposAdicionalesCapturados } from '../types/planes';

const CamposAdicionales = defineAsyncComponent(() => import('./register/components/CamposAdicionales.vue'));

const props = defineProps<{
  ventaId?: string;
}>();

const venta = ref<VentaDetalle | null>(null);
const modalRetomarCompra = ref(false);
const showPaymentModal = ref(false);
const showCardStep = ref(false);
const isProcessing = ref(false);

/* ------------------------------------------------------------------ *
 * Lo que la venta ya tiene registrado
 * ------------------------------------------------------------------ */

/**
 * Desglose guardado en la venta: es lo que el cliente aceptó pagar. Sale tal cual
 * del backend (`valor_version`, `adicionales`, `valor_total`), acá no se recalcula.
 */
const desgloseVenta = computed(() => (venta.value ? cotizacionDeVenta(venta.value) : null));

const camposAdicionales = computed(() =>
  transformarCamposAdicionalesBackend(venta.value?.version_plan?.campos_adicionales),
);

const tieneCamposAdicionales = computed(() => (camposAdicionales.value?.secciones.length ?? 0) > 0);

/**
 * Respuestas con las que quedó registrada la venta. Arrancan reconstruidas desde
 * `adicionales` y se reemplazan cuando el backend guarda una recotización.
 */
const respuestasVenta = ref<RespuestaCampo[]>([]);

/** Las que se le pasan al formulario para repintarlo (cambian al deshacer cambios) */
const respuestasIniciales = ref<RespuestaCampo[]>([]);
/** Las que tiene el formulario ahora mismo */
const respuestas = ref<RespuestaCampo[]>([]);
const formularioValido = ref(true);
const mostrarFormulario = ref(false);

/** Snapshot crudo del formulario, tal como viaja en `datos_adicionales` */
const datosAdicionales = ref<CamposAdicionalesCapturados | null>(null);

const respuestasCambiaron = computed(() => !mismasRespuestas(respuestas.value, respuestasVenta.value));

/* ------------------------------------------------------------------ *
 * Cotización (TAREA 2)
 * ------------------------------------------------------------------ */

const {
  cotizacion,
  rechazos,
  mensajeRechazo,
  errorCotizacion,
  cotizando,
  hayRechazos,
  cotizar,
  cotizarAhora,
  cancelarCotizacion,
  registrarRechazos,
  limpiarRechazos,
} = useCotizacion();

// Cotización paralela con débito automático: se cobra sobre `valor_debito_automatico`
const cotizacionDebitoState = useCotizacion();
const cotizacionDebito = cotizacionDebitoState.cotizacion;

/**
 * Cupón que el cliente agrega al retomar la compra. Solo se puede agregar uno
 * cuando la venta no trae ninguno: si ya tiene, el cupón de la venta es el que manda.
 */
const cuponAgregado = ref<string | null>(null);
const codigoCupon = ref('');
const errorCupon = ref('');
const aplicandoCupon = ref(false);

/** El cupón con el que quedó registrada la venta */
const cuponDeLaVenta = computed(() => {
  if (!venta.value?.codigo_descuento) return null;
  return {
    codigo: venta.value.codigo_descuento,
    valor: desgloseVenta.value?.valor_descuento ?? 0,
  };
});

/** Código que va en la cotización: el de la venta, o el que agregó el cliente */
const codigoDescuento = computed(() => venta.value?.codigo_descuento || cuponAgregado.value || '');

/**
 * Preview del desglose mientras el cliente edita (`POST /ventas/cotizar`, que no
 * persiste nada). Va contra la versión de la venta —la misma con la que recotiza el
 * PUT—: cotizar contra otra mostraría un total que nunca se va a cobrar.
 */
const armarInputCotizacion = (debitoAutomatico: boolean): CotizarVentaInput => ({
  version_id: venta.value?.version_plan_id ?? '',
  ...(codigoDescuento.value ? { codigo_descuento: codigoDescuento.value } : {}),
  ...(debitoAutomatico ? { debito_automatico: true } : {}),
  respuestas: respuestas.value,
});

/** Hay que volver a preguntarle el precio al backend */
const requiereCotizar = computed(
  () => respuestasCambiaron.value || cuponAgregado.value !== null,
);

// Cada cambio del formulario o del cupón recotiza (con debounce)
watch([respuestas, requiereCotizar, formularioValido], () => {
  // `aplicarCupon` ya está cotizando este mismo cambio, sin debounce: encimarle otra
  // petición invalidaría la suya y el cupón se vería como rechazado
  if (aplicandoCupon.value) return;

  if (!venta.value || !requiereCotizar.value || !formularioValido.value) {
    cancelarCotizacion();
    return;
  }

  cotizar(armarInputCotizacion(false), DEBOUNCE_COTIZACION_MS);
}, { deep: true });

/** La cotización reemplaza al desglose guardado mientras el cliente edita */
const usaCotizacion = computed(
  () => respuestasCambiaron.value || cuponAgregado.value !== null,
);

/** El desglose que se le muestra al cliente */
const desgloseVigente = computed(() => (usaCotizacion.value ? cotizacion.value : desgloseVenta.value));

/** Lo único que se cobra */
const totalAPagar = computed(() => desgloseVigente.value?.valor_total ?? 0);

/** Descuento que se está aplicando ahora mismo, venga de la venta o del cupón agregado */
const descuentoVigente = computed(() => desgloseVigente.value?.valor_descuento ?? 0);

/* ------------------------------------------------------------------ *
 * Medios de pago
 * ------------------------------------------------------------------ */

const tieneDebitoAutomatico = computed(() =>
  venta.value?.version_plan?.valor_debito_automatico != null
);

/** Total con débito automático: el cotizado manda; el valor de la versión es el respaldo */
const precioDebito = computed(() => {
  const cotizado = cotizacionDebito.value?.valor_total;
  if (cotizado != null) return cotizado;

  if (!venta.value) return 0;
  const base = venta.value.version_plan.valor_debito_automatico ?? venta.value.version_plan.precio;
  return Math.max(0, base - (venta.value.valor_descuento || 0));
});

const ahorroDebito = computed(() => Math.max(0, totalAPagar.value - precioDebito.value));

const vigenciaLabel = computed(() =>
  formatVigencia(venta.value?.version_plan?.vigencia_numero_meses) || 'período'
);

/** El débito se cobra sobre otro valor: se cotiza aparte para mostrar cada número */
const cotizarDebito = (): void => {
  if (!venta.value || !tieneDebitoAutomatico.value || !formularioValido.value) return;
  void cotizacionDebitoState.cotizarAhora(armarInputCotizacion(true));
};

// El modal muestra los dos totales: el de débito se cotiza al abrirlo
watch(showPaymentModal, (abierto) => {
  if (!abierto) return;
  cotizarDebito();
});

/* ------------------------------------------------------------------ *
 * Cupón de descuento
 * ------------------------------------------------------------------ */

const puedeAplicarCupon = computed(() => codigoCupon.value.trim() !== '' && !aplicandoCupon.value);

/**
 * Aplica el cupón cotizando con él: el backend valida el código y devuelve el
 * descuento. Un 400 (cupón inválido, inactivo o que no aplica al plan) se muestra
 * junto al campo y deja la compra como estaba.
 */
const aplicarCupon = async (): Promise<void> => {
  const codigo = codigoCupon.value.trim();
  errorCupon.value = '';

  // El botón se deshabilita solo, pero el Enter del campo no pasa por ahí
  if (aplicandoCupon.value) return;
  if (!venta.value || cuponDeLaVenta.value) return;
  if (!codigo) {
    errorCupon.value = 'Ingresa un código de descuento';
    return;
  }

  const anterior = cuponAgregado.value;
  cuponAgregado.value = codigo;
  aplicandoCupon.value = true;

  try {
    const resultado = await cotizarAhora(armarInputCotizacion(false));

    // Un 422 no habla del cupón: son los datos del plan, y se muestran en el desglose
    if (!resultado && !hayRechazos.value) {
      cuponAgregado.value = anterior;
      errorCupon.value = errorCotizacion.value || 'No pudimos aplicar el cupón. Intenta de nuevo.';
      errorCotizacion.value = '';
      if (requiereCotizar.value) await cotizarAhora(armarInputCotizacion(false));
      return;
    }

    codigoCupon.value = codigo;
  } finally {
    aplicandoCupon.value = false;
  }

  cotizarDebito();
};

/** Quita el cupón que agregó el cliente: la compra vuelve a su valor original */
const quitarCupon = (): void => {
  cuponAgregado.value = null;
  codigoCupon.value = '';
  errorCupon.value = '';
  errorCotizacion.value = '';
  cotizarDebito();
};

/* ------------------------------------------------------------------ *
 * Cuándo se puede seguir al pago
 * ------------------------------------------------------------------ */

/**
 * Ventas que el backend acepta recotizar (`PUT /ventas/:id/cotizacion`). Las otras dos
 * las rechaza con 409: una que ya no está PENDIENTE (pagada o cancelada) y una de
 * débito automático, cuyo monto ya quedó autorizado en Mercado Pago. En esas no se
 * edita ni el cupón ni los datos del plan.
 */
const ventaRecotizable = computed(() => {
  const actual = venta.value;
  if (!actual) return false;

  return actual.estado === 'PENDIENTE' && actual.debito_automatico === false;
});

const MENSAJE_VENTA_NO_PENDIENTE =
  'Esta compra ya no está pendiente de pago.';

const MENSAJE_VENTA_DEBITO =
  'Esta compra se paga con débito automático: su valor ya quedó autorizado con tu tarjeta '
  + 'y no se puede modificar. Escríbenos si necesitas cambiar algo.';

/** Qué le decimos al cliente sobre los cambios que hizo en el formulario */
const mensajeCambios = 'Al continuar al pago actualizamos tu compra con el nuevo valor.';

/**
 * Hay un intento de pago vivo (menos de diez minutos): ni se recotiza ni se cobra
 * hasta que caduque. Se le ofrece reintentar, nunca se reintenta solo.
 */
const pagoEnCurso = ref(false);

const MENSAJE_PAGO_EN_CURSO =
  'Tienes un pago en proceso. Si no alcanzaste a terminarlo, espera unos minutos y vuelve a intentarlo.';

/** Por qué no se puede seguir al pago; vacío cuando sí se puede */
const motivoBloqueo = computed(() => {
  if (!venta.value) return 'Estamos cargando tu compra…';
  if (venta.value.estado !== 'PENDIENTE') return MENSAJE_VENTA_NO_PENDIENTE;
  if (hayRechazos.value) return 'Con estos datos no podemos emitir la póliza: revisa los mensajes del detalle.';
  if (!formularioValido.value) return 'Completa los datos obligatorios de tu plan.';
  if (cotizando.value) return 'Estamos actualizando el valor de tu compra…';
  if (errorCotizacion.value) return errorCotizacion.value;
  return '';
});

// El pago en curso no entra en `motivoBloqueo`: ya se explica en su propio aviso,
// con el botón de reintentar
const puedeIrAPagar = computed(() => motivoBloqueo.value === '' && !pagoEnCurso.value);

/* ------------------------------------------------------------------ *
 * Guardar la cotización en la venta antes de cobrar
 * ------------------------------------------------------------------ */

/**
 * Guarda en la venta el cupón y las respuestas con las que se recotizó
 * (`PUT /ventas/:id/cotizacion`) y deja el detalle local igual a lo que quedó
 * registrado: `valor_total` es lo que se va a cobrar.
 *
 * Las respuestas van completas (reemplazan a las guardadas) y el cupón se reenvía
 * siempre, porque omitirlo lo quita.
 */
const aplicarCambiosEnLaVenta = async (): Promise<void> => {
  if (!venta.value) throw new Error('No hay una compra cargada.');

  const respuestasEnviadas = [...respuestas.value];
  const actualizada = await VentasService.actualizarCotizacion(venta.value.id, {
    codigo_descuento: codigoDescuento.value || null,
    respuestas: respuestasEnviadas,
    ...(datosAdicionales.value ? { datos_adicionales: datosAdicionales.value } : {}),
  });

  // La venta pasa a ser lo que el backend acaba de guardar. La transacción anterior,
  // si la había, la anuló el PUT: la nueva se pide después con crear-transaccion.
  venta.value = {
    ...venta.value,
    valor_version: actualizada.valor_version,
    valores_adicionales: actualizada.valores_adicionales,
    valor_descuento: actualizada.valor_descuento,
    valor_total: actualizada.valor_total,
    codigo_descuento: actualizada.codigo_descuento ?? null,
    adicionales: actualizada.adicionales ?? venta.value.adicionales,
    transaccion: null,
  };

  respuestasVenta.value = respuestasEnviadas;
  cuponAgregado.value = null;
  errorCupon.value = '';
  pagoEnCurso.value = false;
  limpiarRechazos();
};

/** Muestra el error de la recotización donde le corresponde a cada caso */
const manejarErrorDeActualizacion = async (error: any): Promise<void> => {
  const estado = error?.response?.status;

  // 422: con esos datos no se puede vender. Se marcan los campos en el detalle
  if (estado === 422 && extraerRechazos(error).length > 0) {
    registrarRechazos(error);
    showPaymentModal.value = false;
    showCardStep.value = false;
    modalRetomarCompra.value = true;
    return;
  }

  // 400: el cupón no aplica. El campo vive en el modal de pago: ahí se muestra
  if (estado === 400) {
    cuponAgregado.value = null;
    errorCupon.value = error?.response?.data?.message
      || 'No pudimos aplicar el cupón. Intenta con otro código.';
    // Si el cliente venía del paso de la tarjeta, vuelve al modal para ver el mensaje
    showCardStep.value = false;
    showPaymentModal.value = true;
    return;
  }

  // 409: son tres casos distintos y cada uno se le cuenta al cliente a su manera
  const conflicto = motivoConflicto(error);

  if (conflicto === 'pago-en-curso') {
    // Hay un intento de pago de menos de diez minutos: se espera, no se reintenta solo
    pagoEnCurso.value = true;
    showPaymentModal.value = false;
    showCardStep.value = false;
    modalRetomarCompra.value = true;
    return;
  }

  if (conflicto === 'debito-automatico') {
    // El monto ya quedó autorizado en Mercado Pago: la pantalla deja de ser editable
    await mostrarError(error, MENSAJE_VENTA_DEBITO);
    showPaymentModal.value = false;
    showCardStep.value = false;
    await cargarVenta();
    return;
  }

  if (conflicto === 'no-pendiente') {
    // Ya se pagó o se canceló: se recarga para mostrar la compra como quedó
    await mostrarError(error, MENSAJE_VENTA_NO_PENDIENTE);
    showPaymentModal.value = false;
    showCardStep.value = false;
    await cargarVenta();
    return;
  }

  if (estado === 404) {
    await mostrarError(error, 'No encontramos esta compra.');
    return;
  }

  await mostrarError(error, 'No pudimos actualizar tu compra. Por favor intenta de nuevo.');
};

/**
 * Guarda la cotización antes de cobrar. Se llama SIEMPRE, aunque el cliente no haya
 * cambiado nada: es el paso que fija el valor y el que anula un intento de pago
 * abandonado. Devuelve false si algo falló (el error ya quedó mostrado).
 */
const guardarCambios = async (): Promise<boolean> => {
  if (!ventaRecotizable.value) return true; // una venta de débito no se recotiza

  try {
    await aplicarCambiosEnLaVenta();
    return true;
  } catch (error: any) {
    await manejarErrorDeActualizacion(error);
    return false;
  }
};

/** Vuelve a las respuestas con las que se creó la venta */
const deshacerCambios = () => {
  respuestasIniciales.value = [...respuestasVenta.value];
  respuestas.value = [...respuestasVenta.value];
};

const handleRespuestasUpdate = (nuevas: RespuestaCampo[]) => {
  respuestas.value = nuevas;
};

const handleDatosUpdate = (datos: CamposAdicionalesCapturados) => {
  datosAdicionales.value = datos;
};

const handleValidUpdate = (valido: boolean) => {
  formularioValido.value = valido;
};

/* ------------------------------------------------------------------ *
 * Carga de la venta
 * ------------------------------------------------------------------ */

/**
 * Obtiene el id de la venta desde la prop (ruta /venta/:id) o, como respaldo,
 * desde el query param venta-id / venta_id.
 */
const resolverVentaId = (): string | null => {
  if (props.ventaId) return props.ventaId;
  const url = new URL(window.location.href);
  return url.searchParams.get('venta-id') || url.searchParams.get('venta_id');
};

const cargarVenta = async () => {
  const ventaId = resolverVentaId();
  if (!ventaId) return;

  isProcessing.value = true;
  try {
    const data = await VentasService.obtenerDetalle(ventaId);
    venta.value = data;

    // El formulario arranca con lo que el cliente ya había respondido
    respuestasVenta.value = respuestasDesdeAdicionales(data.adicionales);
    respuestasIniciales.value = [...respuestasVenta.value];
    respuestas.value = [...respuestasVenta.value];

    modalRetomarCompra.value = true;
  } catch (error: any) {
    console.error('Error al cargar la venta:', error);
    const msg = error?.response?.data?.message || 'No se pudo cargar la información de tu compra.';
    Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#1e40af' });
  } finally {
    isProcessing.value = false;
  }
};

const cerrarRetomar = () => {
  modalRetomarCompra.value = false;
};

const irAPagar = () => {
  if (!puedeIrAPagar.value) return;
  modalRetomarCompra.value = false;
  showPaymentModal.value = true;
};

/** Construye el resumen de compra que consume la pantalla /procesando-pago. */
const construirResumen = (transaccionId: string, precio: number, debito = false) => {
  if (!venta.value) return;
  const resumen = {
    transaccion_id: transaccionId,
    plan_nombre: venta.value.version_plan.nombre,
    precio,
    vigencia_numero_meses: venta.value.version_plan.vigencia_numero_meses,
    comprador_nombre: venta.value.nombres,
    comprador_apellido: venta.value.apellidos,
    comprador_email: venta.value.email,
    comprador_documento_tipo: venta.value.tipo_documento,
    comprador_documento: venta.value.numero_documento,
    comprador_telefono: venta.value.telefono,
    fecha_compra: new Date().toISOString(),
    ...(debito && { debito_automatico: true }),
  };
  localStorage.setItem('compra_resumen', JSON.stringify(resumen));
  localStorage.setItem('transaccion_id', transaccionId);
};

const mostrarError = async (error: any, fallback: string) => {
  console.error(fallback, error, 'respuesta backend:', error?.response?.data);
  const msg = error?.response?.data?.message || error?.message || fallback;
  Swal.fire({ title: 'Error', text: msg, icon: 'error', confirmButtonColor: '#1e40af' });
};

/* ----------------------------- Wompi ----------------------------- */

/**
 * El backend rechaza crear una transacción si la venta ya tiene una PENDING de menos
 * de diez minutos (pasado ese tiempo la marca DECLINED y crea otra). No es un error
 * para reintentar en bucle: se espera y el cliente decide cuándo reintentar.
 */
const esErrorTransaccionPendiente = (error: any): boolean =>
  error?.response?.status === 400
  && /transacci[oó]n\s+(de pago\s+)?(pendiente|en curso)/i.test(String(error?.response?.data?.message ?? ''));

/**
 * Transacción con la que se cobra. Se pide siempre después de guardar la cotización:
 * el PUT ya anuló el intento anterior si estaba abandonado, así que no se reutiliza
 * ninguna transacción vieja (su monto podría no ser el que se acaba de guardar).
 */
const crearTransaccionWompi = async (ventaId: string): Promise<string> => {
  const service = new TransactionService();
  const { data } = await service.crearTransaccion({ venta_id: ventaId });

  if (!data?.transaccion_id) throw new Error('No se recibió transaccion_id desde el backend.');
  return data.transaccion_id;
};

const handleSelectWompi = async () => {
  if (!venta.value || !puedeIrAPagar.value) return;
  isProcessing.value = true;

  // Abrir ventana ANTES del await para que el navegador móvil lo permita
  const paymentWindow = totalAPagar.value > 0 ? window.open('', '_blank') : null;

  try {
    // Paso obligatorio antes de cobrar, haya cambiado algo o no: fija el valor en la
    // venta y anula un intento de pago abandonado
    const guardada = await guardarCambios();
    if (!guardada) {
      isProcessing.value = false;
      paymentWindow?.close();
      return;
    }

    const transaccionId = await crearTransaccionWompi(venta.value.id);

    construirResumen(transaccionId, totalAPagar.value, false);

    await sendWompi(transaccionId, totalAPagar.value, paymentWindow);
    showPaymentModal.value = false;
    window.location.href = '/procesando-pago';
  } catch (error: any) {
    isProcessing.value = false;
    paymentWindow?.close();

    // Un pago sigue vivo: se le avisa y se le deja reintentar, sin reintentar solos
    if (esErrorTransaccionPendiente(error)) {
      pagoEnCurso.value = true;
      showPaymentModal.value = false;
      modalRetomarCompra.value = true;
      return;
    }

    await mostrarError(error, 'Ocurrió un error al iniciar el pago. Por favor intenta de nuevo.');
  }
};

/** Reintento manual después de un "tienes un pago en proceso" */
const reintentarPago = () => {
  pagoEnCurso.value = false;
  showPaymentModal.value = true;
};

const sha256 = async (text: string): Promise<string> => {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

const sendWompi = async (
  transaccionId: string,
  precio: number,
  paymentWindow: Window | null
) => {
  if (precio === 0 || !venta.value) return;

  const amountInCents = precio * 100;
  const currency = 'COP';

  const params = new URLSearchParams();
  params.set('public-key', import.meta.env.PUBLIC_KEY_WOMPI);
  params.set('currency', currency);
  params.set('amount-in-cents', String(amountInCents));
  params.set('reference', transaccionId);

  const integrityKey = import.meta.env.PUBLIC_INTEGRITY_KEY_WOMPI;
  if (integrityKey) {
    const integrityHash = await sha256(`${transaccionId}${amountInCents}${currency}${integrityKey}`);
    params.set('signature:integrity', integrityHash);
  }

  const redirectUrl = import.meta.env.PUBLIC_WOMPI_REDIRECT_PAYMENT_COMPLETE || window.location.origin + '/gracias';
  params.set('redirect-url', redirectUrl);

  params.set('customer-data:email', venta.value.email);
  params.set('customer-data:full-name', `${venta.value.nombres} ${venta.value.apellidos}`);
  params.set('customer-data:phone-number', venta.value.telefono);
  params.set('customer-data:legal-id-type', venta.value.tipo_documento);
  params.set('customer-data:legal-id', venta.value.numero_documento);

  const wompiUrl = `${import.meta.env.PUBLIC_CHECKOUT_URL_WOMPI}?${params.toString()}`;

  if (paymentWindow) {
    paymentWindow.location.href = wompiUrl;
  } else {
    window.open(wompiUrl, '_blank', 'noopener,noreferrer');
  }
};

/* ------------------------ Débito automático ------------------------ */

const handleSelectDebito = () => {
  if (!puedeIrAPagar.value) return;
  showPaymentModal.value = false;
  showCardStep.value = true;
};

const cancelarCardStep = () => {
  showCardStep.value = false;
  showPaymentModal.value = true;
};

const handleCardTokenized = async (cardTokenId: string) => {
  if (!venta.value) return;
  isProcessing.value = true;

  try {
    // Mercado Pago cobra sobre lo que el backend tiene registrado, así que la
    // cotización se guarda antes, igual que en Wompi
    const guardada = await guardarCambios();
    if (!guardada) {
      isProcessing.value = false;
      return;
    }

    const response = await MercadoPagoService.crearTransaccionDebito({
      venta_id: venta.value.id,
      card_token_id: cardTokenId,
      back_url: `${window.location.origin}/procesando-pago`,
      created_by: venta.value.email,
    });

    if (!response?.success) {
      throw new Error(response?.message || 'No se pudo procesar el débito automático.');
    }

    // El endpoint respondió ok ⇒ el primer cobro ya fue cursado por Mercado Pago.
    construirResumen(venta.value.id, precioDebito.value, true);
    localStorage.setItem('venta_pendiente_id', venta.value.id);

    showCardStep.value = false;
    window.location.href = '/procesando-pago';
  } catch (error: any) {
    isProcessing.value = false;
    await mostrarError(error, 'Ocurrió un error al procesar el débito automático. Por favor intenta de nuevo.');
  }
};

cargarVenta();
</script>

<style scoped>
/* Aviso de cambio de versión del plan */
.toggle-formulario {
  background: none;
  border: none;
  padding: 0;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  font-family: inherit;
}

.aviso-cambios {
  margin-top: 0.75rem;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  font-size: 0.85rem;
  color: #1e40af;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.aviso-cambios p {
  margin: 0;
  flex: 1;
  min-width: 14rem;
}

.aviso-cambios-btn {
  background: white;
  border: 1px solid #93c5fd;
  border-radius: 6px;
  padding: 0.35rem 0.75rem;
  color: #1d4ed8;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.aviso-cambios-btn:hover {
  background: #dbeafe;
}

.nota-debito {
  margin-top: 1rem;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 10px;
  padding: 0.75rem 0.9rem;
  font-size: 0.82rem;
  color: #4b5563;
  line-height: 1.45;
}

.aviso-pago-en-curso {
  margin-top: 1rem;
  border: 1px solid #fde68a;
  background: #fffbeb;
  border-radius: 12px;
  padding: 0.9rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.aviso-pago-en-curso p {
  margin: 0;
  color: #78350f;
  font-size: 0.85rem;
  line-height: 1.45;
  flex: 1 1 16rem;
}

.aviso-pago-btn {
  border: 1px solid #f59e0b;
  background: #fff;
  color: #92400e;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 8px;
  padding: 0.45rem 0.9rem;
  cursor: pointer;
}

.aviso-pago-btn:hover {
  background: #fef3c7;
}

.motivo-bloqueo {
  margin: 0 0 0.75rem;
  font-size: 0.85rem;
  color: #6b7280;
  text-align: right;
}

/* Modal de selección de pago */
.payment-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.payment-modal {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
}

.payment-modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.25rem;
  text-align: center;
}

.payment-modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 1.25rem;
  text-align: center;
}

.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.payment-option {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 1.1rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  text-align: left;
}

.payment-option-recommended {
  border-color: #3b82f6;
  background: #f0f7ff;
}

.payment-option-recommended:hover {
  border-color: #2563eb;
  background: #e0effe;
}

.payment-option-secondary:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}

.payment-option-badge {
  position: absolute;
  top: -11px;
  left: 1rem;
  background: #3b82f6;
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.payment-option-top {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.payment-option-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #dbeafe;
  color: #2563eb;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.payment-option-icon-secondary {
  background: #f3f4f6;
  color: #6b7280;
}

.payment-option-info {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  flex: 1;
}

.payment-option-label {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1f2937;
}

.payment-option-price {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2563eb;
  line-height: 1.2;
}

.payment-option-price-secondary {
  color: #6b7280;
}

.payment-option-period {
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
}

.payment-option-saving {
  background: #fbbf24;
  color: #78350f;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.payment-option-details {
  list-style: none;
  padding: 0;
  margin: 0;
  border-top: 1px solid #dbeafe;
  padding-top: 0.65rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.payment-option-details-secondary {
  border-top-color: #e5e7eb;
}

.payment-option-details li {
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #374151;
  line-height: 1.4;
}

.payment-option-details li svg {
  flex-shrink: 0;
  margin-top: 1px;
}

.payment-option-details-secondary li {
  color: #6b7280;
}

.payment-modal-close {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: 0.6rem;
  border: none;
  background: none;
  color: #9ca3af;
  font-size: 0.875rem;
  cursor: pointer;
  text-align: center;
}

.payment-modal-close:hover {
  color: #6b7280;
}

.payment-option-wompi {
  cursor: default;
}

.modal-cupon-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.75rem;
}

.modal-cupon-aplicado {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
  font-size: 0.82rem;
  color: #166534;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
}

.cupon-quitar {
  margin-left: auto;
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
  font-family: inherit;
}

.cupon-quitar:hover {
  color: #374151;
}

.modal-cupon-input {
  display: flex;
  gap: 0.5rem;
}

.modal-cupon-field {
  flex: 1;
  min-width: 0;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 0.5rem 0.7rem;
  font-size: 0.85rem;
  font-family: inherit;
  color: #1f2937;
}

.modal-cupon-field:focus {
  outline: none;
  border-color: #2563eb;
}

.modal-cupon-field-error {
  border-color: #fca5a5;
}

.modal-cupon-btn {
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
}

.modal-cupon-btn:hover:not(:disabled) {
  background: #f9fafb;
}

.modal-cupon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-cupon-error {
  margin: 0.4rem 0 0;
  font-size: 0.78rem;
  color: #b91c1c;
}

.motivo-bloqueo-modal {
  margin: 1rem 0 0;
  font-size: 0.8rem;
  color: #6b7280;
  text-align: center;
}

.wompi-continue-btn:disabled,
.debito-continue-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cupon-applied-badge {
  font-size: 0.68rem;
  background: #dcfce7;
  color: #16a34a;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 20px;
  margin-left: 0.3rem;
  vertical-align: middle;
}

.wompi-continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.65rem 1rem;
  background: #374151;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.wompi-continue-btn:hover:not(:disabled) {
  background: #1f2937;
}

.debito-continue-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.65rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}

.debito-continue-btn:hover:not(:disabled) {
  background: #1d4ed8;
}
</style>
