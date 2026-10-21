<template>
  <Toast />

  <!-- Cargando la venta -->
  <div v-if="state === 'loading'" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="flex items-center gap-3">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      <p class="text-gray-700 font-medium">Cargando venta...</p>
    </div>
  </div>

  <!-- 404 / 422: la venta no existe o el id no es válido -->
  <div v-else-if="state === 'no-encontrada'" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
      <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h1 class="text-xl font-bold text-gray-900 mb-2">Venta no encontrada</h1>
      <p class="text-sm text-gray-600 mb-6">
        No pudimos encontrar la venta de este enlace. Asegúrate de abrirlo tal como lo recibiste.
      </p>
      <button
        @click="volverInicio"
        class="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Volver al inicio
      </button>
    </div>
  </div>

  <!-- Error genérico al cargar -->
  <div v-else-if="state === 'error'" class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
      <h1 class="text-xl font-bold text-gray-900 mb-2">No pudimos cargar la venta</h1>
      <p class="text-sm text-gray-600 mb-6">{{ errorCarga }}</p>
      <button
        @click="cargarVenta"
        class="w-full bg-primary-700 hover:bg-primary-800 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Reintentar
      </button>
    </div>
  </div>

  <div v-else-if="venta" class="purchase-form-wrapper">
    <!-- Encabezado: mismo diseño que el paso "Información del Titular" de la compra normal -->
    <section class="form-hero">
      <div class="hero-content">
        <div class="hero-title-section">
          <div class="title-icon">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
          <div>
            <h2 class="hero-title">{{ titulo }}</h2>
            <p class="hero-subtitle">{{ subtitulo }}</p>
          </div>
        </div>
      </div>
    </section>

    <div class="purchase-form-container">
      <!-- Datos del cliente en solo lectura: la venta ya no se puede gestionar -->
      <div v-if="!esEditable" class="purchase-form">
        <div class="flex items-center justify-between gap-4 flex-wrap mb-6">
          <span class="px-3 py-1 rounded-full text-sm font-semibold" :class="badge.clase">{{ badge.texto }}</span>
          <p v-if="paymentId" class="text-sm text-gray-600">
            Referencia de pago: <span class="font-semibold text-gray-900">{{ paymentId }}</span>
          </p>
        </div>

        <div v-if="venta.estado === 'PAGADA' && paymentId" class="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 text-sm mb-6">
          Pago aprobado. Se cobró {{ formatPriceNoDecimal(venta.valor_total) }} y el débito automático quedó activo
          cada {{ venta.periodo_meses }} {{ venta.periodo_meses === 1 ? 'mes' : 'meses' }}.
        </div>
        <div v-else class="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm mb-6">
          Esta venta ya no se puede gestionar.
        </div>

        <div class="desglose mb-8">
          <h3 class="desglose-titulo">Datos del titular</h3>
          <div class="linea"><span>Documento</span><span>{{ [venta.tipo_documento, venta.numero_documento].filter(Boolean).join(' ') || '—' }}</span></div>
          <DatosClienteExistente v-if="clienteConfirmado" :cliente="clienteConfirmado" class="mt-2" />
          <template v-else>
          <div class="linea"><span>Nombre</span><span>{{ [venta.nombres, venta.apellidos].filter(Boolean).join(' ') || '—' }}</span></div>
          <div class="linea"><span>Fecha de nacimiento</span><span>{{ venta.dob ? formatearFecha(venta.dob) : '—' }}</span></div>
          <div class="linea"><span>Correo</span><span class="break-all">{{ venta.correo || '—' }}</span></div>
          <div class="linea"><span>Celular</span><span>{{ [venta.celular_1, venta.celular_2].filter(Boolean).join(' / ') || '—' }}</span></div>
          <div class="linea"><span>Ciudad</span><span>{{ textoCiudad(venta.ciudad, venta.departamento) || '—' }}</span></div>
          </template>
        </div>

        <ResumenVentaConvenio :venta="venta" />
      </div>

      <!-- Datos completos: resumen compacto a la izquierda y el pago a la derecha -->
      <div v-else-if="mostrarPago" class="pago-layout">
        <aside class="resumen-lateral">
          <div class="purchase-form resumen-card">
            <div class="flex items-center justify-between gap-3 mb-4">
              <h3 class="desglose-titulo !mb-0">Datos del titular</h3>
              <Button
                label="Editar"
                icon="pi pi-pencil"
                class="p-button-text p-button-sm"
                type="button"
                :disabled="pagoOcupado"
                @click="editarDatos"
              />
            </div>
            <!-- Compró como cliente existente: no se muestran sus datos, solo el resumen enmascarado -->
            <template v-if="clienteConfirmado">
              <div class="linea"><span>Documento</span><span>{{ [venta.tipo_documento, venta.numero_documento].filter(Boolean).join(' ') || '—' }}</span></div>
              <DatosClienteExistente :cliente="clienteConfirmado" class="mt-2" />
            </template>
            <template v-else>
              <div class="linea"><span>Nombre</span><span>{{ [venta.nombres, venta.apellidos].filter(Boolean).join(' ') || '—' }}</span></div>
              <div class="linea"><span>Documento</span><span>{{ [venta.tipo_documento, venta.numero_documento].filter(Boolean).join(' ') || '—' }}</span></div>
              <div class="linea"><span>Correo</span><span class="break-all">{{ venta.correo || '—' }}</span></div>
              <div class="linea"><span>Celular</span><span>{{ venta.celular_1 || '—' }}</span></div>
              <div class="linea"><span>Ciudad</span><span>{{ textoCiudad(venta.ciudad, venta.departamento) || '—' }}</span></div>
            </template>
          </div>

          <ResumenVentaConvenio :venta="venta" />
        </aside>

        <div class="purchase-form">
          <div v-if="!venta.debito_automatico_activo" class="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-4 text-sm">
            El débito automático de esta venta está desactivado.
          </div>
          <PagoVentaConvenio
            v-else
            :venta="venta"
            :recargar="refrescarVenta"
            @pagada="onPagada"
            @actualizada="venta = $event"
            @no-encontrada="state = 'no-encontrada'"
            @update:ocupado="pagoOcupado = $event"
          />
        </div>
      </div>

      <form v-else @submit.prevent="guardar" novalidate class="purchase-form">
        <div class="form-grid">
          <div class="field">
            <label for="tipo_documento">Tipo de documento <span class="required">*</span></label>
            <Select
              id="tipo_documento"
              v-model="form.tipo_documento"
              :options="DOCUMENT_TYPES"
              optionLabel="nombre"
              optionValue="tipo"
              placeholder="Seleccione una opción"
              :class="{ 'p-invalid': !!errores.tipo_documento }"
              @change="alSalirDeDocumento('tipo_documento')"
            />
            <small v-if="errores.tipo_documento" class="p-error">{{ errores.tipo_documento }}</small>
          </div>

          <div class="field">
            <label for="numero_documento">Número de documento <span class="required">*</span></label>
            <InputText
              id="numero_documento"
              v-model="form.numero_documento"
              maxlength="100"
              :class="{ 'p-invalid': !!errores.numero_documento }"
              @blur="alSalirDeDocumento('numero_documento')"
            />
            <small v-if="errores.numero_documento" class="p-error">{{ errores.numero_documento }}</small>
            <small v-if="buscandoCliente" class="buscando-cliente">
              <i class="pi pi-spin pi-spinner"></i> Verificando documento...
            </small>
          </div>

          <!-- Ya es cliente: sus datos personales no se muestran, solo este resumen enmascarado -->
          <div v-if="clienteConfirmado" class="field-completo">
            <div class="flex items-center justify-between gap-3 mb-2">
              <span class="font-semibold text-gray-800">Datos de cliente registrado</span>
              <Button label="No soy yo" class="p-button-text p-button-sm" type="button" @click="descartarCliente" />
            </div>
            <DatosClienteExistente :cliente="clienteConfirmado" />
            <p v-if="camposFaltantes.length > 0" class="text-sm text-amber-800 mt-3">
              Completa estos datos para continuar con la compra.
            </p>
          </div>

          <div v-if="campoVisible('nombres')" class="field">
            <label for="nombres">Nombres <span class="required">*</span></label>
            <InputText
              id="nombres"
              v-model="form.nombres"
              maxlength="255"
              :class="{ 'p-invalid': !!errores.nombres }"
              @blur="validarCampo('nombres')"
            />
            <small v-if="errores.nombres" class="p-error">{{ errores.nombres }}</small>
          </div>

          <div v-if="campoVisible('apellidos')" class="field">
            <label for="apellidos">Apellidos <span class="required">*</span></label>
            <InputText
              id="apellidos"
              v-model="form.apellidos"
              maxlength="255"
              :class="{ 'p-invalid': !!errores.apellidos }"
              @blur="validarCampo('apellidos')"
            />
            <small v-if="errores.apellidos" class="p-error">{{ errores.apellidos }}</small>
          </div>

          <!-- Fecha: se guarda y se envía como YYYY-MM-DD -->
          <div v-if="campoVisible('dob')" class="field">
            <label for="dob">Fecha de nacimiento <span class="required">*</span></label>
            <input
              id="dob"
              v-model="form.dob"
              type="date"
              :max="hoy"
              class="p-inputtext p-component"
              :class="{ 'p-invalid': !!errores.dob }"
              @blur="validarCampo('dob')"
              @change="validarCampo('dob')"
            />
            <small v-if="errores.dob" class="p-error">{{ errores.dob }}</small>
          </div>

          <div v-if="campoVisible('correo')" class="field">
            <label for="correo">Correo electrónico <span class="required">*</span></label>
            <InputText
              id="correo"
              v-model="form.correo"
              type="email"
              maxlength="255"
              :class="{ 'p-invalid': !!errores.correo }"
              @blur="validarCampo('correo')"
            />
            <small v-if="errores.correo" class="p-error">{{ errores.correo }}</small>
          </div>

          <div v-if="campoVisible('celular_1')" class="field">
            <label for="celular_1">Celular <span class="required">*</span></label>
            <InputText
              id="celular_1"
              v-model="form.celular_1"
              type="tel"
              inputmode="tel"
              maxlength="50"
              :class="{ 'p-invalid': !!errores.celular_1 }"
              @blur="validarCampo('celular_1')"
            />
            <small v-if="errores.celular_1" class="p-error">{{ errores.celular_1 }}</small>
          </div>

          <div v-if="campoVisible('celular_2')" class="field">
            <label for="celular_2">Celular 2</label>
            <InputText
              id="celular_2"
              v-model="form.celular_2"
              type="tel"
              inputmode="tel"
              maxlength="50"
              :class="{ 'p-invalid': !!errores.celular_2 }"
              @blur="validarCampo('celular_2')"
            />
            <small v-if="errores.celular_2" class="p-error">{{ errores.celular_2 }}</small>
          </div>

          <!-- Ciudad: el selector que ya existe. `delay` es el debounce de la búsqueda. -->
          <div v-if="campoVisible('ciudad')" class="field field-completo">
            <label for="ciudad">Ciudad <span class="required">*</span></label>
            <AutoComplete
              inputId="ciudad"
              v-model="form.ciudad"
              optionLabel="name"
              :suggestions="ciudadesBuscadas"
              :delay="300"
              :class="{ 'p-invalid': !!errores.ciudad }"
              input-class="w-full"
              placeholder="Busca tu ciudad"
              @complete="buscarCiudades"
              @option-select="validarCampo('ciudad')"
              @blur="validarCampo('ciudad')"
            />
            <small v-if="errores.ciudad" class="p-error">{{ errores.ciudad }}</small>
          </div>
        </div>

        <!-- Detalle de la compra, como en el flujo normal -->
        <ResumenVentaConvenio :venta="venta" class="mt-8" />

        <div v-if="errorGuardado" class="mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {{ errorGuardado }}
        </div>

        <div class="form-actions">
          <Button
            v-if="venta.estado === 'GESTIONADA'"
            label="Cancelar"
            class="p-button-secondary p-button-outlined"
            type="button"
            :disabled="guardando"
            @click="cancelarEdicion"
          />
          <Button
            :label="venta.estado === 'PENDIENTE' ? 'Continuar al pago' : 'Guardar y continuar al pago'"
            icon="pi pi-check"
            class="p-button-primary"
            type="submit"
            :loading="guardando"
            :disabled="pagoOcupado"
          />
        </div>
      </form>
    </div>

    <ClienteExistenteModal
      :cliente="clienteEncontrado"
      @confirmar="confirmarCliente"
      @descartar="descartarCliente"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Select from 'primevue/select';
import InputText from 'primevue/inputtext';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import { DOCUMENT_TYPES } from '../utils/documentTypes';
import ResumenVentaConvenio from './ResumenVentaConvenio.vue';
import PagoVentaConvenio from './PagoVentaConvenio.vue';
import ClienteExistenteModal from './ClienteExistenteModal.vue';
import DatosClienteExistente from './DatosClienteExistente.vue';
import useClienteExistente from '../composables/clienteExistente';
import { formatPriceNoDecimal } from '../shared/priceFormat';
import { formatearFechaSinHora as formatearFecha } from '../shared/datesFormat';
import { CiudadesColombiaService, type Ciudad } from '../services/ciudades-colombia.service';
import {
  VentasConveniosService,
  datosFaltantesCliente,
  esClienteNoEncontrado,
  esGestionable,
  type GestionarVentaConvenioConClienteInput,
  type GestionarVentaConvenioInput,
  type EstadoVentaConvenio,
  type VentaConvenioDetalle,
} from '../services/ventas-convenios.service';

const props = defineProps<{ ventaId: string }>();

type State = 'loading' | 'no-encontrada' | 'error' | 'listo';
type CiudadOpcion = Ciudad & { name: string };

interface FormularioCliente {
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  dob: string;
  correo: string;
  celular_1: string;
  celular_2: string;
  /** Texto mientras se escribe; la opción elegida cuando se selecciona del listado */
  ciudad: CiudadOpcion | string | null;
}

type CampoFormulario = keyof FormularioCliente;

const toast = useToast();

const state = ref<State>('loading');
const venta = ref<VentaConvenioDetalle | null>(null);
const errorCarga = ref('');
const errorGuardado = ref('');
const guardando = ref(false);
/** Hay un cobro o una verificación en curso: no se guardan cambios del cliente */
const pagoOcupado = ref(false);
/** Referencia de Mercado Pago del cobro hecho en esta vista */
const paymentId = ref<string | null>(null);
const ciudadesBuscadas = ref<CiudadOpcion[]>([]);
const errores = ref<Partial<Record<CampoFormulario, string>>>({});

const formularioVacio = (): FormularioCliente => ({
  tipo_documento: '',
  numero_documento: '',
  nombres: '',
  apellidos: '',
  dob: '',
  correo: '',
  celular_1: '',
  celular_2: '',
  ciudad: null,
});

const form = ref<FormularioCliente>(formularioVacio());

const esEditable = computed(() => !!venta.value && esGestionable(venta.value.estado));

/** El cliente pidió corregir sus datos desde la vista de pago */
const editando = ref(false);

/** Con los datos ya guardados (GESTIONADA) se muestra el pago, salvo que se estén editando */
const mostrarPago = computed(() => venta.value?.estado === 'GESTIONADA' && !editando.value);

const BADGES: Record<EstadoVentaConvenio, { texto: string; clase: string }> = {
  PENDIENTE: { texto: 'Pendiente', clase: 'bg-yellow-100 text-yellow-800' },
  GESTIONADA: { texto: 'Gestionada', clase: 'bg-blue-100 text-blue-800' },
  PAGADA: { texto: 'Pagada', clase: 'bg-green-100 text-green-800' },
  CANCELADA: { texto: 'Cancelada', clase: 'bg-gray-200 text-gray-700' },
};

const badge = computed(() => BADGES[venta.value!.estado] ?? { texto: venta.value!.estado, clase: 'bg-gray-200 text-gray-700' });

const titulo = computed(() => {
  if (mostrarPago.value) return 'Pago';
  if (esEditable.value) return 'Información del Titular';
  return venta.value?.estado === 'PAGADA' && paymentId.value ? '¡Pago aprobado!' : 'Detalle de la venta';
});

const subtitulo = computed(() => {
  if (mostrarPago.value) return 'Revisa el resumen y completa el pago con tu tarjeta';
  if (esEditable.value) return 'Complete los siguientes datos para continuar con la compra';
  return venta.value?.estado === 'PAGADA' ? 'Esta venta ya está pagada' : 'Esta venta ya no se puede gestionar';
});

/** Hoy en hora local, como YYYY-MM-DD: tope del date picker */
const hoy = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

/**
 * Las fechas de la venta no tienen hora aunque lleguen en ISO: se toma solo la parte
 * YYYY-MM-DD. Formatearlas en hora de Colombia las corre un día hacia atrás.
 */
const soloFecha = (iso: string | null): string => (iso ? iso.slice(0, 10) : '');

const textoCiudad = (ciudad: string | null, departamento: string | null): string =>
  ciudad && departamento ? `${ciudad}, ${departamento}` : ciudad || departamento || '';

/** "Medellín, Antioquia" → ciudad "Medellín", departamento "Antioquia" (por la última coma) */
const separarCiudad = (nombre: string): { ciudad: string; departamento: string } | null => {
  const coma = nombre.lastIndexOf(',');
  if (coma < 0) return null;
  const ciudad = nombre.slice(0, coma).trim();
  const departamento = nombre.slice(coma + 1).trim();
  return ciudad && departamento ? { ciudad, departamento } : null;
};

const ciudadSeleccionada = computed(() => {
  const valor = form.value.ciudad;
  return valor && typeof valor === 'object' ? separarCiudad(valor.nombre) : null;
});

/** GESTIONADA precarga lo que ya tiene la venta; PENDIENTE arranca vacío */
const llenarFormulario = (v: VentaConvenioDetalle): void => {
  const base = formularioVacio();
  if (v.estado === 'GESTIONADA') {
    const nombreCiudad = textoCiudad(v.ciudad, v.departamento);
    Object.assign(base, {
      tipo_documento: v.tipo_documento ?? '',
      numero_documento: v.numero_documento ?? '',
      nombres: v.nombres ?? '',
      apellidos: v.apellidos ?? '',
      dob: soloFecha(v.dob),
      correo: v.correo ?? '',
      celular_1: v.celular_1 ?? '',
      celular_2: v.celular_2 ?? '',
      ciudad: v.ciudad && v.departamento ? { id: 0, nombre: nombreCiudad, name: nombreCiudad } : null,
    });
  }
  form.value = base;
  errores.value = {};
};

const buscarCiudades = async (event: { query: string }): Promise<void> => {
  if (!event.query) {
    ciudadesBuscadas.value = [];
    return;
  }
  try {
    const { data } = await CiudadesColombiaService.buscarPorNombre(event.query, 20);
    // AutoComplete necesita la propiedad 'name'
    ciudadesBuscadas.value = data.map((ciudad) => ({ ...ciudad, name: ciudad.nombre }));
  } catch (error) {
    console.error('Error al buscar ciudades:', error);
    ciudadesBuscadas.value = [];
  }
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validarValor = (campo: CampoFormulario): string => {
  const valor = form.value[campo];
  const texto = typeof valor === 'string' ? valor.trim() : '';

  switch (campo) {
    case 'tipo_documento':
      return texto ? '' : 'Selecciona el tipo de documento';
    case 'numero_documento':
      if (!texto) return 'El número de documento es obligatorio';
      return texto.length > 100 ? 'Máximo 100 caracteres' : '';
    case 'nombres':
    case 'apellidos':
      if (!texto) return `Los ${campo} son obligatorios`;
      return texto.length > 255 ? 'Máximo 255 caracteres' : '';
    case 'dob':
      if (!texto) return 'La fecha de nacimiento es obligatoria';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return 'Fecha inválida';
      return texto > hoy ? 'La fecha de nacimiento no puede ser futura' : '';
    case 'correo':
      if (!texto) return 'El correo es obligatorio';
      if (texto.length > 255) return 'Máximo 255 caracteres';
      return EMAIL_REGEX.test(texto) ? '' : 'Ingresa un correo válido';
    case 'celular_1':
      if (!texto) return 'El celular es obligatorio';
      return texto.length > 50 ? 'Máximo 50 caracteres' : '';
    case 'celular_2':
      return texto.length > 50 ? 'Máximo 50 caracteres' : '';
    case 'ciudad': {
      const seleccion = ciudadSeleccionada.value;
      if (!seleccion) return 'Selecciona una ciudad del listado';
      if (seleccion.ciudad.length > 255 || seleccion.departamento.length > 255) return 'Máximo 255 caracteres';
      return '';
    }
  }
};

const validarCampo = (campo: CampoFormulario): void => {
  const error = validarValor(campo);
  if (error) {
    errores.value[campo] = error;
  } else {
    delete errores.value[campo];
  }
};

const CAMPOS: CampoFormulario[] = [
  'tipo_documento', 'numero_documento', 'nombres', 'apellidos', 'dob',
  'correo', 'celular_1', 'celular_2', 'ciudad',
];

/** Marca todos los errores. Devuelve si el formulario se puede enviar. */
const validarTodo = (): boolean => {
  // Lo oculto (ya es cliente) no se valida: lo completa el backend
  errores.value = {};
  CAMPOS.filter((campo) => campoVisible(campo)).forEach(validarCampo);
  return Object.keys(errores.value).length === 0;
};

// Un error ya visible se recalcula al tipear; los demás esperan al blur
watch(
  form,
  () => {
    (Object.keys(errores.value) as CampoFormulario[]).forEach(validarCampo);
  },
  { deep: true },
);

/* ------------------------------------------------------------------ *
 * Cliente que ya existe
 *
 * Con el tipo y número de documento se busca si quien compra ya es cliente. Si lo es
 * y confirma, la venta se gestiona con su `cliente_id`: el backend toma sus datos de
 * la última venta, así que los campos personales se ocultan y solo se le muestra un
 * resumen enmascarado. Si a esa venta le falta algo, el backend dice qué y solo eso
 * se pide.
 * ------------------------------------------------------------------ */

const {
  buscando: buscandoCliente,
  encontrado: clienteEncontrado,
  confirmado: clienteConfirmado,
  programarBusqueda,
  confirmar,
  descartar,
  documentoCambio,
} = useClienteExistente();

const CAMPOS_PERSONALES: CampoFormulario[] = [
  'nombres', 'apellidos', 'dob', 'correo', 'celular_1', 'celular_2', 'ciudad',
];

/** Lo que pidió el backend porque la última venta del cliente no lo tiene */
const camposFaltantes = ref<CampoFormulario[]>([]);

const campoVisible = (campo: CampoFormulario): boolean =>
  !clienteConfirmado.value || !CAMPOS_PERSONALES.includes(campo) || camposFaltantes.value.includes(campo);

/** Al terminar de llenar el documento (blur / cambio de tipo) se busca el cliente */
const alSalirDeDocumento = (campo: 'tipo_documento' | 'numero_documento'): void => {
  validarCampo(campo);
  if (validarValor('tipo_documento') || validarValor('numero_documento')) return;
  programarBusqueda(form.value.tipo_documento, form.value.numero_documento);
};

/**
 * Lo personal que haya en el formulario se borra al dejar de comprar como ese
 * cliente: puede ser lo que trajo la venta ya gestionada con sus datos.
 */
const limpiarDatosPersonales = (): void => {
  const vacio = formularioVacio();
  CAMPOS_PERSONALES.forEach((campo) => {
    (form.value as Record<CampoFormulario, unknown>)[campo] = vacio[campo];
    delete errores.value[campo];
  });
  camposFaltantes.value = [];
};

const confirmarCliente = (): void => {
  if (!confirmar()) return;
  camposFaltantes.value = [];
  CAMPOS_PERSONALES.forEach((campo) => delete errores.value[campo]);
};

const descartarCliente = (): void => {
  if (clienteConfirmado.value) limpiarDatosPersonales();
  descartar();
};

// Otro documento: el cliente encontrado con el anterior ya no corresponde. Si el
// formulario se rehízo con los datos de la venta, esos datos no se borran.
watch(
  () => [form.value, form.value.tipo_documento, form.value.numero_documento] as const,
  ([formulario, tipo, numero], [formularioAnterior]) => {
    if (!documentoCambio(tipo, numero)) return;
    if (formulario === formularioAnterior) limpiarDatosPersonales();
    else camposFaltantes.value = [];
  },
);

/** "ciudad, departamento" del backend → los campos del formulario (la ciudad lleva ambos) */
const aCamposFormulario = (campos: string[]): CampoFormulario[] => {
  const mapeados = campos.map((campo) => (campo === 'departamento' ? 'ciudad' : campo));
  return [...new Set(mapeados)].filter((campo): campo is CampoFormulario =>
    (CAMPOS as string[]).includes(campo),
  );
};

/** Ya es cliente: el documento, el cliente_id y solo lo que el backend pidió, sin vacíos */
const bodyConCliente = (ventaId: string, clienteId: string): GestionarVentaConvenioConClienteInput => {
  const body: GestionarVentaConvenioConClienteInput = {
    venta_id: ventaId,
    cliente_id: clienteId,
    tipo_documento: form.value.tipo_documento,
    numero_documento: form.value.numero_documento.trim(),
  };

  camposFaltantes.value.forEach((campo) => {
    if (campo === 'ciudad') {
      const ubicacion = ciudadSeleccionada.value;
      if (ubicacion) Object.assign(body, ubicacion);
      return;
    }
    const valor = form.value[campo];
    const texto = typeof valor === 'string' ? valor.trim() : '';
    if (texto) (body as unknown as Record<string, string>)[campo] = texto;
  });

  return body;
};

const bodyCompleto = (ventaId: string): GestionarVentaConvenioInput => {
  const ubicacion = ciudadSeleccionada.value!;
  const celular2 = form.value.celular_2.trim();

  return {
    venta_id: ventaId,
    dob: form.value.dob,
    tipo_documento: form.value.tipo_documento,
    numero_documento: form.value.numero_documento.trim(),
    nombres: form.value.nombres.trim(),
    apellidos: form.value.apellidos.trim(),
    ciudad: ubicacion.ciudad,
    departamento: ubicacion.departamento,
    correo: form.value.correo.trim(),
    celular_1: form.value.celular_1.trim(),
    celular_2: celular2 || null,
  };
};

/**
 * Los 422 del backend empiezan con el nombre del campo ("correo debe ser..."): si se
 * reconoce, el mensaje se marca en ese campo. `departamento` se muestra en la ciudad.
 */
const campoDeMensaje = (mensaje: string): CampoFormulario | null => {
  const primera = mensaje.trim().split(/\s+/)[0]?.toLowerCase() ?? '';
  if (primera === 'departamento') return 'ciudad';
  return (CAMPOS as string[]).includes(primera) ? (primera as CampoFormulario) : null;
};

const esNoEncontrada = (error: any): boolean =>
  axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 422);

const cargarVenta = async (): Promise<void> => {
  state.value = 'loading';
  errorCarga.value = '';
  try {
    venta.value = await VentasConveniosService.obtener(props.ventaId);
    llenarFormulario(venta.value);
    state.value = 'listo';
  } catch (error: any) {
    console.error('Error al cargar la venta de convenio:', error);
    if (esNoEncontrada(error)) {
      state.value = 'no-encontrada';
      return;
    }
    errorCarga.value = error?.response?.data?.message || 'Ocurrió un error inesperado. Intenta de nuevo.';
    state.value = 'error';
  }
};

/**
 * Vuelve a pedir la venta sin pasar por la pantalla de carga, para reflejar su estado
 * real después de un error del pago. Lo que el cliente tenga sin guardar se conserva.
 */
const refrescarVenta = async (): Promise<VentaConvenioDetalle | null> => {
  try {
    venta.value = await VentasConveniosService.obtener(props.ventaId);
    return venta.value;
  } catch (error: any) {
    console.error('Error al recargar la venta de convenio:', error);
    if (esNoEncontrada(error)) state.value = 'no-encontrada';
    return null;
  }
};

const onPagada = (pagada: VentaConvenioDetalle, referencia: string | null): void => {
  venta.value = pagada;
  paymentId.value = referencia;
  pagoOcupado.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const guardar = async (): Promise<void> => {
  if (!venta.value || guardando.value || pagoOcupado.value) return;
  errorGuardado.value = '';
  if (!validarTodo()) return;

  const cliente = clienteConfirmado.value;
  const input = cliente
    ? bodyConCliente(venta.value.id, cliente.cliente_id)
    : bodyCompleto(venta.value.id);

  guardando.value = true;
  try {
    const actualizada = await VentasConveniosService.gestionar(input);

    // La respuesta ya trae la venta completa: no hace falta volver a pedirla
    venta.value = actualizada;
    llenarFormulario(actualizada);
    editando.value = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.add({
      severity: 'success',
      summary: 'Venta gestionada',
      detail: 'Los datos del cliente quedaron guardados.',
      life: 4000,
    });
  } catch (error: any) {
    console.error('Error al gestionar la venta de convenio:', error);
    const status = error?.response?.status;
    const mensaje: string = error?.response?.data?.message || '';

    const faltantes = cliente ? datosFaltantesCliente(error) : null;

    if (faltantes) {
      // Solo se piden esos campos; al reenviar va el mismo body con ellos
      camposFaltantes.value = aCamposFormulario(faltantes);
      errorGuardado.value = 'Faltan algunos datos para completar tu compra.';
    } else if (cliente && esClienteNoEncontrado(error)) {
      descartar();
      limpiarDatosPersonales();
      errorGuardado.value = 'No encontramos tus datos registrados. Completa el formulario para continuar.';
    } else if (status === 422) {
      errorGuardado.value = mensaje || 'Revisa los datos del formulario.';
      const campo = mensaje ? campoDeMensaje(mensaje) : null;
      if (campo) errores.value[campo] = mensaje;
    } else if (status === 404) {
      errorGuardado.value = mensaje || 'La venta ya no existe.';
    } else if (status === 409) {
      // Alguien cambió el estado mientras el formulario estaba abierto
      toast.add({
        severity: 'warn',
        summary: 'La venta cambió de estado',
        detail: mensaje || 'Esta venta ya no se puede gestionar.',
        life: 6000,
      });
      await cargarVenta();
    } else {
      errorGuardado.value = mensaje || 'No pudimos guardar los datos. Intenta de nuevo.';
    }
  } finally {
    guardando.value = false;
  }
};

const editarDatos = (): void => {
  if (pagoOcupado.value) return;
  editando.value = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/** Descarta lo editado y vuelve al pago con los datos guardados */
const cancelarEdicion = (): void => {
  if (venta.value) llenarFormulario(venta.value);
  errorGuardado.value = '';
  editando.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const volverInicio = () => {
  window.location.href = '/';
};

onMounted(cargarVenta);
</script>

<style scoped>
/* Encabezado, contenedor y botones: los mismos de PlanPurchaseFormStep */
.purchase-form-wrapper {
  min-height: 100vh;
  background: #f9fafb;
}

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

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
}

/* Datos del titular en solo lectura */
.desglose {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}

.desglose-titulo {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.linea {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;
  color: #374151;
}

.linea > span:first-child {
  color: #6b7280;
}

/* Vista de pago: resumen a la izquierda, pago a la derecha */
.pago-layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 3fr);
  gap: 2rem;
  align-items: start;
}

.resumen-lateral {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 1.5rem;
}

.resumen-card {
  padding: 1.5rem;
}

.resumen-card .linea {
  font-size: 0.9rem;
}

.resumen-card .linea > span:last-child {
  text-align: right;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.buscando-cliente {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.field-completo {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
}

.field :deep(.p-select),
.field :deep(.p-autocomplete),
.field :deep(.p-autocomplete-input) {
  width: 100%;
}

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

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 1024px) {
  .pago-layout {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .resumen-lateral {
    position: static;
  }
}
</style>
