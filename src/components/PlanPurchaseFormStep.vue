<template>
  <div class="purchase-form-wrapper">
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

          <!-- Clave/Contraseña -->
          <div class="field">
            <label for="password">Contraseña <span class="required">*</span></label>
            <Password
              id="password"
              v-model="formData.password"
              placeholder="Ingrese su contraseña"
              :toggleMask="true"
              :class="{ 'p-invalid': errors.password }"
              @blur="validateField('password')"
              :feedback="false"
              input-class="w-full"
            />
            <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="field">
            <label for="confirmPassword">Confirmar Contraseña <span class="required">*</span></label>
            <Password
              id="confirmPassword"
              input-class="w-full"
              v-model="formData.confirmPassword"
              placeholder="Confirme su contraseña"
              :toggleMask="true"
              :class="{ 'p-invalid': errors.confirmPassword }"
              @blur="validateField('confirmPassword')"
              :feedback="false"
              class="w-full"
            />
            <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
          </div>
        </div>

        <!-- Código de Descuento -->
        <div class="discount-section">
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
            label="Comprar"
            icon="pi pi-shopping-cart"
            class="p-button-primary"
            type="submit"
            :disabled="!isFormValid"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';
import { DOCUMENT_TYPES } from '../utils/documentTypes';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

// Tipos de documento para representante legal (sin NIT)
const LEGAL_REP_DOCUMENT_TYPES = DOCUMENT_TYPES.filter(doc => doc.tipo !== 'NIT');

export interface PurchaseFormData {
  documentType: string;
  documentNumber: string;
  fullName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  nit?: string;
  companyName?: string;
  legalRepDocumentType?: string;
  discountCode?: string;
}

const props = defineProps<{
  planPrecio: number;
}>();

const emit = defineEmits<{
  (e: 'submit', data: PurchaseFormData): void;
  (e: 'back'): void;
  (e: 'cancel'): void;
}>();

// Estado del cupón
const cuponValor = ref(0);

const formData = reactive<PurchaseFormData>({
  documentType: '',
  documentNumber: '',
  fullName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
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
  password: '',
  confirmPassword: '',
  nit: '',
  companyName: '',
  legalRepDocumentType: '',
});

const isNIT = computed(() => formData.documentType === 'NIT');

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

    case 'password':
      if (!formData.password) {
        errors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
        errors.password = 'La contraseña debe tener al menos 6 caracteres';
      }
      break;

    case 'confirmPassword':
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Debe confirmar la contraseña';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Las contraseñas no coinciden';
      }
      break;
  }
};

const validateAllFields = (): boolean => {
  let isValid = true;

  // Validar campos básicos siempre
  const fieldsToValidate = ['documentType', 'documentNumber', 'fullName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];

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
    formData.phone !== '' &&
    formData.password !== '' &&
    formData.confirmPassword !== '';

  const nitFieldsValid = !isNIT.value || (
    formData.nit !== '' &&
    formData.companyName !== '' &&
    formData.legalRepDocumentType !== ''
  );

  const noErrors = Object.values(errors).every(error => error === '');

  return basicFieldsValid && nitFieldsValid && noErrors;
});

const applyDiscount = () => {
  // Lógica para aplicar código de descuento
  console.log('Aplicando código de descuento:', formData.discountCode);
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

// Cargar cupón del localStorage al montar
onMounted(() => {
  const cuponValorStr = localStorage.getItem('cupon_valor');
  if (cuponValorStr) {
    cuponValor.value = parseFloat(cuponValorStr) || 0;
  }
});

const handleSubmit = () => {
  if (validateAllFields()) {
    emit('submit', { ...formData });
  }
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
</style>
