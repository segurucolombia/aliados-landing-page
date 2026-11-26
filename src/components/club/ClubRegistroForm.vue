<template>
  <form ref="formulario" novalidate class="space-y-4" @submit.prevent="enviar">
    <!-- Paso 1: tipo de registro. Define qué campos se piden debajo. -->
    <fieldset>
      <legend class="block text-sm font-medium text-gray-700 mb-2">¿Cómo te vas a registrar?<span class="text-red-600" aria-hidden="true"> *</span></legend>
      <div class="grid grid-cols-2 gap-3">
        <label
          v-for="opcion in OPCIONES_PERSONA"
          :key="opcion.valor"
          class="flex flex-col items-center justify-center gap-0.5 cursor-pointer rounded-lg border-2 px-3 py-3 text-center transition-colors focus-within:ring-2 focus-within:ring-primary-500"
          :class="form.tipo_persona === opcion.valor ? 'border-primary-600 bg-primary-50 text-primary-800' : 'border-gray-200 text-gray-700 hover:border-gray-300'"
        >
          <input v-model="form.tipo_persona" type="radio" :value="opcion.valor" name="club-tipo-persona" class="sr-only" />
          <span class="font-semibold">{{ opcion.titulo }}</span>
          <span class="text-xs text-gray-500">{{ opcion.detalle }}</span>
        </label>
      </div>
    </fieldset>

    <!-- Persona jurídica: primero los datos de la empresa -->
    <template v-if="esJuridica">
      <h3 class="text-sm font-semibold text-gray-900 border-t border-gray-200 pt-4">Datos de la empresa</h3>
      <div class="grid grid-cols-1 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-4">
        <ClubCampo id="club-empresa" v-model="form.empresa_nombre" label="Razón social" autocomplete="organization" :maxlength="150" :error="errores.empresa_nombre" />
        <ClubCampo id="club-nit" v-model="form.nit" label="NIT" :maxlength="20" ayuda="Sin puntos ni dígito de verificación." :error="errores.nit" @blur="form.nit = limpiarDocumento(form.nit)" />
      </div>
    </template>

    <h3 class="text-sm font-semibold text-gray-900 border-t border-gray-200 pt-4">
      {{ esJuridica ? 'Datos del representante' : 'Tus datos' }}
    </h3>
    <p v-if="esJuridica" class="-mt-3 text-xs text-gray-500">La persona que administrará la cuenta de la empresa en el Club.</p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ClubCampo id="club-nombres" v-model="form.nombres" label="Nombres" autocomplete="given-name" :maxlength="100" :error="errores.nombres" />
      <ClubCampo id="club-apellidos" v-model="form.apellidos" label="Apellidos" autocomplete="family-name" :maxlength="100" :error="errores.apellidos" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4">
      <div>
        <label for="club-tipo-documento" class="block text-sm font-medium text-gray-700 mb-1">
          Tipo de documento<span class="text-red-600" aria-hidden="true"> *</span>
        </label>
        <select
          id="club-tipo-documento"
          v-model="form.tipo_documento"
          required
          class="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option v-for="doc in CLUB_DOCUMENT_TYPES" :key="doc.tipo" :value="doc.tipo">{{ doc.tipo }} · {{ doc.nombre }}</option>
        </select>
      </div>
      <ClubCampo
        id="club-documento"
        v-model="form.numero_documento"
        label="Número de documento"
        autocomplete="username"
        :maxlength="20"
        ayuda="Sin puntos. Es tu usuario para entrar al Club."
        :error="errores.numero_documento"
        @blur="form.numero_documento = limpiarDocumento(form.numero_documento)"
      />
    </div>

    <ClubCampo id="club-email" v-model="form.email" label="Correo" tipo="email" inputmode="email" autocomplete="email" :error="errores.email" ayuda="Te enviaremos un enlace para activar tu cuenta." />

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ClubCampo id="club-telefono" v-model="form.telefono" label="WhatsApp" tipo="tel" inputmode="tel" autocomplete="tel-national" :maxlength="15" :error="errores.telefono" />

      <!-- Contraseña automática = número de documento. Solo informativa, no editable. -->
      <div>
        <label for="club-clave" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
        <div class="relative">
          <input
            id="club-clave"
            type="text"
            :value="claveAutomatica"
            readonly
            tabindex="-1"
            placeholder="Igual a tu documento"
            aria-describedby="club-clave-ayuda"
            class="w-full border border-gray-200 rounded-lg pl-3 pr-10 py-2.5 bg-gray-100 text-gray-600 cursor-not-allowed focus:outline-none"
          />
          <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clip-rule="evenodd" />
          </svg>
        </div>
        <p id="club-clave-ayuda" class="mt-1 text-xs text-gray-500">Se crea automáticamente con tu número de documento.</p>
      </div>
    </div>

    <!-- Autorizaciones: empiezan sin marcar y van separadas -->
    <div class="space-y-3 border-t border-gray-200 pt-4">
      <div>
        <label class="flex items-start gap-3 text-sm text-gray-800">
          <input
            id="club-acepta-datos"
            v-model="form.acepta_tratamiento_datos"
            type="checkbox"
            class="mt-0.5 w-4 h-4 flex-shrink-0 accent-primary-600"
            :aria-invalid="errores.acepta_tratamiento_datos ? 'true' : 'false'"
            :aria-describedby="errores.acepta_tratamiento_datos ? 'club-acepta-datos-error' : undefined"
          />
          <span>{{ CASILLAS.tratamiento }}<span class="text-red-600" aria-hidden="true"> *</span></span>
        </label>
        <p v-if="errores.acepta_tratamiento_datos" id="club-acepta-datos-error" class="mt-1 ml-7 text-sm text-red-600">
          {{ errores.acepta_tratamiento_datos }}
        </p>
      </div>
      <label class="flex items-start gap-3 text-sm text-gray-800">
        <input v-model="form.acepta_compartir_aseguradoras" type="checkbox" class="mt-0.5 w-4 h-4 flex-shrink-0 accent-primary-600" />
        <span>{{ CASILLAS.aseguradoras }}</span>
      </label>

      <details class="text-sm text-gray-700 bg-gray-50 rounded-lg">
        <summary class="cursor-pointer px-3 py-2 font-medium text-primary-700">{{ AUTORIZACION_COMPLETA.titulo }}</summary>
        <div class="px-3 pb-3 space-y-2">
          <p>{{ AUTORIZACION_COMPLETA.responsable }}</p>
          <p class="font-semibold">{{ AUTORIZACION_COMPLETA.finalidadesTitulo }}</p>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="item in AUTORIZACION_COMPLETA.finalidades" :key="item">{{ item }}</li>
          </ul>
          <p>{{ AUTORIZACION_COMPLETA.noCondicion }}</p>
          <p class="font-semibold">{{ AUTORIZACION_COMPLETA.derechosTitulo }}</p>
          <ul class="list-disc pl-5 space-y-1">
            <li v-for="item in AUTORIZACION_COMPLETA.derechos" :key="item">{{ item }}</li>
          </ul>
          <p>{{ AUTORIZACION_COMPLETA.comoEjercer }}</p>
          <a :href="POLITICA_DATOS.url" target="_blank" rel="noopener noreferrer" class="inline-block font-medium text-primary-700 underline">
            {{ AUTORIZACION_COMPLETA.enlacePolitica }} (versión {{ POLITICA_DATOS.version }})
          </a>
        </div>
      </details>
    </div>

    <div aria-live="assertive" role="alert">
      <div v-if="errorGeneral" class="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-800">
        <p>{{ errorGeneral }}</p>
        <button v-if="accionError === 'login'" type="button" class="mt-2 font-semibold underline" @click="$emit('ir-a-login')">
          Iniciar sesión
        </button>
      </div>
    </div>

    <button
      type="submit"
      :disabled="enviando"
      class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
    >
      {{ enviando ? 'Creando tu cuenta…' : 'Unirme al Club gratis' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import ClubCampo from './ClubCampo.vue';
import { CLUB_DOCUMENT_TYPES } from '../../utils/documentTypes';
import { AUTORIZACION_COMPLETA, CASILLAS, POLITICA_DATOS } from '../../config/club';
import { ClubError, ClubService, type TipoDocumento, type TipoPersona } from '../../services/club.service';
import { enfocarPrimerError, limpiarDocumento, validarDocumento, validarEmail } from '../../utils/clubValidaciones';

/** Lo que el modal necesita para "Reenviar" o "Corregir el correo". Solo en memoria. */
export interface CredencialesPendientes {
  numero_documento: string;
  clave: string;
  email: string;
}

const props = defineProps<{ emailInicial?: string }>();

const emit = defineEmits<{
  (e: 'registrado', datos: CredencialesPendientes & { correoEnviado: boolean }): void;
  /** Ya se había registrado y no activó: el modal ofrece reenviar el enlace */
  (e: 'pendiente', datos: CredencialesPendientes & { mensaje: string }): void;
  (e: 'ir-a-login'): void;
}>();

const formulario = ref<HTMLFormElement | null>(null);
const enviando = ref(false);
const errorGeneral = ref('');
const accionError = ref<'login' | null>(null);

const form = reactive({
  nombres: '',
  apellidos: '',
  tipo_documento: 'CC' as TipoDocumento,
  numero_documento: '',
  email: props.emailInicial ?? '',
  telefono: '',
  tipo_persona: 'Natural' as TipoPersona,
  nit: '',
  empresa_nombre: '',
  acepta_tratamiento_datos: false,
  acepta_compartir_aseguradoras: false,
});

const OPCIONES_PERSONA: { valor: TipoPersona; titulo: string; detalle: string }[] = [
  { valor: 'Natural', titulo: 'Persona natural', detalle: 'A mi nombre' },
  { valor: 'Juridica', titulo: 'Empresa', detalle: 'Persona jurídica' },
];

const esJuridica = computed(() => form.tipo_persona === 'Juridica');

/** La contraseña inicial es el documento, tal como lo guarda el backend (sin puntos y en mayúsculas). */
const claveAutomatica = computed(() => limpiarDocumento(form.numero_documento).toUpperCase());

watch(() => props.emailInicial, (email) => {
  if (email) form.email = email;
});

type CampoError = keyof typeof form;
const errores = reactive<Partial<Record<CampoError, string>>>({});

const validar = (): boolean => {
  for (const clave of Object.keys(errores) as CampoError[]) delete errores[clave];

  form.numero_documento = limpiarDocumento(form.numero_documento);
  form.telefono = form.telefono.replace(/[\s\-()]/g, '');

  if (!form.nombres.trim()) errores.nombres = 'Escribe tus nombres.';
  if (!form.apellidos.trim()) errores.apellidos = 'Escribe tus apellidos.';
  const errorDoc = validarDocumento(form.numero_documento);
  if (errorDoc) errores.numero_documento = errorDoc;
  const errorEmail = validarEmail(form.email);
  if (errorEmail) errores.email = errorEmail;
  if (!form.telefono) errores.telefono = 'Escribe tu número de WhatsApp.';
  else if (!/^\+?\d{7,15}$/.test(form.telefono)) errores.telefono = 'Escribe solo números (de 7 a 15 dígitos).';
  if (esJuridica.value) {
    form.nit = limpiarDocumento(form.nit);
    if (!form.nit) errores.nit = 'Escribe el NIT de la empresa.';
    if (!form.empresa_nombre.trim()) errores.empresa_nombre = 'Escribe el nombre de la empresa.';
  }
  if (!form.acepta_tratamiento_datos) {
    errores.acepta_tratamiento_datos = 'Para unirte necesitamos tu autorización para tratar tus datos.';
  }
  return Object.keys(errores).length === 0;
};

const leerAliadoId = (): string | undefined => {
  try {
    return localStorage.getItem('aliado_id') || undefined;
  } catch {
    return undefined;
  }
};

const enviar = async () => {
  errorGeneral.value = '';
  accionError.value = null;
  if (!validar()) {
    await enfocarPrimerError(formulario.value);
    return;
  }

  const credenciales: CredencialesPendientes = {
    numero_documento: form.numero_documento,
    clave: claveAutomatica.value,
    email: form.email.trim(),
  };

  enviando.value = true;
  try {
    const aliadoId = leerAliadoId();
    const data = await ClubService.registrar({
      tipo_documento: form.tipo_documento,
      numero_documento: form.numero_documento,
      nombres: form.nombres.trim(),
      apellidos: form.apellidos.trim(),
      email: credenciales.email,
      telefono: form.telefono,
      tipo_persona: form.tipo_persona,
      nit: esJuridica.value ? form.nit : null,
      empresa_nombre: esJuridica.value ? form.empresa_nombre.trim() : null,
      ...(aliadoId && { aliado_id: aliadoId }),
      acepta_tratamiento_datos: true,
      acepta_compartir_aseguradoras: form.acepta_compartir_aseguradoras,
    });
    emit('registrado', { ...credenciales, email: data.email || credenciales.email, correoEnviado: data.correo_enviado });
  } catch (error) {
    const err = error instanceof ClubError ? error : new ClubError('No pudimos crear tu cuenta. Intenta de nuevo.', null, null);
    if (err.code === 'CUENTA_PENDIENTE_ACTIVACION') {
      emit('pendiente', { ...credenciales, mensaje: err.message });
      return;
    }
    errorGeneral.value = err.message;
    if (err.code === 'CUENTA_EXISTENTE') accionError.value = 'login';
  } finally {
    enviando.value = false;
  }
};
</script>
