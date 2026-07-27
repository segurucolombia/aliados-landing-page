<template>
  <div class="purchase-wizard">
    <!-- Indicador de Pasos -->
    <div class="steps-indicator-wrapper">
      <div class="steps-indicator">
        <!-- <div class="step" :class="{ 'active': currentStep === 1, 'completed': currentStep > 1 }">
          <div class="step-circle">
            <span v-if="currentStep > 1" class="check-icon">✓</span>
            <span v-else>1</span>
          </div>
          <span class="step-label">Detalle del Plan</span>
        </div> -->

        <!-- <div class="step-divider" :class="{ 'completed': currentStep > 1 }"></div> -->

        <!-- <div class="step" :class="{ 'active': currentStep === 2, 'completed': currentStep > 2 }">
          <div class="step-circle">
            <span v-if="currentStep > 2" class="check-icon">✓</span>
            <span v-else>2</span>
          </div>
          <span class="step-label">Datos del Titular</span>
        </div> -->
      </div>
    </div>

    <!-- Contenido de los Pasos -->
    <div class="wizard-content">
      <!-- Paso 1: Detalle del Plan -->
      <div v-show="currentStep === 1" class="step-content">
        <PlanDetailStep
          :plan-id="planId"
          @next="goToStep(2)"
          @plan-loaded="handlePlanLoaded"
          @condiciones-aceptadas="handleCondicionesAceptadas"
          @cancel="handleCancel"
        />
      </div>

      <!-- Paso 2: Formulario de Compra (Información del Titular) -->
      <div v-show="currentStep === 2" class="step-content">
        <PlanPurchaseFormStep
          :plan-precio="planPrecio"
          :version-id="planData?.version?.id ?? ''"
          :valor-debito-automatico="planData?.version?.valor_debito_automatico ?? null"
          :has-next-step="hasCamposAdicionales || tieneModalDePago"
          @submit="handlePurchaseFormSubmit"
          @back="goToStep(1)"
          @cancel="handleCancel"
        />
      </div>

      <!-- Paso 3: Campos Adicionales (Condicional) -->
      <div v-if="hasCamposAdicionales" v-show="currentStep === 3" class="step-content">
        <PlanCamposAdicionalesStep
          v-if="planData?.version?.campos_adicionales"
          :campos-adicionales="planData.version.campos_adicionales"
          :plan-nombre="planData.producto.nombre"
          @next="handleCamposAdicionalesNext"
          @back="goToStep(2)"
          @cancel="handleCancel"
        />
      </div>

      <!-- Paso 4: tarjeta MP (solo si es débito automático) -->
      <div v-if="isDebitoAutomatico" v-show="currentStep === CARD_STEP" class="step-content">
        <MercadoPagoCardStep
          :initial-doc-type="purchaseFormData?.documentType"
          :initial-doc-number="purchaseFormData?.documentNumber"
          @card-tokenized="handleCardTokenized"
          @back="volverAlPago"
          @cancel="handleCancel"
        />
      </div>
    </div>

    <!-- Selección del medio de pago: último paso, sobre el contenido actual -->
    <PaymentMethodModal
      v-if="showPaymentModal && planData?.version?.valor_debito_automatico != null"
      :plan-precio="planPrecio"
      :version-id="planData?.version?.id ?? ''"
      :valor-debito-automatico="planData.version.valor_debito_automatico"
      :vigencia-numero-meses="planData?.version?.vigencia_numero_meses ?? null"
      @select-pago-unico="handleSelectPagoUnico"
      @select-debito="handleSelectDebito"
      @close="showPaymentModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import PlanDetailStep from './PlanDetailStep.vue';
import PlanPurchaseFormStep from './PlanPurchaseFormStep.vue';
import PlanCamposAdicionalesStep from './PlanCamposAdicionalesStep.vue';
import MercadoPagoCardStep from './MercadoPagoCardStep.vue';
import PaymentMethodModal from './PaymentMethodModal.vue';
import type { PurchaseFormData } from './PlanPurchaseFormStep.vue';
import type { PlanWithDetails, CamposAdicionalesCapturados } from '../types/planes';
import type { CondicionVentaInput } from '../services/ventas.service';

const props = defineProps<{
  planId: string;
  planPrecio: number;
}>();

const emit = defineEmits<{
  (e: 'purchase', data: { planId: string; formData: PurchaseFormData; camposAdicionales?: CamposAdicionalesCapturados; condiciones: CondicionVentaInput[] }): void;
  (e: 'purchase-debito', data: { planId: string; formData: PurchaseFormData; camposAdicionales?: CamposAdicionalesCapturados; condiciones: CondicionVentaInput[]; cardTokenId: string }): void;
  (e: 'cancel'): void;
}>();

const currentStep = ref(1);
const planData = ref<PlanWithDetails | null>(null);
const purchaseFormData = ref<PurchaseFormData | null>(null);
const camposAdicionalesDatos = ref<CamposAdicionalesCapturados | null>(null);
const condicionesDatos = ref<CondicionVentaInput[]>([]);
const isDebitoAutomatico = ref(false);
const cardTokenId = ref('');
const showPaymentModal = ref(false);

// Computed property to check if plan has campos_adicionales
const hasCamposAdicionales = computed(() => {
  return !!(planData.value?.version?.campos_adicionales?.secciones?.length);
});

// Solo hay selección de medio de pago cuando el plan ofrece débito automático
const tieneModalDePago = computed(() => planData.value?.version?.valor_debito_automatico != null);

// El formulario de tarjeta MP es siempre el último paso: va después de elegir el medio de pago
const CARD_STEP = 4;

const handleCondicionesAceptadas = (condiciones: CondicionVentaInput[]) => {
  condicionesDatos.value = condiciones;
};

const handlePlanLoaded = (plan: PlanWithDetails) => {
  planData.value = plan;
  console.log('Plan loaded in wizard:', plan);
  console.log('Has campos adicionales?', hasCamposAdicionales.value);
};

const goToStep = (step: number) => {
  currentStep.value = step;
  // Scroll to top cuando cambia de paso
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePurchaseFormSubmit = (formData: PurchaseFormData) => {
  purchaseFormData.value = formData;
  console.log('Purchase form data captured:', formData);

  // Primero los campos adicionales (si el plan los pide); el pago siempre va al final
  if (hasCamposAdicionales.value) {
    goToStep(3);
  } else {
    irAlPago();
  }
};

const handleCamposAdicionalesNext = (datos: CamposAdicionalesCapturados) => {
  camposAdicionalesDatos.value = datos;
  console.log('Campos adicionales captured:', datos);
  irAlPago();
};

// Último paso: si el plan tiene débito automático se elige el medio de pago,
// si no, se va directo a la pasarela
const irAlPago = () => {
  if (tieneModalDePago.value) {
    showPaymentModal.value = true;
  } else {
    finalizarCompra();
  }
};

const handleSelectPagoUnico = () => {
  showPaymentModal.value = false;
  finalizarCompra();
};

const handleSelectDebito = () => {
  showPaymentModal.value = false;
  isDebitoAutomatico.value = true;
  goToStep(CARD_STEP);
};

// Desde la tarjeta MP se vuelve a la selección del medio de pago
const volverAlPago = () => {
  goToStep(hasCamposAdicionales.value ? 3 : 2);
  showPaymentModal.value = true;
};

const finalizarCompra = () => {
  if (!purchaseFormData.value) {
    console.error('No purchase form data available');
    return;
  }

  // Send campos_adicionales as object (not string)
  const camposAdicionalesData = camposAdicionalesDatos.value && hasCamposAdicionales.value
    ? camposAdicionalesDatos.value
    : undefined;

  if (camposAdicionalesData) {
    console.log('Sending campos adicionales:', camposAdicionalesData);
  }

  emit('purchase', {
    planId: props.planId,
    formData: purchaseFormData.value,
    camposAdicionales: camposAdicionalesData,
    condiciones: condicionesDatos.value,
  });
};

const handleCardTokenized = (tokenId: string) => {
  cardTokenId.value = tokenId;
  finalizarCompraDebito();
};

const finalizarCompraDebito = () => {
  if (!purchaseFormData.value) return;

  const camposAdicionalesData = camposAdicionalesDatos.value && hasCamposAdicionales.value
    ? camposAdicionalesDatos.value
    : undefined;

  emit('purchase-debito', {
    planId: props.planId,
    formData: purchaseFormData.value,
    camposAdicionales: camposAdicionalesData,
    condiciones: condicionesDatos.value,
    cardTokenId: cardTokenId.value,
  });
};

const handleCancel = () => {
  if (confirm('¿Estás seguro de que deseas cancelar el proceso de compra?')) {
    emit('cancel');
  }
};
</script>

<style scoped>
.purchase-wizard {
  min-height: 100vh;
  background: #f9fafb;
}

.steps-indicator-wrapper {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 1.5rem 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.steps-indicator {
  max-width: 500px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  border: 2px solid #e5e7eb;
}

.step.active .step-circle {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.step.completed .step-circle {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.check-icon {
  font-size: 1.1rem;
}

.step-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-align: center;
  transition: color 0.3s ease;
}

.step.active .step-label {
  color: #3b82f6;
}

.step.completed .step-label {
  color: #10b981;
}

.step-divider {
  width: 80px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 0.75rem;
  position: relative;
  top: -10px;
  transition: background 0.3s ease;
}

.step-divider.completed {
  background: #10b981;
}

.wizard-content {
  position: relative;
  min-height: 500px;
}

.step-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .purchase-wizard {
    padding: 1rem 0.5rem;
  }

  .steps-indicator {
    padding: 1rem 0.5rem;
    margin-bottom: 2rem;
  }

  .step-circle {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .step-label {
    font-size: 0.75rem;
    max-width: 80px;
  }

  .step-divider {
    width: 50px;
    margin: 0 0.5rem;
    top: -10px;
  }

  .check-icon {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .step-divider {
    width: 30px;
  }

  .step-label {
    font-size: 0.7rem;
    max-width: 60px;
  }
}
</style>
