<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
          </div>
          <h2 class="text-lg font-bold text-gray-900">Registro de Aliado</h2>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Error global -->
      <div v-if="errorGlobal" class="mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 flex-shrink-0 mt-0.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        {{ errorGlobal }}
      </div>

      <form @submit.prevent="handleSubmit" class="px-6 pb-6 pt-4 space-y-6">

        <!-- SECCIÓN: Información Personal -->
        <div>
          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            <h3 class="font-semibold text-gray-800 text-sm">Información Personal</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Nombre completo -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Nombre completo <span class="text-red-500">*</span></label>
              <input
                v-model="form.persona.nombre"
                type="text"
                placeholder="Ingrese el nombre"
                class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                :class="errors.nombre ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
              />
              <p v-if="errors.nombre" class="text-red-500 text-xs mt-1">{{ errors.nombre }}</p>
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Teléfono <span class="text-red-500">*</span></label>
              <input
                v-model="form.persona.telefono"
                type="tel"
                placeholder="Ingrese el teléfono"
                class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                :class="errors.telefono ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
              />
              <p v-if="errors.telefono" class="text-red-500 text-xs mt-1">{{ errors.telefono }}</p>
            </div>

            <!-- Correo electrónico -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Correo electrónico <span class="text-red-500">*</span></label>
              <input
                v-model="form.persona.email"
                type="email"
                placeholder="correo@ejemplo.com"
                class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                :class="errors.email ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
              />
              <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
            </div>

            <!-- Dirección -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Dirección</label>
              <input
                v-model="form.direccion"
                type="text"
                placeholder="Ingrese la dirección"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors"
              />
            </div>

            <!-- Tipo de documento -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Tipo de documento <span class="text-red-500">*</span></label>
              <div class="relative">
                <select
                  v-model="form.tipo_identificacion"
                  class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none appearance-none transition-colors"
                  :class="errors.tipo_identificacion ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
                >
                  <option value="" disabled>Seleccione tipo</option>
                  <option v-for="doc in DOCUMENT_TYPES" :key="doc.tipo" :value="doc.tipo">{{ doc.nombre }}</option>
                </select>
                <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
              <p v-if="errors.tipo_identificacion" class="text-red-500 text-xs mt-1">{{ errors.tipo_identificacion }}</p>
            </div>

            <!-- Número de documento -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Número de documento <span class="text-red-500">*</span></label>
              <input
                v-model="form.numero_identificacion"
                type="text"
                placeholder="Ingrese el número"
                class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                :class="errors.numero_identificacion ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
              />
              <p v-if="errors.numero_identificacion" class="text-red-500 text-xs mt-1">{{ errors.numero_identificacion }}</p>
            </div>
          </div>
        </div>

        <!-- SECCIÓN: Datos de Usuario -->
        <div>
          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
            </svg>
            <h3 class="font-semibold text-gray-800 text-sm">Datos de Usuario</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Usuario (auto-generado) -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Usuario <span class="text-red-500">*</span></label>
              <input
                :value="usuarioGenerado"
                type="text"
                disabled
                placeholder="Se genera automáticamente"
                class="w-full border border-gray-200 bg-gray-100 rounded-lg px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed"
              />
              <p class="text-gray-400 text-xs mt-1">Se genera automáticamente a partir del número de documento</p>
            </div>

            <!-- Contraseña -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">Contraseña <span class="text-red-500">*</span></label>
              <div class="relative">
                <input
                  v-model="form.usuario.clave"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Ingrese la contraseña"
                  class="w-full border rounded-lg px-3 py-2.5 pr-10 text-sm outline-none transition-colors"
                  :class="errors.clave ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-gray-300 focus:border-primary-500'"
                />
                <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.clave" class="text-red-500 text-xs mt-1">{{ errors.clave }}</p>
            </div>

            <!-- Ciudad -->
            <div class="relative" ref="ciudadRef">
              <label class="block text-sm text-gray-700 mb-1">Ciudad</label>
              <div class="flex">
                <input
                  v-model="ciudadSearch"
                  type="text"
                  placeholder="Buscar ciudad..."
                  autocomplete="off"
                  @input="onCiudadInput"
                  @focus="showCiudadDropdown = true"
                  class="w-full border border-gray-300 rounded-l-lg px-3 py-2.5 text-sm outline-none focus:border-primary-500 transition-colors"
                />
                <button type="button" @click="showCiudadDropdown = !showCiudadDropdown" class="px-3 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
              <div v-if="showCiudadDropdown && ciudadesFiltradas.length > 0" class="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-44 overflow-y-auto">
                <button
                  v-for="ciudad in ciudadesFiltradas"
                  :key="ciudad.id"
                  type="button"
                  @click="seleccionarCiudad(ciudad)"
                  class="w-full text-left px-4 py-2.5 text-sm hover:bg-primary-50 hover:text-primary-700 transition-colors"
                >
                  {{ ciudad.nombre }}
                </button>
              </div>
              <div v-if="showCiudadDropdown && buscandoCiudad" class="absolute z-20 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-1 px-4 py-3 text-sm text-gray-400">
                Buscando...
              </div>
            </div>

            <!-- Aliado Padre (código) -->
            <div>
              <label class="block text-sm text-gray-700 mb-1">
                Referido por
                <span class="text-gray-400 font-normal">(Opcional)</span>
                <span v-if="codigoPadrePrellenado" class="ml-2 inline-flex items-center gap-1 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-3 h-3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                  Desde enlace
                </span>
              </label>
              <div class="relative">
                <input
                  :value="codigoPadre"
                  @input="onCodigoPadreInput"
                  @blur="buscarAliadoPadre"
                  type="text"
                    maxlength="20"
                  autocomplete="off"
                  class="w-full border rounded-lg px-3 py-2.5 text-sm outline-none transition-colors font-mono tracking-wider"
                  :class="[
                    aliadoPadreNombre ? 'border-green-400 bg-green-50 focus:border-green-500' :
                    aliadoPadreError  ? 'border-red-300 bg-red-50 focus:border-red-400' :
                    codigoPadrePrellenado ? 'bg-primary-50 border-primary-200 focus:border-primary-500' :
                    'border-gray-300 focus:border-primary-500'
                  ]"
                />
                <div v-if="buscandoAliadoPadre" class="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg class="w-4 h-4 animate-spin text-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </div>
              </div>

              <!-- Mensaje aliado encontrado -->
              <div v-if="aliadoPadreNombre" class="mt-2 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 flex-shrink-0">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Tu aliado asociado es <span class="font-semibold ml-1">{{ aliadoPadreNombre }}</span>
              </div>

              <!-- Mensaje aliado no encontrado -->
              <p v-else-if="aliadoPadreError" class="mt-1 text-red-500 text-xs">{{ aliadoPadreError }}</p>

              <p v-else class="text-gray-400 text-xs mt-1">Solo mayúsculas y números, sin espacios</p>
            </div>
          </div>
        </div>

        <!-- Términos y condiciones -->
        <div class="pt-2">
          <label class="flex items-start gap-3 cursor-pointer group">
            <input
              :checked="aceptaTerminos"
              @change="onAceptaTerminosChange"
              type="checkbox"
              class="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 accent-primary-600 flex-shrink-0 cursor-pointer"
            />
            <span class="text-sm text-gray-600 leading-relaxed">
              He leído y acepto los
              <a
                href="/terminos-y-condiciones-aliados"
                target="_blank"
                class="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2"
              >
                Términos y Condiciones del Programa de Afiliados SEGURU
              </a>
            </span>
          </label>
          <p v-if="errors.terminos" class="text-red-500 text-xs mt-1 ml-7">{{ errors.terminos }}</p>
        </div>

        <!-- Acciones -->
        <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button
            type="button"
            @click="$emit('close')"
            class="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !aceptaTerminos"
            class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isSubmitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ isSubmitting ? 'Creando...' : 'Crear Aliado' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Swal from 'sweetalert2';
import { AliadosService, type Aliado, type CondicionVentaInput } from '../services/aliados.service';
import { CiudadesColombiaService, type Ciudad } from '../services/ciudades-colombia.service';
import { DOCUMENT_TYPES } from '../utils/documentTypes';


const emit = defineEmits<{
  close: [];
  created: [aliado: Aliado];
}>();

// ── Form state ───────────────────────────────────────────────────────────────
const form = ref({
  tipo_identificacion: '',
  numero_identificacion: '',
  direccion: '',
  ciudad_id: undefined as number | undefined,
  usuario: { clave: '' },
  persona: { nombre: '', email: '', telefono: '' },
});

const errors = ref<Record<string, string>>({});
const errorGlobal = ref('');
const isSubmitting = ref(false);
const showPassword = ref(false);
const aceptaTerminos = ref(false);
const condicionAceptada = ref<CondicionVentaInput | null>(null);

async function onAceptaTerminosChange(e: Event) {
  const checked = (e.target as HTMLInputElement).checked;
  aceptaTerminos.value = checked;
  if (!checked) {
    condicionAceptada.value = null;
    return;
  }
  let ip = '';
  try {
    const res = await fetch('https://api.ipify.org?format=json');
    const data = await res.json();
    ip = data.ip ?? '';
  } catch {
    ip = '';
  }
  condicionAceptada.value = {
    ip,
    condicion: 'Términos y Condiciones del Programa de Afiliados SEGURU',
    created_at: new Date().toISOString(),
  };
}

// ── Usuario auto-generado ────────────────────────────────────────────────────
const usuarioGenerado = computed(() =>
  form.value.numero_identificacion.trim().toLowerCase().replace(/\s+/g, '_') || ''
);

// ── Código aliado padre ──────────────────────────────────────────────────────
const codigoPadre = ref('');
const codigoPadrePrellenado = ref(false);
const aliadoPadreId = ref('');
const aliadoPadreNombre = ref('');
const aliadoPadreError = ref('');
const buscandoAliadoPadre = ref(false);

onMounted(async () => {
  const stored = localStorage.getItem('codigo_padre_aliado');
  if (stored) {
    codigoPadre.value = stored;
    codigoPadrePrellenado.value = true;
    await buscarAliadoPadre();
  }
});

function onCodigoPadreInput(e: Event) {
  const raw = (e.target as HTMLInputElement).value;
  const sanitized = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
  codigoPadre.value = sanitized;
  (e.target as HTMLInputElement).value = sanitized;
  codigoPadrePrellenado.value = false;
  aliadoPadreId.value = '';
  aliadoPadreNombre.value = '';
  aliadoPadreError.value = '';
}

async function buscarAliadoPadre() {
  if (!codigoPadre.value) return;
  buscandoAliadoPadre.value = true;
  aliadoPadreId.value = '';
  aliadoPadreNombre.value = '';
  aliadoPadreError.value = '';
  try {
    const aliado = await AliadosService.encontrarAliado({ codigo_unico: codigoPadre.value });
    if (aliado) {
      aliadoPadreId.value = aliado.id;
      aliadoPadreNombre.value = aliado.usuario?.persona?.nombre ?? aliado.usuario?.usuario ?? codigoPadre.value;
    } else {
      aliadoPadreError.value = 'No se encontró ningún aliado con ese código';
    }
  } catch (err) {
    aliadoPadreError.value = err instanceof Error ? err.message : 'Error al buscar el aliado';
  } finally {
    buscandoAliadoPadre.value = false;
  }
}

// ── Ciudad ───────────────────────────────────────────────────────────────────
const ciudadSearch = ref('');
const ciudadesFiltradas = ref<Ciudad[]>([]);
const showCiudadDropdown = ref(false);
const buscandoCiudad = ref(false);
const ciudadRef = ref<HTMLElement>();
let ciudadTimer: ReturnType<typeof setTimeout>;

function onCiudadInput() {
  form.value.ciudad_id = undefined;
  clearTimeout(ciudadTimer);
  if (!ciudadSearch.value.trim()) { ciudadesFiltradas.value = []; return; }
  buscandoCiudad.value = true;
  ciudadTimer = setTimeout(async () => {
    try {
      const res = await CiudadesColombiaService.buscarPorNombre(ciudadSearch.value, 8);
      ciudadesFiltradas.value = res.data;
    } finally {
      buscandoCiudad.value = false;
    }
  }, 300);
}

function seleccionarCiudad(ciudad: Ciudad) {
  form.value.ciudad_id = ciudad.id;
  ciudadSearch.value = ciudad.nombre;
  showCiudadDropdown.value = false;
  ciudadesFiltradas.value = [];
}

// ── Cerrar dropdown ciudad al hacer click fuera ───────────────────────────────
function onClickOutside(e: MouseEvent) {
  if (ciudadRef.value && !ciudadRef.value.contains(e.target as Node)) {
    showCiudadDropdown.value = false;
  }
}
onMounted(() => document.addEventListener('mousedown', onClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside));

// ── Validación ───────────────────────────────────────────────────────────────
function validate(): boolean {
  errors.value = {};
  const f = form.value;

  if (!f.persona.nombre || f.persona.nombre.length < 2) errors.value.nombre = 'El nombre es requerido (mínimo 2 caracteres)';
  if (!f.persona.telefono) errors.value.telefono = 'El teléfono es requerido';
  if (!f.persona.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.persona.email)) errors.value.email = 'El email es requerido';
  if (!f.tipo_identificacion) errors.value.tipo_identificacion = 'El tipo de documento es requerido';
  if (!f.numero_identificacion || f.numero_identificacion.length < 3) errors.value.numero_identificacion = 'El número de documento es requerido';
  if (!f.usuario.clave || f.usuario.clave.length < 6) errors.value.clave = 'La contraseña debe tener al menos 6 caracteres';
  if (!aceptaTerminos.value) errors.value.terminos = 'Debes aceptar los términos y condiciones para continuar';

  return Object.keys(errors.value).length === 0;
}

// ── Submit ────────────────────────────────────────────────────────────────────
async function handleSubmit() {
  errorGlobal.value = '';
  if (!validate()) return;

  isSubmitting.value = true;

  // Resolver padre_id: revalidar si el usuario ingresó un código
  let padreIdFinal: string | undefined;

  if (codigoPadre.value) {
    try {
      const aliadoValidado = await AliadosService.encontrarAliado({ codigo_unico: codigoPadre.value });

      if (aliadoValidado) {
        padreIdFinal = aliadoValidado.id;
      } else {
        // Código inválido → preguntar si continúa sin aliado padre
        isSubmitting.value = false;
        const { isConfirmed } = await Swal.fire({
          title: 'Código de aliado no válido',
          text: `El código "${codigoPadre.value}" no corresponde a ningún aliado registrado. ¿Deseas continuar el registro sin aliado padre?`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar sin aliado',
          cancelButtonText: 'Volver y corregir',
          confirmButtonColor: '#2563eb',
          cancelButtonColor: '#6b7280',
          reverseButtons: true,
        });

        if (!isConfirmed) return;
        // Continúa sin padre_id
        isSubmitting.value = true;
      }
    } catch {
      isSubmitting.value = false;
      const { isConfirmed } = await Swal.fire({
        title: 'No se pudo verificar el aliado',
        text: 'Ocurrió un error al verificar el código de aliado. ¿Deseas continuar el registro sin aliado padre?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, continuar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        reverseButtons: true,
      });

      if (!isConfirmed) return;
      isSubmitting.value = true;
    }
  }

  try {
    const dto = {
      tipo_identificacion: form.value.tipo_identificacion,
      numero_identificacion: form.value.numero_identificacion,
      ...(form.value.direccion && { direccion: form.value.direccion }),
      ...(form.value.ciudad_id && { ciudad_id: form.value.ciudad_id }),
      ...(padreIdFinal && { padre_id: padreIdFinal }),
      condiciones: condicionAceptada.value ? [condicionAceptada.value] : [],
      usuario: {
        usuario: usuarioGenerado.value,
        clave: form.value.usuario.clave,
      },
      persona: {
        nombre: form.value.persona.nombre,
        email: form.value.persona.email,
        ...(form.value.persona.telefono && { telefono: form.value.persona.telefono }),
      },
    };

    const aliado = await AliadosService.create(dto);

    localStorage.removeItem('codigo_padre_aliado');

    await Swal.fire({
      title: '¡Registro exitoso!',
      html: `Tu cuenta de Afiliado ha sido creada.<br><strong>${form.value.persona.nombre}</strong>, ya puedes iniciar sesión y comenzar a compartir tu enlace.`,
      icon: 'success',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#2563eb',
    });

    emit('created', aliado);
  } catch (err) {
    errorGlobal.value = err instanceof Error ? err.message : 'Ocurrió un error al crear el aliado';
  } finally {
    isSubmitting.value = false;
  }
}
</script>
