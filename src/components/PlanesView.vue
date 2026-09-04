<template>
  <!-- Loading Spinner -->
  <LoadingSpinner :visible="isProcessingPurchase" />

  <!-- Wizard de Compra -->
  <PlanPurchaseWizard
    v-if="showPurchaseWizard && selectedPlanId && selectedPlan"
    ref="purchaseWizard"
    :plan-id="selectedPlanId"
    :plan-precio="selectedPlan.precio"
    @purchase="handleCompra"
    @purchase-debito="handleCompraDebito"
    @cancel="closePurchaseWizard"
  />

  <div v-else class="min-h-screen bg-gray-50 border-0">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pb-12 lg:pb-40 pt-12" :style="heroBgStyle">
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

            <p v-if="productoPlanes.productoDescripcion" class="text-xl text-blue-100 max-w-3xl mx-auto hidden md:block">
              {{ productoPlanes.productoDescripcion }}
            </p>

            <!-- Stats -->
            <div class="grid-cols-1 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto hidden lg:grid">
              <div :style="statsBgStyle" class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.planes.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Planes disponibles</p>
              </div>
              <div :style="statsBgStyle" class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
                <div class="flex items-center justify-center gap-3 mb-2">
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <p class="text-4xl font-bold">{{ productoPlanes.coberturas.length }}</p>
                </div>
                <p class="text-sm text-blue-100 font-medium">Coberturas incluidas</p>
              </div>
              <div :style="statsBgStyle" class="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center border border-white/20 hover:bg-white/20 transition-all">
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
    <section class="py-4 lg:py-16">
      <div class="flex px-4 mx-auto container">
        <div class="self-end flex-shrink-0 hidden lg:block">
          <img src="/img/vigilado-superintendencia.png" class="w-6 lg:w-8" alt="Logo superintendencia">
        </div>
        <div class="container lg:pl-4">
          <!-- Titulo de la sección -->
          <div class="mb-12 pl-6" :class="logoAseguradoraUrl ? 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4' : 'text-center'">
            <img
              v-if="logoAseguradoraUrl"
              :src="logoAseguradoraUrl"
              alt="Logo aseguradora"
              class="h-12 sm:h-16 lg:h-20 object-contain flex-shrink-0 sm:order-last hidden lg:block"
            />
            <div>
              <h2 class="text-2xl md:text-4xl font-bold text-gray-900 mb-2 lg:mb-4"
                  :class="logoAseguradoraUrl ? '' : 'text-center'">
                Elige cómo estar protegido
              </h2>
              <p class="text-lg lg:text-xl text-gray-600"
                :class="logoAseguradoraUrl ? '' : 'max-w-2xl mx-auto text-center'">
                Un imprevisto puede ocurrir en cualquier momento. Estar preparado marca la diferencia.
              </p>
            </div>
          </div>
  
          <!-- Loading State -->
          <div v-if="loading" class="flex flex-col items-center justify-center py-20">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mb-4" :style="accentBorderStyle"></div>
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
            :estilos="aseguradoraEstilos"
            :imagen_aseguradora="logoAseguradoraUrl"
            @seleccionar-plan="handleSeleccionarPlan"
          />
        </div>
      </div>
    </section>

    <!-- Info adicional -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto">
          <div class="bg-blue-50 border-l-4 border-primary-600 p-6 rounded-lg" :style="accentBorderStyle">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" :style="accentTextStyle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    <section class="bg-primary-700 text-white py-16" :style="ctaBgStyle">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          ¿Necesitas ayuda para elegir?
        </h2>
        <p class="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
          Nuestros aliados están listos para ayudarte a encontrar el plan perfecto
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
import {
  VentasService,
  extraerRechazos,
  extraerProblemasTitular,
  esTitularNoEnviado,
  mensajeValorRepetido,
} from '../services/ventas.service';
import { ProductosService } from '../services/productos.service';
import useCupon from '../composables/cupon';
import type {
  ProductoPlanes,
  Plan,
  Cobertura,
  CoberturaPlan,
  PlanConCoberturas,
  EstilosAseguradora,
  CampoTitular,
  DatosTitular,
} from '../types/planes';
import { adaptarTitularAPayloadVenta, titularParaEnvio, type TitularPayloadVenta } from '../utils/titularVenta';
import { rechazosDesdeProblemas } from '../utils/rechazosCampos';

// Props
interface Props {
  productoId: string;
}

const props = defineProps<Props>();

// Estados
const loading = ref(true);
const error = ref<string | null>(null);
const showPurchaseWizard = ref(false);
const purchaseWizard = ref<InstanceType<typeof PlanPurchaseWizard> | null>(null);
const selectedPlanId = ref<string | null>(null);
const isProcessingPurchase = ref(false);
const aseguradoraEstilos = ref<EstilosAseguradora | null>(null);
const logoAseguradoraUrl = ref<string | null>(null);

const heroBgStyle = computed(() => {
  if (!aseguradoraEstilos.value) return {};
  return {
    // background: `linear-gradient(to bottom right, ${aseguradoraEstilos.value.color_primario}, ${aseguradoraEstilos.value.color_secundario})`
    background: `${aseguradoraEstilos.value.color_secundario}`
  };
});

const statsBgStyle = computed(() => {
  if (!aseguradoraEstilos.value) return {};
  return {
    // background: `linear-gradient(to bottom right, ${aseguradoraEstilos.value.color_primario}, ${aseguradoraEstilos.value.color_secundario})`
    background: `${aseguradoraEstilos.value.color_primario}`
  };
});

const ctaBgStyle = computed(() => {
  if (!aseguradoraEstilos.value) return {};
  return { backgroundColor: aseguradoraEstilos.value.color_secundario };
});

const accentBorderStyle = computed(() => {
  if (!aseguradoraEstilos.value) return {};
  return { borderColor: aseguradoraEstilos.value.color_secundario };
});

const accentTextStyle = computed(() => {
  if (!aseguradoraEstilos.value) return {};
  return { color: aseguradoraEstilos.value.color_secundario };
});

// Cupón de descuento aplicado en el resumen de compra
const { valorDescuento, codigoParaVenta, sincronizarConPlan, rechazarCuponDesdeVenta } = useCupon();

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
    .filter(planData => planData.version && planData.mostrar_publico !== false) // Solo planes con versión y visibles al público
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
        vigencia_numero_meses: version.vigencia_numero_meses,
        destacado: planData.mostrar_publico,
        coberturas,
        caracteristicas: [],
        color: undefined,
        valor_debito_automatico: version.valor_debito_automatico ?? null
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

    const [response, producto] = await Promise.all([
      PlanesService.obtenerPlanesPorProducto({
        producto_id: props.productoId,
        limit: 50,
        offset: 0,
        estado: true
      }),
      ProductosService.find(props.productoId)
    ]);

    aseguradoraEstilos.value = producto.aseguradora?.estilos ?? null;
    logoAseguradoraUrl.value = producto.aseguradora?.estilos?.logo_imagen?.url ?? null;

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
  // Si venía un cupón aplicado a otro plan, se limpia y se revalida contra este
  sincronizarConPlan(plan.id);
};

const closePurchaseWizard = () => {
  showPurchaseWizard.value = false;
  selectedPlanId.value = null;
};

const selectedPlan = computed(() => {
  if (!selectedPlanId.value) return null;
  return productoPlanes.value.planes.find(p => p.id === selectedPlanId.value);
});

/**
 * Obtiene el mensaje de error de una venta fallida. Si el backend rechazó el cupón
 * al revalidarlo (400 con { success: false, message }), lo quita del resumen.
 */
const listaDeMotivos = (mensaje: string, motivos: string[]): string =>
  `${mensaje}\n\n${motivos.map(motivo => `• ${motivo}`).join('\n')}`;

/**
 * Obtiene el mensaje de error de una venta fallida y marca en su campo lo que el
 * backend rechazó, devolviendo al cliente al formulario que lo tiene que corregir.
 *
 * Si el backend rechazó el cupón al revalidarlo (400 con { success: false, message }),
 * lo quita del resumen.
 */
const resolverErrorVenta = (
  error: any,
  codigoCupon?: string,
  camposTitular: CampoTitular[] = [],
): string => {
  const mensajeGeneral = error?.response?.data?.message
    || error?.message
    || 'Ocurrió un error al procesar la compra. Por favor intenta de nuevo.';

  // 422: el backend recotizó y la venta ya no se puede hacer. Vienen todos los motivos,
  // escritos para que los lea el cliente.
  const rechazos = extraerRechazos(error);
  if (rechazos.length > 0) {
    purchaseWizard.value?.mostrarRechazosDeVenta(rechazos);
    return listaDeMotivos(
      error?.response?.data?.message || 'La venta no se puede realizar con los datos ingresados',
      rechazos.map(rechazo => rechazo.mensaje),
    );
  }

  // 422 con `problemas`: los datos del titular no pasaron la validación del backend.
  // Cada problema nombra su campo, así que se marca ahí.
  const problemas = extraerProblemasTitular(error);
  if (problemas.length > 0) {
    const ubicados = rechazosDesdeProblemas(problemas, camposTitular, null);
    purchaseWizard.value?.mostrarRechazosDeVenta(ubicados.rechazos);
    return listaDeMotivos(error?.response?.data?.message || 'Los datos del titular no son válidos', problemas);
  }

  // 422 sin detalle: la versión cobra por los datos del titular y la venta salió sin
  // ellos. Es un error de la landing, no algo que el cliente pueda corregir.
  if (esTitularNoEnviado(error)) {
    console.error('La venta se envió sin los datos del titular que exige la versión del plan.', error);
    return 'No pudimos procesar tu compra. Por favor intenta de nuevo o comunícate con nosotros.';
  }

  // 409: un campo marcado como no repetible ya tiene ese valor en otra venta. Puede ser
  // cualquiera de los campos, no solo el documento.
  const repetido = mensajeValorRepetido(error);
  if (repetido) {
    const ubicados = rechazosDesdeProblemas([repetido], camposTitular, null);
    purchaseWizard.value?.mostrarRechazosDeVenta(ubicados.rechazos);
    return repetido;
  }

  const cuponRechazado = !!codigoCupon
    && error?.response?.status === 400
    && error?.response?.data?.success === false;

  if (cuponRechazado) {
    rechazarCuponDesdeVenta(mensajeGeneral);
  }

  return mensajeGeneral;
};

/** Lo que emite el wizard al confirmar la compra */
interface DatosCompraWizard {
  planId: string;
  /** Versión del plan con cuya configuración se llenaron los formularios */
  versionId: string;
  /** Respuestas del titular, indexadas por la `clave` del campo */
  titular: DatosTitular;
  /** Configuración del titular de la versión que se está comprando */
  camposTitular: CampoTitular[];
  /** Contraseña con la que el cliente entra después de comprar */
  clave: string;
  camposAdicionales?: import('../types/planes').CamposAdicionalesCapturados;
  /** Las mismas respuestas que se cotizaron */
  respuestas: import('../types/cotizacion').RespuestaCampo[];
  /** Total cotizado por el backend; null si no se alcanzó a cotizar */
  valorTotal: number | null;
  condiciones: import('../services/ventas.service').CondicionVentaInput[];
}

const handleCompra = async (data: DatosCompraWizard) => {
  isProcessingPurchase.value = true;

  // Buscar el plan seleccionado para obtener producto_id y version_id
  const planSeleccionado = productoPlanes.value.planes.find(p => p.id === data.planId);
  if (!planSeleccionado) {
    isProcessingPurchase.value = false;
    return;
  }

  // Calcular precio estimado con datos síncronos (cotización ya recibida) antes de cualquier await
  // para poder abrir la ventana de pago en el contexto de gesto del usuario (requerido en móvil)
  const codigoCupon = codigoParaVenta(data.planId);
  const precioEstimado = data.valorTotal ?? Math.max(0, planSeleccionado.precio - valorDescuento.value);

  // Abrir ventana ANTES de las operaciones async para que el navegador móvil lo permita
  const paymentWindow = precioEstimado > 0 ? window.open('', '_blank') : null;

  try {
    // Obtener detalles completos del plan
    const planDetalles = await PlanesService.findById(data.planId);
    const versionId = planDetalles.data.version?.id;

    if (!versionId) {
      throw new Error('No se pudo obtener la versión del plan');
    }

    // Cada versión pide sus propios datos del titular: si cambió mientras el cliente
    // llenaba el formulario, lo capturado ya no corresponde a lo que se está vendiendo
    if (data.versionId && data.versionId !== versionId) {
      throw new Error('El plan se actualizó mientras completabas la compra. Recarga la página para continuar con la versión vigente.');
    }

    // Los dos payloads del titular salen del mismo estado: el objeto indexado por
    // `clave` (el mismo que se cotizó) y los campos fijos que el backend todavía lee
    const titular = titularParaEnvio(data.titular, data.camposTitular);
    const titularVenta = adaptarTitularAPayloadVenta(data.titular, data.camposTitular);

    // Obtener datos del localStorage
    const aliadoIdLocalStorage = localStorage.getItem('aliado_id');

    // Crear la venta
    const ventaData = {
      producto_id: productoPlanes.value.productoId,
      version_id: versionId,
      ...titularVenta,
      ...(Object.keys(titular).length > 0 && { titular }),
      clave: data.clave,
      ...(codigoCupon && { codigo_descuento: codigoCupon }),
      ...(aliadoIdLocalStorage && { aliado_id: aliadoIdLocalStorage }),
      ...(data.respuestas.length > 0 && { respuestas: data.respuestas }),
      ...(data.camposAdicionales && { datos_adicionales: data.camposAdicionales }),
      condiciones: data.condiciones,
    };

    const response = await VentasService.crear_venta(ventaData);

    if (!response.transaccion_id) {
      throw new Error('No se recibió transaccion_id desde el backend.');
    }
    const transaccionId = response.transaccion_id;

    localStorage.setItem('transaccion_id', transaccionId);

    // El valor a cobrar es el que cotizó el backend (plan + adicionales - descuento)
    const precioFinal = data.valorTotal ?? Math.max(0, planSeleccionado.precio - valorDescuento.value);

    const compraResumen = {
      transaccion_id: transaccionId,
      plan_nombre: planSeleccionado.nombre,
      precio: precioFinal,
      vigencia_numero_meses: planSeleccionado.vigencia_numero_meses,
      comprador_nombre: titularVenta.nombres ?? '',
      comprador_apellido: titularVenta.apellidos ?? '',
      comprador_email: titularVenta.email ?? '',
      comprador_documento_tipo: titularVenta.tipo_documento ?? '',
      comprador_documento: titularVenta.numero_documento ?? '',
      comprador_telefono: titularVenta.telefono ?? '',
      fecha_compra: new Date().toISOString(),
    };
    localStorage.setItem('compra_resumen', JSON.stringify(compraResumen));

    await sendWompi(transaccionId, precioFinal, titularVenta, paymentWindow);
    window.location.href = '/procesando-pago';

    closePurchaseWizard();
  } catch (error: any) {
    console.error('Error al procesar la compra:', error);
    isProcessingPurchase.value = false;
    // Cerrar la ventana de pago si se abrió pero ocurrió un error
    paymentWindow?.close();

    const errorMessage = resolverErrorVenta(error, codigoCupon, data.camposTitular);

    const Swal = (await import('sweetalert2')).default;
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#1e40af'
    });
  } finally {
    // El loading se desactivará después de que Wompi redirija
    // Si no hay precio (plan gratuito), desactivar aquí
    if (!selectedPlan.value || selectedPlan.value.precio === 0) {
      isProcessingPurchase.value = false;
    }
  }
};

const handleCompraDebito = async (data: DatosCompraWizard & { cardTokenId: string }) => {
  isProcessingPurchase.value = true;

  const codigoCupon = codigoParaVenta(data.planId);

  try {
    const planDetalles = await PlanesService.findById(data.planId);
    const versionId = planDetalles.data.version?.id;

    if (!versionId) {
      throw new Error('No se pudo obtener la versión del plan');
    }

    // Cada versión pide sus propios datos del titular: si cambió mientras el cliente
    // llenaba el formulario, lo capturado ya no corresponde a lo que se está vendiendo
    if (data.versionId && data.versionId !== versionId) {
      throw new Error('El plan se actualizó mientras completabas la compra. Recarga la página para continuar con la versión vigente.');
    }

    const titular = titularParaEnvio(data.titular, data.camposTitular);
    const titularVenta = adaptarTitularAPayloadVenta(data.titular, data.camposTitular);

    const aliadoIdLocalStorage = localStorage.getItem('aliado_id');

    // POST /ventas crea la venta + preapproval en MP. La autorización del cobro
    // ocurre cuando el cliente confirma en MP y vuelve a back_url.
    const ventaData = {
      producto_id: productoPlanes.value.productoId,
      version_id: versionId,
      ...titularVenta,
      ...(Object.keys(titular).length > 0 && { titular }),
      clave: data.clave,
      ...(codigoCupon && { codigo_descuento: codigoCupon }),
      ...(aliadoIdLocalStorage && { aliado_id: aliadoIdLocalStorage }),
      ...(data.respuestas.length > 0 && { respuestas: data.respuestas }),
      ...(data.camposAdicionales && { datos_adicionales: data.camposAdicionales }),
      condiciones: data.condiciones,
      debito_automatico: true,
      card_token_id: data.cardTokenId,
      back_url: `${window.location.origin}/procesando-pago`,
    };

    const ventaResponse = await VentasService.crear_venta(ventaData);
    const ventaId = ventaResponse.venta_id ?? '';

    if (!ventaId) {
      throw new Error('No se recibió venta_id desde el backend.');
    }

    // El preapproval queda autorizado de inmediato en MP. Saltamos el redirect a init_point
    // (que solo mostraría una pantalla intermedia molesta) y vamos directo a /procesando-pago,
    // que polea /debito-automatico/confirmar hasta que el webhook complete el cobro.
    const planSeleccionado = productoPlanes.value.planes.find(p => p.id === data.planId);
    const precioDebito = planSeleccionado?.valor_debito_automatico ?? planSeleccionado?.precio ?? 0;
    const precioFinal = data.valorTotal ?? Math.max(0, precioDebito - valorDescuento.value);

    const compraResumen = {
      transaccion_id: ventaId,
      plan_nombre: planSeleccionado?.nombre || '',
      precio: precioFinal,
      vigencia_numero_meses: planSeleccionado?.vigencia_numero_meses,
      comprador_nombre: titularVenta.nombres ?? '',
      comprador_apellido: titularVenta.apellidos ?? '',
      comprador_email: titularVenta.email ?? '',
      comprador_documento_tipo: titularVenta.tipo_documento ?? '',
      comprador_documento: titularVenta.numero_documento ?? '',
      comprador_telefono: titularVenta.telefono ?? '',
      fecha_compra: new Date().toISOString(),
      debito_automatico: true,
    };
    localStorage.setItem('transaccion_id', ventaId);
    localStorage.setItem('venta_pendiente_id', ventaId);
    localStorage.setItem('compra_resumen', JSON.stringify(compraResumen));

    closePurchaseWizard();
    window.location.href = '/procesando-pago';
  } catch (error: any) {
    console.error('Error al procesar débito automático:', error);
    isProcessingPurchase.value = false;

    const errorMessage = resolverErrorVenta(error, codigoCupon, data.camposTitular);

    const Swal = (await import('sweetalert2')).default;
    Swal.fire({
      title: 'Error',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#1e40af'
    });
  }
};

/**
 * Calcula el SHA256 de un string (usado para la firma de integridad de Wompi)
 */
const sha256 = async (text: string): Promise<string> => {
  const buffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Navega a Wompi para procesar el pago.
 * Usa la ventana pre-abierta (paymentWindow) cuando existe, lo que permite
 * que funcione en móviles donde window.open bloqueado si se llama tras un await.
 */
const sendWompi = async (
  transaccionId: string,
  precio: number,
  titular: TitularPayloadVenta,
  paymentWindow: Window | null
) => {
  if (precio === 0) return;

  const amountInCents = precio * 100;
  const currency = 'COP';

  // Construir URL con parámetros (Wompi checkout usa GET)
  const params = new URLSearchParams();
  params.set('public-key', import.meta.env.PUBLIC_KEY_WOMPI);
  params.set('currency', currency);
  params.set('amount-in-cents', String(amountInCents));
  params.set('reference', transaccionId);

  // Firma de integridad requerida por Wompi
  const integrityKey = import.meta.env.PUBLIC_INTEGRITY_KEY_WOMPI;
  console.log('[Wompi] integrityKey presente:', !!integrityKey);
  console.log('[Wompi] cadena a hashear:', `${transaccionId}${amountInCents}${currency}${integrityKey}`);
  if (integrityKey) {
    const integrityHash = await sha256(`${transaccionId}${amountInCents}${currency}${integrityKey}`);
    console.log('[Wompi] integrity hash:', integrityHash);
    params.set('signature:integrity', integrityHash);
  }

  // URL de redirección
  const redirectUrl = import.meta.env.PUBLIC_WOMPI_REDIRECT_PAYMENT_COMPLETE || window.location.origin + '/gracias';
  params.set('redirect-url', redirectUrl);

  // Datos del cliente
  const fullName = `${titular.nombres ?? ''} ${titular.apellidos ?? ''}`.trim();
  params.set('customer-data:email', titular.email ?? '');
  params.set('customer-data:full-name', fullName);
  params.set('customer-data:phone-number', titular.telefono ?? '');

  // Tipo de documento y número
  params.set('customer-data:legal-id-type', titular.tipo_documento ?? 'CC');
  params.set('customer-data:legal-id', titular.numero_documento ?? '');

  const wompiUrl = `${import.meta.env.PUBLIC_CHECKOUT_URL_WOMPI}?${params.toString()}`;

  if (paymentWindow) {
    // Ventana pre-abierta sincrónicamente desde el gesto del usuario (funciona en móvil)
    paymentWindow.location.href = wompiUrl;
  } else {
    window.open(wompiUrl, '_blank', 'noopener,noreferrer');
  }
};

onMounted(() => {
  loadPlanes();
});
</script>
