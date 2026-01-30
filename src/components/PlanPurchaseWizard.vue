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
          @cancel="handleCancel"
        />
      </div>

      <!-- Paso 2: Formulario de Compra -->
      <div v-show="currentStep === 2" class="step-content">
        <PlanPurchaseFormStep
          @submit="handlePurchase"
          @back="goToStep(1)"
          @cancel="handleCancel"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PlanDetailStep from './PlanDetailStep.vue';
import PlanPurchaseFormStep from './PlanPurchaseFormStep.vue';
import type { PurchaseFormData } from './PlanPurchaseFormStep.vue';

const props = defineProps<{
  planId: string;
}>();

const emit = defineEmits<{
  (e: 'purchase', data: { planId: string; formData: PurchaseFormData }): void;
  (e: 'cancel'): void;
}>();

const currentStep = ref(1);

const goToStep = (step: number) => {
  currentStep.value = step;
  // Scroll to top cuando cambia de paso
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handlePurchase = (formData: PurchaseFormData) => {
  emit('purchase', {
    planId: props.planId,
    formData,
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
