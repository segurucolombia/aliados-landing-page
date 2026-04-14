<template>
  <div class="card-step-wrapper">
    <!-- Hero -->
    <section class="card-hero">
      <div class="hero-content">
        <div class="hero-title-section">
          <div class="title-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <div>
            <h2 class="hero-title">Vincula tu tarjeta</h2>
            <p class="hero-subtitle">Tu póliza se renovará automáticamente cada período · Procesado por Mercado Pago</p>
          </div>
        </div>
      </div>
    </section>

    <div class="card-form-container">
      <!-- Banner de seguridad -->
      <div class="mp-info-banner">
        <div class="mp-info-icon">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <div class="mp-info-text">
          <p class="mp-info-title">Pago 100% seguro con Mercado Pago</p>
          <p class="mp-info-desc">Seguru nunca almacena los datos de tu tarjeta. Tu información viaja encriptada con SSL de 256 bits directamente a Mercado Pago.</p>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="card-form" novalidate>
        <!-- Número de tarjeta -->
        <div class="field field-full">
          <label for="mp-cardNumber">Número de tarjeta <span class="required">*</span></label>
          <div class="card-number-wrapper">
            <input
              id="mp-cardNumber"
              v-model="cardNumber"
              @input="formatCardNumber"
              placeholder="0000 0000 0000 0000"
              maxlength="19"
              inputmode="numeric"
              autocomplete="cc-number"
              :class="{ 'input-error': errors.cardNumber }"
            />
            <div class="card-icons">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none">
                <rect width="32" height="20" rx="3" fill="#1A1F71"/>
                <rect x="0" y="7" width="32" height="6" fill="#F7B600"/>
              </svg>
            </div>
          </div>
          <small v-if="errors.cardNumber" class="field-error">{{ errors.cardNumber }}</small>
        </div>

        <!-- Nombre en la tarjeta -->
        <div class="field field-full">
          <label for="mp-cardholderName">Nombre del titular (como aparece en la tarjeta) <span class="required">*</span></label>
          <input
            id="mp-cardholderName"
            v-model="cardholderName"
            @input="cardholderName = cardholderName.toUpperCase().replace(/[^A-Z\s]/g, '')"
            placeholder="NOMBRE APELLIDO"
            autocomplete="cc-name"
            :class="{ 'input-error': errors.cardholderName }"
          />
          <small v-if="errors.cardholderName" class="field-error">{{ errors.cardholderName }}</small>
        </div>

        <!-- Vencimiento + CVV -->
        <div class="field-row">
          <div class="field">
            <label for="mp-expiry">Vencimiento <span class="required">*</span></label>
            <input
              id="mp-expiry"
              v-model="expiry"
              @input="formatExpiry"
              @keydown="handleExpiryKeydown"
              placeholder="MM/AA"
              maxlength="5"
              inputmode="numeric"
              autocomplete="cc-exp"
              :class="{ 'input-error': errors.expiry }"
            />
            <small v-if="errors.expiry" class="field-error">{{ errors.expiry }}</small>
          </div>
          <div class="field">
            <label for="mp-cvv">
              CVV <span class="required">*</span>
              <span class="cvv-hint">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                3 o 4 dígitos al respaldo
              </span>
            </label>
            <input
              id="mp-cvv"
              v-model="cvv"
              @input="cvv = cvv.replace(/\D/g, '').slice(0, 4)"
              placeholder="•••"
              maxlength="4"
              type="password"
              inputmode="numeric"
              autocomplete="cc-csc"
              :class="{ 'input-error': errors.cvv }"
            />
            <small v-if="errors.cvv" class="field-error">{{ errors.cvv }}</small>
          </div>
        </div>

        <!-- Documento del titular -->
        <div class="field-row">
          <div class="field">
            <label for="mp-docType">Tipo de documento <span class="required">*</span></label>
            <select
              id="mp-docType"
              v-model="docType"
              :class="{ 'input-error': errors.docType }"
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
              <option value="PP">Pasaporte</option>
            </select>
            <small v-if="errors.docType" class="field-error">{{ errors.docType }}</small>
          </div>
          <div class="field">
            <label for="mp-docNumber">Número de documento <span class="required">*</span></label>
            <input
              id="mp-docNumber"
              v-model="docNumber"
              @input="docNumber = docNumber.replace(/\D/g, '')"
              placeholder="Ej: 1234567890"
              inputmode="numeric"
              :class="{ 'input-error': errors.docNumber }"
            />
            <small v-if="errors.docNumber" class="field-error">{{ errors.docNumber }}</small>
          </div>
        </div>

        <!-- Error general de tokenización -->
        <div v-if="generalError" class="error-banner">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 20 20" style="flex-shrink:0">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
          </svg>
          {{ generalError }}
        </div>

        <!-- Acciones -->
        <div class="form-actions">
          <button type="button" @click="$emit('back')" class="btn btn-secondary" :disabled="tokenizing">
            Atrás
          </button>
          <button type="submit" class="btn btn-primary" :disabled="tokenizing">
            <svg v-if="tokenizing" class="spinner-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            {{ tokenizing ? 'Procesando...' : 'Activar débito automático' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { loadMercadoPago } from '@mercadopago/sdk-js';

declare global {
  interface Window {
    MercadoPago: new (publicKey: string, options?: { locale: string }) => {
      createCardToken: (data: Record<string, string>) => Promise<{ id: string }>;
    };
  }
}

const props = defineProps<{
  initialDocType?: string;
  initialDocNumber?: string;
}>();

const emit = defineEmits<{
  (e: 'card-tokenized', tokenId: string): void;
  (e: 'back'): void;
  (e: 'cancel'): void;
}>();

const cardNumber = ref('');
const cardholderName = ref('');
const expiry = ref('');
const cvv = ref('');
const docType = ref('CC');
const docNumber = ref('');
const tokenizing = ref(false);
const generalError = ref('');

const errors = ref({
  cardNumber: '',
  cardholderName: '',
  expiry: '',
  cvv: '',
  docType: '',
  docNumber: '',
});

onMounted(() => {
  if (props.initialDocType && ['CC', 'CE', 'NIT', 'PP'].includes(props.initialDocType)) {
    docType.value = props.initialDocType;
  }
  if (props.initialDocNumber) {
    docNumber.value = props.initialDocNumber;
  }
});

const formatCardNumber = () => {
  const digits = cardNumber.value.replace(/\D/g, '').slice(0, 16);
  cardNumber.value = digits.replace(/(.{4})/g, '$1 ').trim();
};

const formatExpiry = () => {
  const raw = expiry.value.replace(/\D/g, '').slice(0, 4);
  if (raw.length >= 3) {
    expiry.value = raw.slice(0, 2) + '/' + raw.slice(2);
  } else {
    expiry.value = raw;
  }
};

const handleExpiryKeydown = (e: KeyboardEvent) => {
  // Auto-slash after MM
  if (e.key !== 'Backspace' && expiry.value.replace(/\D/g, '').length === 2 && !expiry.value.includes('/')) {
    expiry.value = expiry.value + '/';
  }
};

const validate = (): boolean => {
  errors.value = { cardNumber: '', cardholderName: '', expiry: '', cvv: '', docType: '', docNumber: '' };
  let valid = true;

  const rawCard = cardNumber.value.replace(/\s/g, '');
  if (rawCard.length < 13 || rawCard.length > 19 || !/^\d+$/.test(rawCard)) {
    errors.value.cardNumber = 'Número de tarjeta inválido';
    valid = false;
  }

  if (!cardholderName.value.trim() || cardholderName.value.trim().length < 3) {
    errors.value.cardholderName = 'Ingresa el nombre tal como aparece en tu tarjeta';
    valid = false;
  }

  const parts = expiry.value.split('/');
  const month = parseInt(parts[0] || '0', 10);
  if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2 || month < 1 || month > 12) {
    errors.value.expiry = 'Formato inválido (MM/AA)';
    valid = false;
  }

  if (cvv.value.length < 3) {
    errors.value.cvv = 'CVV inválido';
    valid = false;
  }

  if (!docNumber.value || docNumber.value.length < 5) {
    errors.value.docNumber = 'Número de documento inválido';
    valid = false;
  }

  return valid;
};

const handleSubmit = async () => {
  if (!validate()) return;

  tokenizing.value = true;
  generalError.value = '';

  try {
    await loadMercadoPago();

    const mp = new window.MercadoPago(import.meta.env.PUBLIC_MP_PUBLIC_KEY, { locale: 'es-CO' });

    const parts = expiry.value.split('/');

    const cardToken = await mp.createCardToken({
      cardNumber: cardNumber.value.replace(/\s/g, ''),
      cardholderName: cardholderName.value.trim(),
      cardExpirationMonth: parts[0],
      cardExpirationYear: parts[1],
      securityCode: cvv.value,
      identificationType: docType.value,
      identificationNumber: docNumber.value.trim(),
    });

    if (!cardToken?.id) {
      throw new Error('No se pudo generar el token de la tarjeta');
    }

    emit('card-tokenized', cardToken.id);
  } catch (err: any) {
    console.error('Error tokenizando tarjeta MP:', err);
    const msg = err?.message || '';
    if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('card')) {
      generalError.value = 'Los datos de la tarjeta no son válidos. Verifica el número, la fecha de vencimiento y el CVV.';
    } else {
      generalError.value = 'Ocurrió un error al procesar los datos. Por favor intenta de nuevo.';
    }
  } finally {
    tokenizing.value = false;
  }
};
</script>

<style scoped>
.card-step-wrapper {
  min-height: 100vh;
  background: #f9fafb;
}

/* Hero */
.card-hero {
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
  font-size: 0.95rem;
  margin: 0.4rem 0 0;
  opacity: 0.9;
}

/* Container */
.card-form-container {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 1.5rem 3rem;
}

/* MP Banner */
.mp-info-banner {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}

.mp-info-icon {
  color: #2563eb;
  flex-shrink: 0;
  margin-top: 1px;
}

.mp-info-text {
  flex: 1;
}

.mp-info-title {
  font-weight: 700;
  color: #1e3a8a;
  font-size: 0.9rem;
  margin: 0 0 0.25rem;
}

.mp-info-desc {
  font-size: 0.8rem;
  color: #3b82f6;
  margin: 0;
  line-height: 1.5;
}

/* Form */
.card-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field-full {
  width: 100%;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.required {
  color: #dc2626;
}

.cvv-hint {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.75rem;
  font-weight: 400;
  color: #9ca3af;
  margin-left: 0.25rem;
}

.field input,
.field select {
  padding: 0.65rem 0.9rem;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #1f2937;
  background: white;
  transition: border-color 0.15s, box-shadow 0.15s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
}

.field input:focus,
.field select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.field input.input-error,
.field select.input-error {
  border-color: #dc2626;
}

.field-error {
  color: #dc2626;
  font-size: 0.78rem;
}

.card-number-wrapper {
  position: relative;
}

.card-number-wrapper input {
  padding-right: 3.5rem;
  letter-spacing: 0.05em;
  font-size: 1rem;
}

.card-icons {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  pointer-events: none;
  opacity: 0.5;
}

/* Error banner */
.error-banner {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  font-size: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 8px;
  line-height: 1.5;
}

/* Actions */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 0.5rem;
  border-top: 1px solid #e5e7eb;
  margin-top: 0.25rem;
}

.btn {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner-icon {
  animation: spin 0.8s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .card-form-container {
    padding: 0 1rem 2rem;
  }

  .card-form {
    padding: 1.25rem;
  }

  .field-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
