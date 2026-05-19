<template>
  <div class="plan-detail-wrapper">
    <!-- Hero Header - Proceso de Compra -->
    <section class="purchase-hero">
      <div class="hero-content">
        <nav class="breadcrumb">
          <span>Inicio</span>
          <span>/</span>
          <span>Productos</span>
          <span>/</span>
          <span v-if="plan">{{ plan.producto.nombre }}</span>
          <span>/</span>
          <span class="current">Proceso de Compra</span>
        </nav>

        <div class="hero-title-section">
          <div class="title-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <div>
            <h1 class="hero-title">Proceso de Compra del Plan</h1>
            <p v-if="plan" class="hero-subtitle">{{ plan.version?.nombre || 'Plan' }} - {{ plan.producto.nombre }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="plan-detail-container">
      <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando detalles del plan...</p>
    </div>

    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$emit('cancel')" class="btn btn-secondary">Volver</button>
    </div>

    <div v-else-if="plan" class="plan-detail-content">
      <!-- Encabezado del plan -->
      <div class="plan-header">
        <div class="plan-product-info">
          <h1 class="plan-title">{{ plan.producto.nombre }}</h1>
          <p class="plan-description">{{ plan.producto.descripcion }}</p>
        </div>
        <div v-if="plan.version" class="plan-price">
          <template v-if="plan.version.valor_debito_automatico != null">
            <div class="price-badge-saving">
              <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clip-rule="evenodd"/><path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z"/></svg>
              Ahorra ${{ formatPrice(plan.version.precio - plan.version.valor_debito_automatico) }} con débito automático
            </div>
            <div class="price-row-debito">
              <span class="price-label-debito">Con débito automático</span>
              <div class="price-main">
                <span class="price-amount">${{ formatPrice(plan.version.valor_debito_automatico) }}</span>
                <span class="price-period">/ {{ formatVigencia(plan.version.vigencia_numero_meses) }}</span>
              </div>
            </div>
            <div class="price-row-regular">
              <span class="price-label-regular">Otros medios de pago</span>
              <span class="price-alt-value">${{ formatPrice(plan.version.precio) }} / {{ formatVigencia(plan.version.vigencia_numero_meses) }}</span>
            </div>
          </template>
          <template v-else>
            <div class="price-main">
              <span class="price-amount">${{ formatPrice(plan.version.precio) }}</span>
              <span class="price-period">/ {{ formatVigencia(plan.version.vigencia_numero_meses) }}</span>
            </div>
          </template>
        </div>
      </div>

      <!-- Información de la versión -->
      <div v-if="plan.version" class="version-info">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Valor Asegurado</span>
            <span class="info-value">${{ formatPrice(plan.version.valor_asegurado) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Vigencia desde</span>
            <span class="info-value">{{ formatDate(plan.version.vigencia_inicio) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Vigencia del plan</span>
            <span class="info-value">{{ formatVigencia(plan.version.vigencia_numero_meses) }}</span>
          </div>
        </div>

        <div v-if="plan.version.descripcion" class="description-box">
          <p>{{ plan.version.descripcion }}</p>
        </div>

        <!-- Coberturas -->
        <div v-if="plan.version.coberturas && plan.version.coberturas.length > 0" class="coberturas-section">
          <h3 class="subsection-title">Coberturas Incluidas</h3>
          <div class="coberturas-list">
            <div v-for="cobertura in plan.version.coberturas" :key="cobertura.cobertura_id" class="cobertura-item">
              <svg class="check-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <div class="cobertura-content">
                <h4 class="cobertura-name">{{ cobertura.cobertura.nombre }}</h4>
                <p class="cobertura-value">{{ cobertura.valor }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Políticas de privacidad y condiciones -->
      <div class="privacy-section">
        <label v-if="plan.version?.documento" class="privacy-checkbox">
          <input
            type="checkbox"
            v-model="acceptedConditions"
            @change="handleCondicionChange(($event.target as HTMLInputElement).checked, 'El usuario acepta las condiciones de la versión del plan')"
          />
          <span class="checkbox-text conditions-text">
            He leído y acepto las
            <button type="button" @click.prevent="verDocumento" :disabled="loadingDocument" class="privacy-link-btn">
              {{ loadingDocument ? 'Cargando...' : 'condiciones del plan' }}
            </button>
          </span>
        </label>
        <label class="privacy-checkbox">
          <input
            type="checkbox"
            v-model="acceptedPrivacy"
            @change="$emit('update:acceptedPrivacy', acceptedPrivacy); handleCondicionChange(($event.target as HTMLInputElement).checked, 'El usuario acepta las políticas de privacidad y autoriza el uso de sus datos personales')"
          />
          <span class="checkbox-text">
            He leído y acepto las
            <a href="https://www.segurucolombia.com/politica-privacidad.html" target="_blank" class="privacy-link">
              políticas de privacidad
            </a>
            y autorizo el
            <button type="button" @click="showDataUsageModal = true" class="privacy-link-btn">
              uso de mis datos personales
            </button>
          </span>
        </label>
      </div>

    <!-- Modal de Uso de Datos Personales -->
    <div v-if="showDataUsageModal" class="modal-overlay" @click="showDataUsageModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Autorización de Uso de Datos Personales</h3>
          <button @click="showDataUsageModal = false" class="modal-close">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p>
            Autorizo expresamente a <strong>GRUPO IGO COLOMBIA SAS (NIT. 901.383.133-2)</strong> y
            <strong>AMÉRICA INSURANCE BROKER LTDA (NIT. 900.360.430-2)</strong>, operando bajo la marca
            comercial <strong>SEGURU</strong>, para:
          </p>
          <ul class="authorization-list">
            <li>Realizar la evaluación de la solicitud de seguro y el análisis del estado del riesgo.</li>
            <li>Validar y verificar mi identidad para la vinculación, así como el ofrecimiento y otorgamiento de productos y servicios.</li>
            <li>Dar cumplimiento a las obligaciones contraídas con el titular de información en relación al contrato de seguro que se celebre y a las obligaciones legales que se deriven o sean accesorias a este.</li>
            <li>Remitir a las autoridades competentes, incluyendo las fiscales y a los reguladores financieros, nacionales o extranjeros, la información relacionada con la titularidad de los productos y servicios contratados o que llegare a contratar, datos de contacto, movimientos y saldos, y toda aquella información que sea solicitada por normas nacionales o extranjeras.</li>
            <li>Prevención y/o detección del fraude o cualquier tipo de delito, lo que incluye consultar y/o verificar la información personal que se encuentre publicada en redes sociales y/o internet.</li>
            <li>Consultar, corroborar, obtener información personal adicional y actualizar datos personales con la información que reposa en las bases de datos administrados por operadores de la información, bases de datos públicas u otras bases externas, con el propósito de dar cumplimiento a las instrucciones impartidas por la Superintendencia Financiera sobre prevención del riesgo de lavado de activos, la financiación del terrorismo y la proliferación de armas de destrucción masiva.</li>
            <li>Consultar, solicitar, suministrar, reportar, procesar y divulgar información que se refiera al comportamiento crediticio, financiero, comercial y civil, a las Centrales de Información u operadores de información como DATACREDITO y CIFIN, con el objeto de evaluar la solicitud de seguro y el cumplimiento de las obligaciones financieras, comerciales y/o crediticias.</li>
            <li>Con fines de seguridad y/o de prueba ante una autoridad judicial o administrativa, cuando los datos sean obtenidos a través de grabaciones o suministrados por el Titular para el ingreso o permanencia en las instalaciones.</li>
            <li>Fines estadísticos, de consulta, gremiales y técnico-actuariales.</li>
            <li>Fines tributarios, incluido el envío de información a autoridades tributarias de otros países, tal como la de posibles sujetos de tributación en los Estados Unidos al Internal Revenue Service (IRS) y/o a la Dirección de Impuestos y Aduanas Nacionales de Colombia (DIAN), en los términos del Foreign Account Tax Compliance Act (FATCA) o las normas que lo modifiquen y las reglamentaciones aplicables.</li>
          </ul>
          <p class="authorization-footer">
            Con ocasión de lo anterior, autorizo a <strong>GRUPO IGO COLOMBIA SAS</strong> y
            <strong>AMÉRICA INSURANCE BROKER LTDA (SEGURU)</strong> para que compartan la información referida
            anteriormente, que consideren pertinente y/o necesaria con aseguradoras aliadas, intermediarios,
            reaseguradores, coaseguradores, operadores y prestadores de servicio y otros terceros con quienes
            tengan una relación contractual para la ejecución de las actividades descritas.
          </p>
        </div>
        <div class="modal-footer">
          <button @click="showDataUsageModal = false" class="btn btn-primary">
            Entendido
          </button>
        </div>
      </div>
    </div>

      <!-- Botones de acción -->
      <div class="action-buttons">
        <button @click="$emit('cancel')" class="btn btn-secondary">
          Cancelar
        </button>
        <button
          @click="handleContinue"
          :disabled="!acceptedPrivacy || (!!plan?.version?.documento && !acceptedConditions)"
          class="btn btn-primary"
          :class="{ 'disabled': !acceptedPrivacy || (!!plan?.version?.documento && !acceptedConditions) }"
        >
          Continuar
        </button>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { PlanesService } from '../services/planes.service';
import type { PlanWithDetails } from '../types/planes';
import type { CondicionVentaInput } from '../services/ventas.service';
import { formatVigencia } from '../utils/vigencia';

const props = defineProps<{
  planId: string;
}>();

const emit = defineEmits<{
  (e: 'next'): void;
  (e: 'cancel'): void;
  (e: 'update:acceptedPrivacy', value: boolean): void;
  (e: 'plan-loaded', plan: PlanWithDetails): void;
  (e: 'condiciones-aceptadas', condiciones: CondicionVentaInput[]): void;
}>();

const plan = ref<PlanWithDetails | null>(null);
const loading = ref(true);
const error = ref('');
const acceptedPrivacy = ref(false);
const acceptedConditions = ref(false);
const loadingDocument = ref(false);
const showDataUsageModal = ref(false);
const clientIp = ref('');
const condicionesAceptadas = ref<CondicionVentaInput[]>([]);

const fetchClientIp = async () => {
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    clientIp.value = data.ip;
  } catch {
    clientIp.value = 'unknown';
  }
};

const handleCondicionChange = (checked: boolean, condicion: string) => {
  if (checked) {
    condicionesAceptadas.value.push({
      ip: clientIp.value || 'unknown',
      condicion,
      created_at: new Date().toISOString(),
    });
  } else {
    condicionesAceptadas.value = condicionesAceptadas.value.filter(c => c.condicion !== condicion);
  }
};

const loadPlanDetail = async () => {
  try {
    loading.value = true;
    error.value = '';
    const {data} = await PlanesService.findById(props.planId);
    console.log('Plan detail data:', data);
    plan.value = data;
    // Emit plan data to parent so it can access campos_adicionales
    emit('plan-loaded', data);
  } catch (err) {
    error.value = 'Error al cargar el detalle del plan. Por favor intenta de nuevo.';
    console.error('Error loading plan:', err);
  } finally {
    loading.value = false;
  }
};

const handleContinue = () => {
  if (acceptedPrivacy.value) {
    emit('condiciones-aceptadas', condicionesAceptadas.value);
    emit('next');
  }
};

const verDocumento = async () => {
  if (!plan.value?.version?.documento) {
    return;
  }

  try {
    loadingDocument.value = true;

    // Verificar si es una ruta de S3 (necesita URL firmada)
    if (plan.value.version.documento.ruta && plan.value.version.documento.id) {
      // Obtener URL firmada del backend
      const signedUrl = await PlanesService.getDocumentoUrl(plan.value.version.documento.id);
      window.open(signedUrl, '_blank');
    } else {
      // Si no hay ruta o ID, mostrar error
      error.value = 'No se encontró el documento';
    }
  } catch (err) {
    console.error('Error al obtener URL del documento:', err);
    error.value = 'Error al abrir el documento. Por favor intenta de nuevo.';
  } finally {
    loadingDocument.value = false;
  }
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};


const formatDate = (vigencia: string): string => {
  const formatter = new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const today = new Date();

  if (vigencia === 'Inmediatamente') {
    return formatter.format(today);
  }

  if (vigencia === 'Dia siguiente') {
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    return formatter.format(tomorrow);
  }

  if (vigencia === 'Primer dia del mes siguiente') {
    const firstOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    return formatter.format(firstOfNextMonth);
  }

  return vigencia;
};

onMounted(() => {
  loadPlanDetail();
  fetchClientIp();
});
</script>

<style scoped>
.plan-detail-wrapper {
  min-height: 100vh;
  background: #f9fafb;
}

/* Hero Section */
.purchase-hero {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 2rem 1.5rem;
  margin-bottom: 2rem;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #bfdbfe;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.breadcrumb .current {
  color: white;
  font-weight: 600;
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

.plan-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem 2rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: #dc2626;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

.plan-detail-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.plan-header {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.plan-product-info {
  flex: 1;
  min-width: 200px;
}

.plan-title {
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0 0 0.3rem 0;
}

.plan-description {
  font-size: 0.95rem;
  opacity: 0.9;
  margin: 0;
  line-height: 1.4;
}

.plan-price {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  background: rgba(255, 255, 255, 0.15);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
}

.price-main {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
}

.price-amount {
  font-size: 2rem;
  font-weight: bold;
}

.price-period {
  font-size: 0.85rem;
  opacity: 0.9;
}

.price-alt {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 0.15rem;
  text-align: right;
}

.price-badge-saving {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #fbbf24;
  color: #78350f;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.25rem 0.6rem;
  border-radius: 20px;
  margin-bottom: 0.6rem;
  white-space: nowrap;
}

.price-row-debito {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.price-label-debito {
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.3px;
}

.price-row-regular {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.35rem;
  padding-top: 0.35rem;
  border-top: 1px solid rgba(255,255,255,0.2);
}

.price-label-regular {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
}

.price-alt-value {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.65);
  text-decoration: line-through;
}

.version-info {
  padding: 1.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.info-item {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.1rem;
  color: #1f2937;
  font-weight: 600;
}

.description-box {
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.description-box p {
  margin: 0;
  color: #1f2937;
  font-size: 0.95rem;
  line-height: 1.5;
}

.document-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #fef3c7;
  border: 1px solid #fbbf24;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.document-icon {
  width: 24px;
  height: 24px;
  color: #f59e0b;
  flex-shrink: 0;
}

.document-info {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.document-name {
  font-weight: 600;
  color: #78350f;
  font-size: 0.9rem;
}

.document-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 0.85rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-weight: 600;
}

.document-link:hover:not(:disabled) {
  text-decoration: underline;
}

.document-link:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

.coberturas-section {
  margin-top: 0;
}

.subsection-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: #1f2937;
}

.coberturas-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.cobertura-item {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 0.75rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.check-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.cobertura-content {
  flex: 1;
  min-width: 0;
}

.cobertura-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.cobertura-value {
  font-size: 0.85rem;
  color: #059669;
  font-weight: 500;
  margin: 0;
}

.privacy-section {
  background: #f1f5f9;
  border-top: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.privacy-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  transition: background 0.15s;
}

.privacy-checkbox:hover {
  background: #e8edf5;
}

.privacy-checkbox + .privacy-checkbox {
  margin-top: 0.25rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 0.85rem;
}

.conditions-text {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.conditions-icon {
  width: 16px;
  height: 16px;
  color: #3b82f6;
  flex-shrink: 0;
}

.privacy-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
  margin-top: 2px;
  accent-color: #3b82f6;
}

.checkbox-text {
  flex: 1;
  line-height: 1.5;
  color: #475569;
  font-size: 0.9rem;
}

.privacy-link {
  color: #3b82f6;
  text-decoration: underline;
  font-weight: 600;
}

.privacy-link:hover {
  color: #2563eb;
}

.privacy-link-btn {
  color: #3b82f6;
  text-decoration: underline;
  font-weight: 600;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
}

.privacy-link-btn:hover {
  color: #2563eb;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: #374151;
  line-height: 1.6;
}

.authorization-list {
  margin: 1rem 0;
  padding-left: 1.5rem;
  color: #4b5563;
}

.authorization-list li {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.authorization-footer {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
  font-size: 0.95rem;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
}

.action-buttons {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(.disabled) {
  background: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary.disabled {
  background: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .plan-detail-container {
    padding: 1rem;
  }

  .purchase-indicator {
    padding: 1rem;
  }

  .purchase-indicator-icon {
    width: 40px;
    height: 40px;
  }

  .purchase-indicator-icon svg {
    width: 24px;
    height: 24px;
  }

  .purchase-indicator-text h3 {
    font-size: 1rem;
  }

  .purchase-indicator-text p {
    font-size: 0.85rem;
  }

  .plan-header {
    padding: 1.25rem;
  }

  .plan-title {
    font-size: 1.4rem;
  }

  .price-amount {
    font-size: 1.75rem;
  }

  .version-info,
  .privacy-section,
  .action-buttons {
    padding: 1.25rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .coberturas-list {
    grid-template-columns: 1fr;
  }

  .document-info {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
