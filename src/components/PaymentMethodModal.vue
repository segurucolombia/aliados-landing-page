<template>
  <!-- Modal de selección de método de pago: es el último paso antes de pagar -->
  <div class="payment-modal-overlay" @click.self="$emit('close')">
    <div class="payment-modal">
      <h3 class="payment-modal-title">¿Cómo deseas pagar?</h3>
      <p class="payment-modal-subtitle">Elige cómo quieres gestionar la renovación de tu seguro</p>

      <div class="payment-options">
        <!-- Débito automático -->
        <div class="payment-option payment-option-recommended">
          <div class="payment-option-badge">Recomendado</div>
          <div class="payment-option-top">
            <div class="payment-option-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="26" height="26">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div class="payment-option-info">
              <span class="payment-option-label">Débito automático</span>
              <span class="payment-option-price">{{ formatCurrency(valorDebitoAutomatico) }} <span class="payment-option-period">/ {{ vigenciaLabel }}</span></span>
            </div>
            <div class="payment-option-saving">
              Ahorra {{ formatCurrency(planPrecio - valorDebitoAutomatico) }}
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

          <button type="button" class="debito-continue-btn" @click="handleSelectDebitoAutomatico">
            Pagar con débito
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>

        <!-- Pago manual -->
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
                {{ formatCurrency(totalAPagar) }}
                <span class="payment-option-period">/ {{ vigenciaLabel }}</span>
                <span v-if="cuponValidado" class="cupon-applied-badge">Cupón aplicado</span>
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

          <!-- Cupón de descuento (solo para pago con Wompi) -->
          <div class="modal-cupon-section" @click.stop>
            <div v-if="cuponValidado" class="modal-cupon-aplicado">
              <svg width="16" height="16" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              Cupón {{ cuponAplicado?.codigo }} aplicado: <strong>-{{ formatCurrency(valorDescuento) }}</strong>
              <button type="button" class="cupon-quitar" @click.stop="quitarCupon">Quitar</button>
            </div>
            <template v-else>
              <div class="modal-cupon-input">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/></svg>
                <input
                  v-model="codigoIngresado"
                  placeholder="¿Tienes un cupón?"
                  class="modal-cupon-field"
                  :class="{ 'modal-cupon-field-error': errorCupon }"
                  @keydown.enter.prevent="handleAplicarCupon"
                />
                <button
                  type="button"
                  class="modal-cupon-btn"
                  @click.stop="handleAplicarCupon"
                  :disabled="!puedeAplicar"
                >
                  {{ validandoCupon ? 'Validando...' : 'Aplicar' }}
                </button>
              </div>
              <p v-if="errorCupon" class="modal-cupon-error">{{ errorCupon }}</p>
            </template>
          </div>

          <!-- Botón continuar con Wompi -->
          <button type="button" class="wompi-continue-btn" @click="handleSelectPagoUnico">
            Pagar con Wompi
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </button>
        </div>
      </div>

      <button class="payment-modal-close" @click="$emit('close')">Atrás</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { formatVigencia } from '../utils/vigencia';
import useCupon from '../composables/cupon';

const props = withDefaults(defineProps<{
  planPrecio: number;
  planId: string;
  valorDebitoAutomatico: number;
  vigenciaNumeroMeses?: number | null;
}>(), {
  vigenciaNumeroMeses: null,
});

const emit = defineEmits<{
  (e: 'select-pago-unico'): void;
  (e: 'select-debito'): void;
  (e: 'close'): void;
}>();

const {
  codigoIngresado,
  cuponAplicado,
  errorCupon,
  validandoCupon,
  valorDescuento,
  cuponValidado,
  puedeAplicar,
  totalConDescuento,
  aplicarCupon,
  quitarCupon,
  sincronizarConPlan,
} = useCupon();

const vigenciaLabel = computed(() => formatVigencia(props.vigenciaNumeroMeses) || 'renovación');

const totalAPagar = computed(() => totalConDescuento(props.planPrecio));

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// El cupón se pudo haber aplicado antes (ej. al reabrir el modal o en otro plan):
// si se validó contra otro plan se revalida contra el plan que se está comprando
onMounted(() => {
  sincronizarConPlan(props.planId);
});

const handleAplicarCupon = () => aplicarCupon(props.planId);

const handleSelectPagoUnico = () => {
  emit('select-pago-unico');
};

const handleSelectDebitoAutomatico = () => {
  emit('select-debito');
};
</script>

<style scoped>
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

/* Tarjeta Wompi como div seleccionable */
.payment-option-wompi {
  cursor: default;
}

/* Cupón dentro del modal */
.modal-cupon-section {
  border-top: 1px solid #e5e7eb;
  padding-top: 0.65rem;
  margin-top: 0.1rem;
}

.modal-cupon-aplicado {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.82rem;
  color: #16a34a;
  font-weight: 600;
}

.cupon-quitar {
  margin-left: auto;
  font-size: 0.75rem;
  color: #9ca3af;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  text-decoration: underline;
}

.cupon-quitar:hover {
  color: #6b7280;
}

.modal-cupon-input {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #9ca3af;
}

.modal-cupon-field {
  flex: 1;
  border: 1.5px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.4rem 0.6rem;
  font-size: 0.82rem;
  color: #374151;
  outline: none;
  transition: border-color 0.15s;
  font-family: inherit;
}

.modal-cupon-field:focus {
  border-color: #9ca3af;
}

.modal-cupon-btn {
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 0.4rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
  font-family: inherit;
}

.modal-cupon-btn:hover:not(:disabled) {
  background: #e5e7eb;
}

.modal-cupon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.modal-cupon-field-error {
  border-color: #dc2626;
}

.modal-cupon-error {
  margin: 0.35rem 0 0;
  font-size: 0.75rem;
  color: #dc2626;
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

/* Botón continuar con Wompi */
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
