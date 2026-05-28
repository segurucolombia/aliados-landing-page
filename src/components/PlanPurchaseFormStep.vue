<template>
  <div class="purchase-form-wrapper">
    <Toast />
    <!-- Hero Header -->
    <section class="form-hero">
      <div class="hero-content">
        <div class="hero-title-section">
          <div class="title-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="hero-title">Información del Titular</h2>
            <p class="hero-subtitle">Complete los siguientes datos para continuar con la compra</p>
          </div>
        </div>
      </div>
    </section>

    <div class="purchase-form-container">
      <form @submit.prevent="handleSubmit" class="purchase-form">
        <!-- Grid de dos columnas -->
        <div class="form-grid">
          <!-- Tipo de Documento -->
          <div class="field">
            <label for="documentType">Tipo de Documento <span class="required">*</span></label>
            <Dropdown
              id="documentType"
              v-model="formData.documentType"
              :options="DOCUMENT_TYPES"
              optionLabel="nombre"
              optionValue="tipo"
              placeholder="Seleccione un tipo"
              :class="{ 'p-invalid': errors.documentType }"
              @blur="validateField('documentType')"
            />
            <small v-if="errors.documentType" class="p-error">{{ errors.documentType }}</small>
          </div>

          <!-- Tipo de Documento Representante Legal (solo si es NIT) -->
          <div v-if="isNIT" class="field">
            <label for="legalRepDocumentType">Tipo de Documento Representante Legal <span class="required">*</span></label>
            <Dropdown
              id="legalRepDocumentType"
              v-model="formData.legalRepDocumentType"
              :options="LEGAL_REP_DOCUMENT_TYPES"
              optionLabel="nombre"
              optionValue="tipo"
              placeholder="Seleccione un tipo"
              :class="{ 'p-invalid': errors.legalRepDocumentType }"
              @blur="validateField('legalRepDocumentType')"
            />
            <small v-if="errors.legalRepDocumentType" class="p-error">{{ errors.legalRepDocumentType }}</small>
          </div>

          <!-- Número de Documento / Documento Representante Legal -->
          <div class="field">
            <label for="documentNumber">
              {{ isNIT ? 'Número Documento Representante Legal' : 'Número de Documento' }} <span class="required">*</span>
            </label>
            <InputText
              id="documentNumber"
              v-model="formData.documentNumber"
              :placeholder="isNIT ? 'Ej: 1234567890' : 'Ej: 1234567890'"
              :maxlength="20"
              :class="{ 'p-invalid': errors.documentNumber }"
              @blur="validateField('documentNumber')"
              @input="sanitizeDocumentNumber"
            />
            <small v-if="errors.documentNumber" class="p-error">{{ errors.documentNumber }}</small>
          </div>

          <!-- NIT (solo si tipo documento es NIT) -->
          <div v-if="isNIT" class="field">
            <label for="nit">NIT <span class="required">*</span></label>
            <InputText
              id="nit"
              v-model="formData.nit"
              placeholder="Ej: 900123456-1"
              :maxlength="15"
              :class="{ 'p-invalid': errors.nit }"
              @blur="validateField('nit')"
              @input="sanitizeNit"
            />
            <small v-if="errors.nit" class="p-error">{{ errors.nit }}</small>
          </div>

          <!-- Nombre de Empresa (solo si tipo documento es NIT) -->
          <div v-if="isNIT" class="field">
            <label for="companyName">Nombre de Empresa <span class="required">*</span></label>
            <InputText
              id="companyName"
              v-model="formData.companyName"
              placeholder="Ej: Mi Empresa S.A.S."
              :class="{ 'p-invalid': errors.companyName }"
              @blur="validateField('companyName')"
            />
            <small v-if="errors.companyName" class="p-error">{{ errors.companyName }}</small>
          </div>

          <!-- Nombres / Nombres Representante Legal -->
          <div class="field">
            <label for="fullName">
              {{ isNIT ? 'Nombres Representante Legal' : 'Nombres' }} <span class="required">*</span>
            </label>
            <InputText
              id="fullName"
              v-model="formData.fullName"
              placeholder="Ej: Juan Carlos"
              :class="{ 'p-invalid': errors.fullName }"
              @blur="validateField('fullName')"
            />
            <small v-if="errors.fullName" class="p-error">{{ errors.fullName }}</small>
          </div>

          <!-- Apellidos / Apellidos Representante Legal -->
          <div class="field">
            <label for="lastName">
              {{ isNIT ? 'Apellidos Representante Legal' : 'Apellidos' }} <span class="required">*</span>
            </label>
            <InputText
              id="lastName"
              v-model="formData.lastName"
              placeholder="Ej: Pérez García"
              :class="{ 'p-invalid': errors.lastName }"
              @blur="validateField('lastName')"
            />
            <small v-if="errors.lastName" class="p-error">{{ errors.lastName }}</small>
          </div>

          <!-- Email -->
          <div class="field">
            <label for="email">Correo Electrónico <span class="required">*</span></label>
            <InputText
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="ejemplo@correo.com"
              :class="{ 'p-invalid': errors.email }"
              @blur="validateField('email')"
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <!-- Teléfono -->
          <div class="field">
            <label for="phone">Teléfono <span class="required">*</span></label>
            <InputText
              id="phone"
              v-model="formData.phone"
              type="tel"
              placeholder="Ej: 3001234567"
              :maxlength="10"
              :class="{ 'p-invalid': errors.phone }"
              @blur="validateField('phone')"
            />
            <small v-if="errors.phone" class="p-error">{{ errors.phone }}</small>
          </div>

          <!-- Fecha de Nacimiento -->
          <div class="field">
            <label for="dob">Fecha de Nacimiento</label>
            <input
              id="dob"
              v-model="formData.dob"
              type="date"
              class="p-inputtext p-component"
              :class="{ 'p-invalid': errors.dob }"
              @blur="validateField('dob')"
            />
            <small v-if="errors.dob" class="p-error">{{ errors.dob }}</small>
          </div>

        </div>

        <!-- Código de Descuento (solo si no hay débito automático disponible) -->
        <div v-if="valorDebitoAutomatico == null" class="discount-section">
          <div class="discount-card">
            <div class="discount-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185ZM9.75 9h.008v.008H9.75V9Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008V13.5Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>

            </div>
            <div class="discount-content">
              <label for="discountCode">¿Tienes un código de descuento?</label>

              <!-- Mensaje de felicitación si hay cupón -->
              <div v-if="cuponValor > 0" class="cupon-mensaje">
                <p class="text-green-700 font-semibold">
                  ¡Felicidades! Tienes un cupón de descuento por {{ formatCurrency(cuponValor) }}
                </p>
              </div>

              <div v-else class="discount-input-wrapper">
                <InputText
                  id="discountCode"
                  v-model="formData.discountCode"
                  placeholder="Ingresa tu código aquí"
                  class="discount-input"
                />
                <Button
                  v-if="formData.discountCode"
                  label="Aplicar"
                  icon="pi pi-check"
                  class="p-button-success"
                  @click="applyDiscount"
                  type="button"
                  :loading="isLoadingCupon"
                  :disabled="isLoadingCupon"
                />
              </div>
            </div>
          </div>

          <!-- Resumen de precios -->
          <div v-if="cuponValor > 0" class="price-summary">
            <div class="price-row">
              <span>Precio del plan:</span>
              <span>{{ formatCurrency(planPrecio) }}</span>
            </div>
            <div class="price-row discount-row">
              <span>Descuento:</span>
              <span>- {{ formatCurrency(cuponValor) }}</span>
            </div>
            <div class="price-row total-row">
              <span class="total-label">Total a pagar:</span>
              <span class="total-value">{{ formatCurrency(totalAPagar) }}</span>
            </div>
          </div>
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
            @click="handleCancel"
            type="button"
          />
          <Button
            :label="hasNextStep ? 'Continuar' : 'Comprar'"
            :icon="hasNextStep ? 'pi pi-arrow-right' : 'pi pi-shopping-cart'"
            class="p-button-primary"
            type="submit"
            :disabled="!isFormValid"
          />
        </div>
      </form>
    </div>

    <!-- Modal de selección de método de pago -->
    <div v-if="showPaymentModal" class="payment-modal-overlay" @click.self="showPaymentModal = false">
      <div class="payment-modal">
        <h3 class="payment-modal-title">¿Cómo deseas pagar?</h3>
        <p class="payment-modal-subtitle">Elige cómo quieres gestionar la renovación de tu seguro</p>

        <div class="payment-options">
          <!-- Débito automático -->
          <button class="payment-option payment-option-recommended" @click="handleSelectDebitoAutomatico">
            <div class="payment-option-badge">Recomendado</div>
            <div class="payment-option-top">
              <div class="payment-option-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="26" height="26">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div class="payment-option-info">
                <span class="payment-option-label">Débito automático</span>
                <span class="payment-option-price">{{ formatCurrency(valorDebitoAutomatico!) }} <span class="payment-option-period">/ {{ vigenciaLabel }}</span></span>
              </div>
              <div class="payment-option-saving">
                Ahorra {{ formatCurrency(planPrecio - valorDebitoAutomatico!) }}
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
          </button>

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
                  {{ formatCurrency(cuponValor > 0 ? totalAPagar : planPrecio) }}
                  <span class="payment-option-period">/ {{ vigenciaLabel }}</span>
                  <span v-if="cuponValor > 0" class="cupon-applied-badge">Cupón aplicado</span>
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
              <div v-if="cuponValor > 0" class="modal-cupon-aplicado">
                <svg width="16" height="16" fill="#16a34a" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                Cupón aplicado: <strong>-{{ formatCurrency(cuponValor) }}</strong>
                <button type="button" class="cupon-quitar" @click.stop="clearCupon">Quitar</button>
              </div>
              <div v-else class="modal-cupon-input">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="m9 14.25 6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z"/></svg>
                <input
                  v-model="formData.discountCode"
                  placeholder="¿Tienes un cupón?"
                  class="modal-cupon-field"
                  @keydown.enter.prevent="applyDiscount"
                />
                <button
                  v-if="formData.discountCode"
                  type="button"
                  class="modal-cupon-btn"
                  @click.stop="applyDiscount"
                  :disabled="isLoadingCupon"
                >
                  {{ isLoadingCupon ? '...' : 'Aplicar' }}
                </button>
              </div>
            </div>

            <!-- Botón continuar con Wompi -->
            <button type="button" class="wompi-continue-btn" @click="handleSelectPagoUnico">
              Pagar con Wompi
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
          </div>
        </div>

        <button class="payment-modal-close" @click="showPaymentModal = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { DOCUMENT_TYPES } from '../utils/documentTypes';
import { formatVigencia } from '../utils/vigencia';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import { CuponesService } from '../services/cupones.service';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

// Tipos de documento para representante legal (sin NIT)
const LEGAL_REP_DOCUMENT_TYPES = DOCUMENT_TYPES.filter(doc => doc.tipo !== 'NIT');

export interface PurchaseFormData {
  documentType: string;
  documentNumber: string;
  fullName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  password: string;
  nit?: string;
  companyName?: string;
  legalRepDocumentType?: string;
  discountCode?: string;
}

const props = withDefaults(defineProps<{
  planPrecio: number;
  versionId: string;
  valorDebitoAutomatico?: number | null;
  vigenciaNumeroMeses?: number | null;
  hasNextStep?: boolean;
}>(), {
  hasNextStep: false,
  valorDebitoAutomatico: null,
  vigenciaNumeroMeses: null
});

const vigenciaLabel = computed(() => formatVigencia(props.vigenciaNumeroMeses) || 'renovación');

const emit = defineEmits<{
  (e: 'submit', data: PurchaseFormData): void;
  (e: 'submit-debito', data: PurchaseFormData): void;
  (e: 'back'): void;
  (e: 'cancel'): void;
}>();

const showPaymentModal = ref(false);

// Estado del cupón
const cuponValor = ref(0);
const toast = useToast();
const isLoadingCupon = ref(false);

const formData = reactive<PurchaseFormData>({
  documentType: '',
  documentNumber: '',
  fullName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  password: '',
  nit: '',
  companyName: '',
  legalRepDocumentType: '',
  discountCode: '',
});

const errors = reactive<Record<string, string>>({
  documentType: '',
  documentNumber: '',
  fullName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  nit: '',
  companyName: '',
  legalRepDocumentType: '',
});

const isNIT = computed(() => formData.documentType === 'NIT');

const sanitizeDocumentNumber = () => {
  // Remover espacios y caracteres especiales, permitir solo letras y números
  formData.documentNumber = formData.documentNumber.replace(/[^a-zA-Z0-9]/g, '');
};

const sanitizeNit = () => {
  // Remover espacios, permitir solo números y guión
  if (formData.nit) {
    formData.nit = formData.nit.replace(/[^0-9-]/g, '');
  }
};

const validateField = (field: string) => {
  errors[field] = '';

  switch (field) {
    case 'documentType':
      if (!formData.documentType) {
        errors.documentType = 'El tipo de documento es requerido';
      }
      break;

    case 'documentNumber':
      if (!formData.documentNumber) {
        errors.documentNumber = 'El número de documento es requerido';
      } else if (formData.documentNumber.length < 5) {
        errors.documentNumber = 'El número de documento debe tener al menos 5 caracteres';
      } else if (!/^[a-zA-Z0-9]+$/.test(formData.documentNumber)) {
        errors.documentNumber = 'El número de documento solo puede contener letras y números';
      }
      break;

    case 'fullName':
      if (!formData.fullName) {
        errors.fullName = 'El nombre es requerido';
      } else if (formData.fullName.trim().length < 2) {
        errors.fullName = 'El nombre debe tener al menos 2 caracteres';
      }
      break;

    case 'lastName':
      if (!formData.lastName) {
        errors.lastName = 'El apellido es requerido';
      } else if (formData.lastName.trim().length < 2) {
        errors.lastName = 'El apellido debe tener al menos 2 caracteres';
      }
      break;

    case 'nit':
      if (isNIT.value) {
        if (!formData.nit) {
          errors.nit = 'El NIT es requerido';
        } else if (formData.nit.length < 9) {
          errors.nit = 'El NIT debe tener al menos 9 caracteres';
        } else if (!/^[0-9-]+$/.test(formData.nit)) {
          errors.nit = 'El NIT solo puede contener números y guión';
        }
      }
      break;

    case 'companyName':
      if (isNIT.value) {
        if (!formData.companyName) {
          errors.companyName = 'El nombre de empresa es requerido';
        } else if (formData.companyName.trim().length < 3) {
          errors.companyName = 'El nombre de empresa debe tener al menos 3 caracteres';
        }
      }
      break;

    case 'legalRepDocumentType':
      if (isNIT.value) {
        if (!formData.legalRepDocumentType) {
          errors.legalRepDocumentType = 'El tipo de documento del representante legal es requerido';
        }
      }
      break;

    case 'email':
      if (!formData.email) {
        errors.email = 'El correo electrónico es requerido';
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          errors.email = 'El correo electrónico no es válido';
        }
      }
      break;

    case 'phone':
      if (!formData.phone) {
        errors.phone = 'El teléfono es requerido';
      } else if (formData.phone.length < 7) {
        errors.phone = 'El teléfono debe tener al menos 7 dígitos';
      } else if (formData.phone.length > 10) {
        errors.phone = 'El teléfono no debe exceder 10 dígitos';
      }
      break;

    case 'dob':
      if (formData.dob && formData.dob.length > 20) {
        errors.dob = 'La fecha de nacimiento no debe exceder 20 caracteres';
      }
      break;

  }
};

const validateAllFields = (): boolean => {
  let isValid = true;

  // Validar campos básicos siempre
  const fieldsToValidate = ['documentType', 'documentNumber', 'fullName', 'lastName', 'email', 'phone'];

  // Agregar validación de NIT y empresa si el tipo de documento es NIT
  if (isNIT.value) {
    fieldsToValidate.push('nit', 'companyName', 'legalRepDocumentType');
  }

  fieldsToValidate.forEach(field => {
    validateField(field);
    if (errors[field]) {
      isValid = false;
    }
  });

  return isValid;
};

const isFormValid = computed(() => {
  const basicFieldsValid =
    formData.documentType !== '' &&
    formData.documentNumber !== '' &&
    formData.fullName !== '' &&
    formData.lastName !== '' &&
    formData.email !== '' &&
    formData.phone !== '';

  const nitFieldsValid = !isNIT.value || (
    formData.nit !== '' &&
    formData.companyName !== '' &&
    formData.legalRepDocumentType !== ''
  );

  const noErrors = Object.values(errors).every(error => error === '');

  return basicFieldsValid && nitFieldsValid && noErrors;
});

const applyDiscount = async () => {
  // Validar que haya un código ingresado
  if (!formData.discountCode || formData.discountCode.trim() === '') {
    toast.add({
      severity: 'warn',
      summary: 'Código requerido',
      detail: 'Por favor ingrese un código de descuento',
      life: 3000
    });
    return;
  }

  try {
    isLoadingCupon.value = true;

    const result = await CuponesService.find(formData.discountCode.trim(), props.versionId);

    if (!result) {
      toast.add({
        severity: 'error',
        summary: 'Cupón no válido',
        detail: 'El código de descuento ingresado no existe',
        life: 3000
      });
      cuponValor.value = 0;
      return;
    }

    const { cupon, aplica } = result;

    if (!aplica) {
      toast.add({
        severity: 'error',
        summary: 'Cupón no aplicable',
        detail: 'El cupón no aplica para este plan',
        life: 3000
      });
      cuponValor.value = 0;
      return;
    }

    if (!cupon.estado) {
      toast.add({
        severity: 'error',
        summary: 'Cupón inactivo',
        detail: 'El código de descuento no está activo',
        life: 3000
      });
      cuponValor.value = 0;
      return;
    }

    cuponValor.value = cupon.valor;

    toast.add({
      severity: 'success',
      summary: '¡Descuento aplicado!',
      detail: `Se ha aplicado un descuento de ${formatCurrency(cupon.valor)}`,
      life: 4000
    });

    localStorage.setItem('cupon_valor', cupon.valor.toString());

  } catch (error) {
    console.error('Error al aplicar el descuento:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Ocurrió un error al validar el cupón. Intente nuevamente.',
      life: 3000
    });
    cuponValor.value = 0;
  } finally {
    isLoadingCupon.value = false;
  }
};

// Calcular total a pagar
const totalAPagar = computed(() => {
  return Math.max(0, props.planPrecio - cuponValor.value);
});

// Formatear moneda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Cargar cupón del localStorage al montar (solo si no hay débito automático disponible)
onMounted(() => {
  if (props.valorDebitoAutomatico == null) {
    const cuponValorStr = localStorage.getItem('cupon_valor');
    if (cuponValorStr) {
      cuponValor.value = parseFloat(cuponValorStr) || 0;
    }
  }
});

const handleSubmit = () => {
  if (validateAllFields()) {
    formData.password = formData.documentNumber;
    if (props.valorDebitoAutomatico != null) {
      showPaymentModal.value = true;
    } else {
      emit('submit', { ...formData });
    }
  }
};

const handleSelectPagoUnico = () => {
  showPaymentModal.value = false;
  emit('submit', { ...formData });
};

const handleSelectDebitoAutomatico = () => {
  showPaymentModal.value = false;
  emit('submit-debito', { ...formData });
};

const clearCupon = () => {
  cuponValor.value = 0;
  if (formData.discountCode !== undefined) formData.discountCode = '';
  localStorage.removeItem('cupon_valor');
};

const handleCancel = () => {
  if (confirm('¿Estás seguro de que deseas cancelar la compra?')) {
    emit('cancel');
  }
};
</script>

<style scoped>
.purchase-form-wrapper {
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

.purchase-form-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.purchase-form {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

/* Grid de dos columnas */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
}

/* Sección de código de descuento */
.discount-section {
  margin-bottom: 2rem;
}

.discount-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 2px solid #86efac;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.discount-icon {
  width: 48px;
  height: 48px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.discount-icon svg {
  width: 24px;
  height: 24px;
}

.discount-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.discount-content label {
  font-weight: 600;
  color: #166534;
  font-size: 1rem;
}

.discount-input-wrapper {
  display: flex;
  gap: 0.75rem;
}

.discount-input {
  flex: 1;
}

.cupon-mensaje {
  margin-top: 0.5rem;
}

/* Resumen de precios */
.price-summary {
  margin-top: 1.5rem;
  background: white;
  border: 2px solid #86efac;
  border-radius: 8px;
  padding: 1.25rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  color: #374151;
}

.price-row:not(:last-child) {
  border-bottom: 1px solid #e5e7eb;
}

.discount-row {
  color: #16a34a;
  font-weight: 600;
}

.total-row {
  padding-top: 1rem;
  margin-top: 0.5rem;
  border-top: 2px solid #22c55e !important;
}

.total-label {
  font-size: 1.125rem;
  font-weight: 700;
  color: #166534;
}

.total-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #166534;
}

/* Botones de acción */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .purchase-form-container {
    padding: 1rem;
  }

  .purchase-form {
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

  .discount-card {
    flex-direction: column;
    padding: 1rem;
  }

  .discount-input-wrapper {
    flex-direction: column;
  }
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
</style>
