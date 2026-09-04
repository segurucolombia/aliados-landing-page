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
        <!-- Datos del titular: los pide la versión del plan, no la landing -->
        <CamposTitular
          v-if="camposTitular.length > 0"
          ref="formularioTitular"
          :campos="camposTitular"
          :rechazos="rechazosDeCampos"
          v-model="titular"
          @update:valid="titularValido = $event"
        />

        <div v-else class="sin-campos">
          Este plan todavía no tiene configurados los datos del titular. Comunícate con
          nosotros para completar tu compra.
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
              <div v-if="cuponValidado" class="cupon-mensaje">
                <p class="text-green-700 font-semibold">
                  ¡Felicidades! Tienes un cupón de descuento por {{ formatCurrency(valorDescuento) }}
                </p>
                <Button
                  label="Quitar"
                  icon="pi pi-times"
                  class="p-button-text p-button-sm"
                  @click="quitarCupon"
                  type="button"
                />
              </div>

              <template v-else>
                <div class="discount-input-wrapper">
                  <InputText
                    id="discountCode"
                    v-model="codigoIngresado"
                    placeholder="Ingresa tu código aquí"
                    class="discount-input"
                    :class="{ 'p-invalid': errorCupon }"
                    @keydown.enter.prevent="handleAplicarCupon"
                  />
                  <Button
                    label="Aplicar"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="handleAplicarCupon"
                    type="button"
                    :loading="validandoCupon"
                    :disabled="!puedeAplicar"
                  />
                </div>
                <small v-if="errorCupon" class="p-error">{{ errorCupon }}</small>
              </template>
            </div>
          </div>

          <!-- Sin cotización todavía no hay ningún total que mostrar: lo dice el backend -->
          <p v-if="cuponValidado && !cotizacion && hasNextStep" class="price-note">
            El valor final se calcula con la información del siguiente paso.
          </p>
        </div>

        <!--
          Detalle de la compra. Los datos del titular también pueden agregar cargos o
          impedir la venta, así que el desglose y los motivos de rechazo se muestran
          acá, con los valores que devolvió la última cotización.
        -->
        <div v-if="mostrarDesglose" class="desglose-wrapper">
          <DesgloseCotizacion
            :cotizacion="cotizacionVisible"
            :plan-nombre="planNombre"
            :cotizando="cotizando"
            :rechazos="rechazos"
            :mensaje-rechazo="mensajeRechazo"
            :error-cotizacion="errorCotizacion"
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import CamposTitular from './CamposTitular.vue';
import DesgloseCotizacion from './DesgloseCotizacion.vue';
import useCupon from '../composables/cupon';
import type { CampoTitular, DatosTitular } from '../types/planes';
import type { CotizacionVenta, RechazoVenta } from '../types/cotizacion';
import { claveDeAccesoTitular } from '../utils/titularVenta';

/**
 * Datos del titular capturados en este paso. El titular va indexado por la `clave`
 * del campo y viaja junto a la configuración con la que se armó: la traducción al
 * payload de venta la hace `adaptarTitularAPayloadVenta`.
 */
export interface DatosTitularFormulario {
  titular: DatosTitular;
  campos: CampoTitular[];
  /** Contraseña con la que el cliente entra después de comprar */
  clave: string;
  discountCode?: string;
}

const props = withDefaults(defineProps<{
  planId: string;
  /** Qué datos le pide al titular la versión del plan que se está comprando */
  camposTitular?: CampoTitular[];
  planNombre?: string;
  /** Cotización vigente del backend: es la única fuente del total */
  cotizacion?: CotizacionVenta | null;
  cotizando?: boolean;
  /** Todos los motivos por los que no se puede vender: se le muestran al cliente */
  rechazos?: RechazoVenta[];
  /** Los que caen en campos del titular: son los que se marcan en este formulario */
  rechazosDeCampos?: RechazoVenta[];
  mensajeRechazo?: string;
  errorCotizacion?: string;
  /** El backend cotizó sin rechazos, o el total se termina de calcular más adelante */
  puedeContinuar?: boolean;
  valorDebitoAutomatico?: number | null;
  hasNextStep?: boolean;
}>(), {
  camposTitular: () => [],
  planNombre: '',
  cotizacion: null,
  cotizando: false,
  rechazos: () => [],
  rechazosDeCampos: () => [],
  mensajeRechazo: '',
  errorCotizacion: '',
  puedeContinuar: true,
  hasNextStep: false,
  valorDebitoAutomatico: null,
});

const emit = defineEmits<{
  (e: 'submit', data: DatosTitularFormulario): void;
  /** Cada cambio del titular: el backend puede cobrar distinto por estos datos */
  (e: 'update:titular', titular: DatosTitular): void;
  (e: 'back'): void;
  (e: 'cancel'): void;
}>();

// Estado del cupón (compartido con el resumen de compra)
const {
  codigoIngresado,
  errorCupon,
  validandoCupon,
  valorDescuento,
  cuponValidado,
  puedeAplicar,
  aplicarCupon,
  quitarCupon,
  sincronizarConPlan,
  codigoParaVenta,
} = useCupon();

/** Respuestas del titular, indexadas por la `clave` de cada campo configurado */
const titular = ref<DatosTitular>({});
const titularValido = ref(false);
const formularioTitular = ref<InstanceType<typeof CamposTitular> | null>(null);

const isFormValid = computed(
  () => props.camposTitular.length > 0 && titularValido.value && props.puedeContinuar,
);

// Cada cambio del titular se avisa hacia arriba para volver a cotizar
watch(titular, () => emit('update:titular', { ...titular.value }), { deep: true });

/** Con débito automático los totales se comparan en el modal de medio de pago */
const cotizacionVisible = computed(() => (props.valorDebitoAutomatico == null ? props.cotizacion : null));

const mostrarDesglose = computed(
  () => props.rechazos.length > 0 || !!props.errorCotizacion || cotizacionVisible.value !== null,
);

// Valida el cupón contra el plan que se está comprando
const handleAplicarCupon = () => aplicarCupon(props.planId);

// Formatear moneda
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// El cupón puede venir aplicado desde antes (otro paso u otro plan):
// se revalida contra el plan actual antes de mantenerlo
onMounted(() => {
  if (props.valorDebitoAutomatico == null) {
    sincronizarConPlan(props.planId);
  }
});

const handleSubmit = () => {
  if (props.camposTitular.length === 0) return;
  if (!formularioTitular.value?.validarTodo()) return;

  emit('submit', {
    titular: { ...titular.value },
    campos: props.camposTitular,
    // La landing no pide contraseña: se deriva de los datos del titular
    clave: claveDeAccesoTitular(titular.value, props.camposTitular),
    // Solo viaja el código si el cupón quedó validado contra este plan
    discountCode: codigoParaVenta(props.planId),
  });
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

/* Formulario del titular (los campos los pinta CamposTitular) */
.campos-titular {
  margin-bottom: 2rem;
}

.sin-campos {
  background: #fef3c7;
  border: 1px solid #fcd34d;
  color: #92400e;
  border-radius: 8px;
  padding: 1rem;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.price-note {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0.5rem 0 0 0;
}

/* Detalle de la compra */
.desglose-wrapper {
  margin-bottom: 2rem;
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
