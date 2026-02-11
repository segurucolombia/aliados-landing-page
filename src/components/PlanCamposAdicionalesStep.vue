<template>
  <div class="campos-adicionales-step-wrapper">
    <!-- Hero Header -->
    <section class="form-hero">
      <div class="hero-content">
        <div class="hero-title-section">
          <div class="title-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <div>
            <h2 class="hero-title">Información Adicional del Plan</h2>
            <p class="hero-subtitle">Complete los siguientes datos requeridos para este plan</p>
          </div>
        </div>
      </div>
    </section>

    <div class="campos-adicionales-container">
      <div class="campos-adicionales-content">
        <CamposAdicionales
          :campos-adicionales="camposAdicionales"
          @update:datos="handleDatosUpdate"
          @update:valid="handleValidUpdate"
        />
      </div>

      <!-- Botones de Acción -->
      <div class="form-actions">
        <Button
          label="Atrás"
          icon="pi pi-arrow-left"
          class="p-button-secondary"
          @click="$emit('back')"
          type="button"
        />
        <Button
          label="Cancelar"
          icon="pi pi-times"
          class="p-button-danger p-button-outlined"
          @click="$emit('cancel')"
          type="button"
        />
        <Button
          label="Continuar"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="p-button-primary"
          @click="handleContinue"
          :disabled="!isValid"
          type="button"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue';
import Button from 'primevue/button';
import type { CamposAdicionalesConfig, CamposAdicionalesCapturados } from '../types/planes';

const CamposAdicionales = defineAsyncComponent(() => import('./register/components/CamposAdicionales.vue'));

const props = defineProps<{
  camposAdicionales?: CamposAdicionalesConfig;
}>();

const emit = defineEmits<{
  (e: 'next', datos: CamposAdicionalesCapturados): void;
  (e: 'back'): void;
  (e: 'cancel'): void;
}>();

const datosCapturados = ref<CamposAdicionalesCapturados | null>(null);
const isValid = ref(false);

const handleDatosUpdate = (datos: CamposAdicionalesCapturados) => {
  datosCapturados.value = datos;
};

const handleValidUpdate = (valid: boolean) => {
  isValid.value = valid;
};

const handleContinue = () => {
  if (isValid.value && datosCapturados.value) {
    emit('next', datosCapturados.value);
  }
};
</script>

<style scoped>
.campos-adicionales-step-wrapper {
  min-height: 100vh;
  background: #f9fafb;
}

/* Hero Section */
.form-hero {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title-icon svg {
  width: 32px;
  height: 32px;
}

.hero-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1rem;
  margin: 0.5rem 0 0 0;
  opacity: 0.95;
}

.campos-adicionales-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.campos-adicionales-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

/* Botones de acción */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .campos-adicionales-container {
    padding: 1rem;
  }

  .campos-adicionales-content {
    padding: 1.5rem;
  }

  .form-hero {
    padding: 1.5rem 1rem;
  }

  .hero-title {
    font-size: 1.5rem;
  }

  .hero-subtitle {
    font-size: 0.875rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
