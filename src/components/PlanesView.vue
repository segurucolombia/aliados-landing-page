<template>
  <!-- Loading Spinner -->
  <LoadingSpinner :visible="isProcessingPurchase" />

  <!-- Wizard de Compra -->
  <PlanPurchaseWizard
    v-if="showPurchaseWizard && selectedPlanId && selectedPlan"
    :plan-id="selectedPlanId"
    :plan-precio="selectedPlan.precio"
    @purchase="handleCompra"
    @cancel="closePurchaseWizard"
  />

  <div v-else class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-32 pt-12">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="mb-6">
            <ol class="flex items-center gap-2 text-sm text-blue-200">
              <li><a href="/" class="hover:text-white transition-colors">Inicio</a></li>
              <li><span>/</span></li>
              <li><a href="/productos" class="hover:text-white transition-colors">Productos</a></li>
              <li><span>/</span></li>
              <li class="text-white font-semibold">{{ productoPlanes.productoNombre }}</li>
            </ol>
          </nav>

          <div class="text-center">
            <div class="flex items-center justify-center gap-3 mb-">
              <div class="w-12 h-1 bg-blue-300"></div>
              <span class="text-blue-200 font-semibold">Planes Disponibles</span>
              <div class="w-12 h-1 bg-blue-300"></div>
            </div>

            <h1 class="text-4xl md:text-5xl font-bold mb-6">
              {{ productoPlanes.productoNombre }}
            </h1>

            <p v-if="productoPlanes.productoDescripcion" class="text-xl text-blue-100 max-w-3xl mx-auto">
              {{ productoPlanes.productoDescripcion }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.planes.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Planes disponibles</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.coberturas.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Coberturas incluidas</p>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-4xl font-bold">24/7</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Atención disponible</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <!-- Planes Comparison Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <!-- Titulo de la sección -->
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Compara nuestros planes
          </h2>
          <p class="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-4"></div>
          <p class="text-gray-600 text-lg">Cargando planes...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="max-w-2xl mx-auto">
          <div class="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-red-900 mb-2">Error al cargar los planes</h3>
                <p class="text-red-700">{{ error }}</p>
                <button
                  @click="loadPlanes"
                  class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="productoPlanes.planes.length === 0" class="text-center py-20">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <p class="text-xl text-gray-500 mb-2">No hay planes disponibles</p>
          <p class="text-gray-400">Este producto aún no tiene planes configurados</p>
        </div>

        <!-- Tabla de Comparación -->
        <PlanesTable
          v-else
          :planes="productoPlanes.planes"
          :coberturas="productoPlanes.coberturas"
          @seleccionar-plan="handleSeleccionarPlan"
        />
      </div>
    </section>

    <!-- Info adicional -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">Información Importante</h3>
                <ul class="space-y-2 text-gray-700">
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Todos los planes incluyen atención al cliente 24/7</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Puedes cambiar de plan en cualquier momento</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Sin cargos ocultos, precio transparente</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <svg class="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Cobertura respaldada por aseguradoras reconocidas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-primary-700 text-white py-16">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Nuestros asesores están listos para ayudarte a encontrar el plan perfecto
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-lg inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
            Llamar Ahora
          </button>
          <button class="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors text-lg inline-flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Chat en Vivo
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import PlanesTable from './PlanesTable.vue';
import PlanPurchaseWizard from './PlanPurchaseWizard.vue';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import { PlanesService } from '../services/planes.service';
import { VentasService } from '../services/ventas.service';
import type { ProductoPlanes, Plan, Cobertura, CoberturaPlan, PlanConCoberturas } from '../types/planes';
import type { PurchaseFormData } from './PlanPurchaseFormStep.vue';

// Props
interface Props {
  productoId: string;
}

const props = defineProps<Props>();

// Estados
const loading = ref(true);
const error = ref<string | null>(null);
const showPurchaseWizard = ref(false);
const selectedPlanId = ref<string | null>(null);
const isProcessingPurchase = ref(false);
const productoPlanes = ref<ProductoPlanes>({
  productoId: '',
  productoNombre: 'Cargando...',
  productoDescripcion: '',
  coberturas: [],
  planes: []
});

/**
 * Transforma los datos del API al formato esperado por PlanesTable
 */
const transformarDatos = (data: PlanConCoberturas[]): void => {
  if (!data || data.length === 0) {
    return;
  }

  // Obtener producto info del primer plan
  const primerPlan = data[0];
  productoPlanes.value.productoId = primerPlan.producto.id;
  productoPlanes.value.productoNombre = primerPlan.producto.nombre;
  productoPlanes.value.productoDescripcion = primerPlan.producto.descripcion;

  // Recolectar todas las coberturas únicas
  const coberturasMap = new Map<string, Cobertura>();

  data.forEach(planData => {
    if (planData.version?.coberturas) {
      planData.version.coberturas.forEach(coberturaVersion => {
        if (!coberturasMap.has(coberturaVersion.cobertura.id)) {
          coberturasMap.set(coberturaVersion.cobertura.id, {
            id: coberturaVersion.cobertura.id,
            nombre: coberturaVersion.cobertura.nombre,
            descripcion: coberturaVersion.cobertura.descripcion || undefined,
            categoria: undefined,
            orden: undefined
          });
        }
      });
    }
  });

  productoPlanes.value.coberturas = Array.from(coberturasMap.values());

  // Transformar planes
  productoPlanes.value.planes = data
    .filter(planData => planData.version) // Solo planes con versión
    .map(planData => {
      const version = planData.version!;

      // Construir coberturas del plan
      const coberturas: CoberturaPlan[] = productoPlanes.value.coberturas.map(cobertura => {
        const coberturaVersion = version.coberturas.find(
          cv => cv.cobertura_id === cobertura.id
        );

        if (coberturaVersion) {
          return {
            coberturaId: cobertura.id,
            aplica: true,
            valorCubierto: parseFloat(coberturaVersion.valor) || undefined,
            descripcion: coberturaVersion.descripcion || undefined,
            detalles: undefined,
            limitaciones: undefined
          };
        }

        return {
          coberturaId: cobertura.id,
          aplica: false
        };
      });

      return {
        id: planData.id,
        nombre: version.nombre,
        descripcion: version.descripcion || '',
        precio: version.precio,
        moneda: 'COP',
        periodicidad: 'anual' as const,
        destacado: planData.mostrar_publico,
        coberturas,
        caracteristicas: [],
        color: undefined
      };
    });
};

/**
 * Cargar planes desde el API
 */
const loadPlanes = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (!props.productoId) {
      throw new Error('No se proporcionó un ID de producto');
    }

    const response = await PlanesService.obtenerPlanesPorProducto({
      producto_id: props.productoId,
      limit: 50,
      offset: 0,
      estado: true
    });

    transformarDatos(response.data);
  } catch (err) {
    console.error('Error al cargar planes:', err);
    error.value = err instanceof Error ? err.message : 'Error al cargar los planes';
  } finally {
    loading.value = false;
  }
};

const handleSeleccionarPlan = (plan: Plan) => {
  console.log('Plan seleccionado:', plan);
  selectedPlanId.value = plan.id;
  showPurchaseWizard.value = true;
};

const closePurchaseWizard = () => {
  showPurchaseWizard.value = false;
  selectedPlanId.value = null;
};

const selectedPlan = computed(() => {
  if (!selectedPlanId.value) return null;
  return productoPlanes.value.planes.find(p => p.id === selectedPlanId.value);
});

const handleCompra = async (data: { planId: string; formData: PurchaseFormData }) => {
  console.log('Datos de compra:', data);

  isProcessingPurchase.value = true;

  try {
    // Buscar el plan seleccionado para obtener producto_id y version_id
    const planSeleccionado = productoPlanes.value.planes.find(p => p.id === data.planId);
    if (!planSeleccionado) {
      throw new Error('Plan no encontrado');
    }

    // Obtener detalles completos del plan
    const planDetalles = await PlanesService.findById(data.planId);
    const versionId = planDetalles.data.version?.id;

    if (!versionId) {
      throw new Error('No se pudo obtener la versión del plan');
    }

    // Determinar tipo de persona y preparar datos para crear venta
    const tipoPersona = data.formData.documentType === 'NIT' ? 'Juridica' : 'Natural';
    const tipoDocumento = data.formData.documentType === 'NIT'
      ? data.formData.legalRepDocumentType || ''
      : data.formData.documentType;

    // Obtener datos del localStorage
    const cuponLocalStorage = localStorage.getItem('cupon');
    const aliadoIdLocalStorage = localStorage.getItem('aliado_id');

    // Crear la venta
    const ventaData = {
      producto_id: productoPlanes.value.productoId,
      version_id: versionId,
      email: data.formData.email,
      clave: data.formData.password,
      tipo_documento: tipoDocumento,
      numero_documento: data.formData.documentNumber,
      nombres: data.formData.fullName,
      apellidos: data.formData.lastName,
      telefono: data.formData.phone,
      ...(data.formData.nit && { nit: data.formData.nit }),
      ...(data.formData.companyName && { empresa_nombre: data.formData.companyName }),
      tipo_persona: tipoPersona,
      ...(cuponLocalStorage && { codigo_descuento: cuponLocalStorage }),
      ...(aliadoIdLocalStorage && { aliado_id: aliadoIdLocalStorage }),
    };

    const response = await VentasService.crear_venta(ventaData);

    // Redirigir a Wompi con el transaccion_id
    sendWompi(response.transaccion_id, planSeleccionado.precio, data.formData);

    closePurchaseWizard();
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    alert('Ocurrió un error al procesar la compra. Por favor intenta de nuevo.');
    isProcessingPurchase.value = false;
  } finally {
    // El loading se desactivará después de que Wompi redirija
    // Si no hay precio (plan gratuito), desactivar aquí
    if (!selectedPlan.value || selectedPlan.value.precio === 0) {
      isProcessingPurchase.value = false;
    }
  }
};

/**
 * Envía el formulario a Wompi para procesar el pago
 */
const sendWompi = (
  transaccionId: string,
  precio: number,
  formData: PurchaseFormData
) => {
  if (precio === 0) return;

  const createHiddenInput = (name: string, value: string | number) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = String(value);
    return input;
  };

  const form = document.createElement('form');
  form.action = import.meta.env.PUBLIC_CHECKOUT_URL_WOMPI;
  form.method = 'GET';
  form.target = '_blank';

  // Campos obligatorios
  form.appendChild(createHiddenInput('public-key', import.meta.env.PUBLIC_KEY_WOMPI));
  form.appendChild(createHiddenInput('currency', 'COP'));
  form.appendChild(createHiddenInput('amount-in-cents', precio * 100));
  form.appendChild(createHiddenInput('reference', transaccionId));

  // URL de redirección
  const redirectUrl = import.meta.env.PUBLIC_WOMPI_REDIRECT_PAYMENT_COMPLETE || window.location.origin + '/gracias';
  form.appendChild(createHiddenInput('redirect-url', redirectUrl));

  // Datos del cliente
  const fullName = `${formData.fullName} ${formData.lastName}`;
  form.appendChild(createHiddenInput('customer-data:email', formData.email));
  form.appendChild(createHiddenInput('customer-data:full-name', fullName));
  form.appendChild(createHiddenInput('customer-data:phone-number', formData.phone));

  // Tipo de documento y número
  const tipoDocumento = formData.documentType === 'NIT'
    ? formData.legalRepDocumentType || 'CC'
    : formData.documentType;
  form.appendChild(createHiddenInput('customer-data:legal-id-type', tipoDocumento));
  form.appendChild(createHiddenInput('customer-data:legal-id', formData.documentNumber));

  document.body.appendChild(form);
  form.submit();

  // Limpiar el formulario después de enviarlo
  setTimeout(() => {
    document.body.removeChild(form);
  }, 1000);
};

onMounted(() => {
  loadPlanes();
});
</script>
