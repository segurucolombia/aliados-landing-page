<template>
  <div class="space-y-4">
    <div class="text-center">
      <div class="mx-auto mb-3 w-14 h-14 rounded-full bg-primary-50 flex items-center justify-center" aria-hidden="true">
        <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 ref="titulo" tabindex="-1" class="text-xl font-bold text-gray-900 focus:outline-none">{{ tituloVisible }}</h3>
      <p v-if="emailActual" class="mt-2 text-gray-700">
        Te enviamos un correo a <strong class="break-all">{{ emailActual }}</strong>. Ábrelo para activar tu cuenta y continuar.
      </p>
      <p v-else-if="mensaje" class="mt-2 text-gray-700">{{ mensaje }}</p>
      <p v-if="correoNoEnviado" class="mt-2 text-sm text-amber-700">
        No pudimos enviar el correo en este momento. Usa "Reenviar correo".
      </p>
    </div>

    <!-- Sin credenciales en memoria (p. ej. enlace vencido): se piden para poder reenviar -->
    <form v-if="!credencialesDadas" ref="formCredenciales" novalidate class="space-y-3" @submit.prevent="reenviar()">
      <p class="text-sm text-gray-600">Para reenviarte el enlace, confirma tu documento y tu contraseña.</p>
      <ClubCampo id="club-reenvio-documento" v-model="documentoLocal" label="Número de documento" autocomplete="username" :maxlength="20" :error="erroresCred.documento" @blur="documentoLocal = limpiarDocumento(documentoLocal)" />
      <ClubCampo id="club-reenvio-clave" v-model="claveLocal" label="Contraseña" tipo="password" autocomplete="current-password" :maxlength="72" :error="erroresCred.clave" />
    </form>

    <div aria-live="polite" role="status">
      <p v-if="exito" class="bg-green-50 border-l-4 border-green-500 p-3 rounded text-sm text-green-800">{{ exito }}</p>
    </div>
    <div aria-live="assertive" role="alert">
      <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-800">
        <p>{{ error }}</p>
        <button v-if="ofrecerLogin" type="button" class="mt-2 font-semibold underline" @click="$emit('ir-a-login')">Iniciar sesión</button>
      </div>
    </div>

    <button
      type="button"
      :disabled="enviando"
      class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors"
      @click="reenviar()"
    >
      {{ enviando && !corrigiendo ? 'Enviando…' : 'Reenviar correo' }}
    </button>

    <div class="border-t border-gray-200 pt-4">
      <button
        v-if="!corrigiendo"
        type="button"
        class="w-full text-sm font-medium text-primary-700 hover:underline"
        :aria-expanded="corrigiendo ? 'true' : 'false'"
        aria-controls="club-corregir-correo"
        @click="abrirCorreccion"
      >
        ¿Escribiste mal tu correo? Corrígelo
      </button>
      <form v-else id="club-corregir-correo" ref="formCorreo" novalidate class="space-y-3" @submit.prevent="corregir">
        <ClubCampo id="club-correo-nuevo" v-model="emailNuevo" label="Correo correcto" tipo="email" inputmode="email" autocomplete="email" :error="errorEmailNuevo" />
        <div class="flex gap-2">
          <button type="button" class="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-lg hover:bg-gray-50" @click="corrigiendo = false">
            Cancelar
          </button>
          <button type="submit" :disabled="enviando" class="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg">
            {{ enviando ? 'Enviando…' : 'Enviar a este correo' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref } from 'vue';
import ClubCampo from './ClubCampo.vue';
import { ClubError, ClubService } from '../../services/club.service';
import { enfocarPrimerError, limpiarDocumento, validarEmail } from '../../utils/clubValidaciones';

/**
 * El documento y la clave llegan del formulario que se acaba de enviar y solo viven
 * en memoria mientras el modal está abierto. Nunca se guardan en localStorage.
 */
const props = withDefaults(defineProps<{
  email?: string;
  numeroDocumento?: string;
  clave?: string;
  titulo?: string;
  mensaje?: string;
  correoEnviado?: boolean;
}>(), {
  email: '',
  numeroDocumento: '',
  clave: '',
  titulo: '',
  mensaje: '',
  correoEnviado: true,
});

defineEmits<{ (e: 'ir-a-login'): void }>();

const titulo = ref<HTMLElement | null>(null);
const formCredenciales = ref<HTMLFormElement | null>(null);
const formCorreo = ref<HTMLFormElement | null>(null);

const credencialesDadas = computed(() => !!(props.numeroDocumento && props.clave));
const documentoLocal = ref('');
const claveLocal = ref('');
const erroresCred = reactive<{ documento?: string; clave?: string }>({});

const emailActual = ref(props.email);
const correoNoEnviado = ref(!props.correoEnviado);
const tituloVisible = computed(() => props.titulo || 'Revisa tu correo');

const enviando = ref(false);
const exito = ref('');
const error = ref('');
const ofrecerLogin = ref(false);
const corrigiendo = ref(false);
const emailNuevo = ref('');
const errorEmailNuevo = ref('');

const credenciales = async (): Promise<{ documento: string; clave: string } | null> => {
  if (credencialesDadas.value) return { documento: props.numeroDocumento, clave: props.clave };
  documentoLocal.value = limpiarDocumento(documentoLocal.value);
  erroresCred.documento = documentoLocal.value ? undefined : 'Escribe tu número de documento.';
  erroresCred.clave = claveLocal.value ? undefined : 'Escribe tu contraseña.';
  if (erroresCred.documento || erroresCred.clave) {
    await enfocarPrimerError(formCredenciales.value);
    return null;
  }
  return { documento: documentoLocal.value, clave: claveLocal.value };
};

const reenviar = async (email?: string): Promise<boolean> => {
  exito.value = '';
  error.value = '';
  ofrecerLogin.value = false;
  const cred = await credenciales();
  if (!cred) return false;

  enviando.value = true;
  try {
    const res = await ClubService.reenviarActivacion(cred.documento, cred.clave, email);
    emailActual.value = res.data?.email || email || emailActual.value;
    correoNoEnviado.value = res.data?.correo_enviado === false;
    exito.value = res.message || `Listo. Te enviamos un nuevo enlace a ${emailActual.value}.`;
    return true;
  } catch (e) {
    const err = e instanceof ClubError ? e : null;
    error.value = err?.message || 'No pudimos reenviar el correo. Intenta de nuevo.';
    ofrecerLogin.value = err?.code === 'CUENTA_YA_ACTIVA';
    return false;
  } finally {
    enviando.value = false;
  }
};

const abrirCorreccion = async () => {
  corrigiendo.value = true;
  emailNuevo.value = '';
  errorEmailNuevo.value = '';
  await nextTick();
  document.getElementById('club-correo-nuevo')?.focus();
};

const corregir = async () => {
  errorEmailNuevo.value = validarEmail(emailNuevo.value);
  if (errorEmailNuevo.value) {
    await enfocarPrimerError(formCorreo.value);
    return;
  }
  if (await reenviar(emailNuevo.value.trim())) corrigiendo.value = false;
};

onMounted(() => titulo.value?.focus());
</script>
