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
        <div class="w-full">
          <p>Valor: <span class="font-bold">{{ formatPrice(precioWompi) }}</span></p>
        </div>
      </div>

      <!-- Descuento aplicado -->
      <div class="p-4 bg-green-200 border rounded-md mt-4" v-if="venta.codigo_descuento && venta.valor_descuento > 0">
        <p class="text-green-600">
          ¡Felicidades! Tienes un descuento de
          <span class="font-bold">{{ formatPrice(venta.valor_descuento) }}</span>
          con tu código {{ venta.codigo_descuento }}
        </p>
        <p class="text-blue-600">
          Tu valor a pagar es
          <span class="text-blue-600 font-bold">{{ formatPrice(precioWompi) }}</span>
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

      <!-- Acciones -->
      <div class="flex justify-end gap-2 mt-6">
        <button
          @click="cerrarRetomar"
          class="p-2 px-4 bg-gray-100 text-gray-700 font-semibold rounded-md border border-gray-300 hover:bg-gray-200"
        >
          Cancelar
        </button>
        <button
          @click="irAPagar"
          class="p-2 px-4 bg-blue-600 text-white font-bold rounded-md flex gap-2 items-center hover:bg-blue-700"
        >
          Ir a pagar
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
        </button>
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

          <button type="button" class="debito-continue-btn" @click="handleSelectDebito">
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
                {{ formatPrice(precioWompi) }}
                <span class="payment-option-period">/ {{ vigenciaLabel }}</span>
                <span v-if="venta && venta.valor_descuento > 0" class="cupon-applied-badge">Descuento aplicado</span>
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

          <button type="button" class="wompi-continue-btn" @click="handleSelectWompi">
            Pagar con Wompi
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>

      <button class="payment-modal-close" @click="showPaymentModal = false">Cancelar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Dialog } from 'primevue';
import Swal from 'sweetalert2';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import { VentasService, type VentaDetalle } from '../services/ventas.service';
import { TransactionService } from '../services/transactions';
import { MercadoPagoService } from '../services/mercado-pago.service';
import { formatPrice } from '../shared/priceFormat';
import { formatVigencia } from '../utils/vigencia';

const props = defineProps<{
  ventaId?: string;
}>();

const venta = ref<VentaDetalle | null>(null);
const modalRetomarCompra = ref(false);
const showPaymentModal = ref(false);
const showCardStep = ref(false);
const isProcessing = ref(false);

const precioWompi = computed(() => {
  if (!venta.value) return 0;
  return Math.max(0, venta.value.version_plan.precio - (venta.value.valor_descuento || 0));
});

const tieneDebitoAutomatico = computed(() =>
  venta.value?.version_plan?.valor_debito_automatico != null
);

const precioDebito = computed(() => {
  if (!venta.value) return 0;
  const base = venta.value.version_plan.valor_debito_automatico ?? venta.value.version_plan.precio;
  return Math.max(0, base - (venta.value.valor_descuento || 0));
});

const ahorroDebito = computed(() => Math.max(0, precioWompi.value - precioDebito.value));

const vigenciaLabel = computed(() =>
  formatVigencia(venta.value?.version_plan?.vigencia_numero_meses) || 'período'
);

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
 * Si la venta ya tiene una transacción Wompi pendiente, la reutilizamos en vez
 * de crear otra (el backend rechaza con 400 crear una nueva si ya existe una).
 */
const transaccionWompiPendiente = computed(() => {
  const tx = venta.value?.transaccion;
  if (!tx || tx.proveedor !== 'wompi') return null;
  return ['PENDING', 'PENDIENTE'].includes(String(tx.estado).toUpperCase()) ? tx : null;
});

const handleSelectWompi = async () => {
  if (!venta.value) return;
  isProcessing.value = true;

  // Abrir ventana ANTES del await para que el navegador móvil lo permita
  const paymentWindow = precioWompi.value > 0 ? window.open('', '_blank') : null;

  try {
    let transaccionId = transaccionWompiPendiente.value?.id;

    // Solo creamos una transacción nueva si no hay una pendiente reutilizable
    if (!transaccionId) {
      const service = new TransactionService();
      const { data } = await service.crearTransaccion({ venta_id: venta.value.id });
      if (!data?.transaccion_id) {
        throw new Error('No se recibió transaccion_id desde el backend.');
      }
      transaccionId = data.transaccion_id;
    }

    construirResumen(transaccionId, precioWompi.value, false);

    await sendWompi(transaccionId, precioWompi.value, paymentWindow);
    showPaymentModal.value = false;
    window.location.href = '/procesando-pago';
  } catch (error: any) {
    isProcessing.value = false;
    paymentWindow?.close();
    await mostrarError(error, 'Ocurrió un error al iniciar el pago. Por favor intenta de nuevo.');
  }
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

.wompi-continue-btn:hover {
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

.debito-continue-btn:hover {
  background: #1d4ed8;
}
</style>
