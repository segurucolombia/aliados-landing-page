<template>
  <main class="min-h-[70vh] bg-gray-50 py-10 px-4">
    <div class="max-w-md mx-auto bg-white rounded-2xl shadow-sm p-6 sm:p-8">
      <!-- Activando -->
      <div v-if="estado === 'cargando'" class="text-center py-8" role="status" aria-live="polite">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 mx-auto mb-4" aria-hidden="true"></div>
        <p class="text-gray-700">Estamos activando tu cuenta…</p>
      </div>

      <!-- Activada: queda con sesión iniciada -->
      <div v-else-if="estado === 'exito'" class="text-center">
        <div class="mx-auto mb-4 w-16 h-16 rounded-full bg-green-50 flex items-center justify-center" aria-hidden="true">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 ref="titulo" tabindex="-1" class="text-2xl font-extrabold text-gray-900 focus:outline-none">
          ¡Ya eres parte del Club{{ saludo ? `, ${saludo}` : '' }}!
        </h1>
        <p class="mt-2 text-gray-600">Tu cuenta está activa y ya iniciaste sesión.</p>
        <button
          type="button"
          class="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
          @click="continuar"
        >
          Continuar a contratar
        </button>
      </div>

      <!-- Enlace vencido, reemplazado o inválido: se pide uno nuevo -->
      <div v-else-if="estado === 'reenviar'">
        <div aria-live="assertive" role="alert" class="mb-4 bg-amber-50 border-l-4 border-amber-500 p-3 rounded text-sm text-amber-900">
          {{ mensajeError }}
        </div>
        <ClubCorreoEnviado titulo="Pide un nuevo enlace" @ir-a-login="iniciarSesion" />
        <button type="button" class="mt-4 w-full text-sm font-medium text-primary-700 hover:underline" @click="iniciarSesion">
          ¿Ya activaste tu cuenta? Inicia sesión
        </button>
      </div>

      <!-- La cuenta ya estaba activa -->
      <div v-else-if="estado === 'ya-activa'" class="text-center">
        <h1 ref="titulo" tabindex="-1" class="text-2xl font-extrabold text-gray-900 focus:outline-none">Tu cuenta ya está activa</h1>
        <p class="mt-2 text-gray-600" role="alert">{{ mensajeError }}</p>
        <button
          type="button"
          class="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
          @click="iniciarSesion"
        >
          Iniciar sesión
        </button>
      </div>

      <!-- Otro error (red, servidor) -->
      <div v-else class="text-center">
        <h1 ref="titulo" tabindex="-1" class="text-2xl font-extrabold text-gray-900 focus:outline-none">No pudimos activar tu cuenta</h1>
        <p class="mt-2 text-gray-600" role="alert">{{ mensajeError }}</p>
        <button
          v-if="tokenActual"
          type="button"
          class="mt-6 w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors"
          @click="activar"
        >
          Intentar de nuevo
        </button>
        <a :href="whatsappUrl('Hola, tengo problemas para activar mi cuenta del Club SEGURU.')" target="_blank" rel="noopener noreferrer" class="mt-3 inline-block text-sm font-medium text-primary-700 hover:underline">
          Escríbenos por WhatsApp
        </a>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import ClubCorreoEnviado from './ClubCorreoEnviado.vue';
import useClubSesion, { primerNombre } from '../../composables/clubSesion';
import useClubModal, { leerRetorno, limpiarRetorno } from '../../composables/clubModal';
import { ClubError, ClubService } from '../../services/club.service';
import { whatsappUrl } from '../../config/club';

type Estado = 'cargando' | 'exito' | 'reenviar' | 'ya-activa' | 'error';

const sesion = useClubSesion();
const { abrir } = useClubModal();

const estado = ref<Estado>('cargando');
const mensajeError = ref('');
const titulo = ref<HTMLElement | null>(null);
const tokenActual = ref('');
const saludo = computed(() => primerNombre(sesion.nombre.value));

const enfocarTitulo = async () => {
  await nextTick();
  titulo.value?.focus();
};

const activar = async () => {
  estado.value = 'cargando';
  try {
    sesion.iniciarSesion(await ClubService.activarCuenta(tokenActual.value));
    estado.value = 'exito';
  } catch (error) {
    const err = error instanceof ClubError ? error : null;
    mensajeError.value = err?.message || 'Ocurrió un error inesperado. Intenta de nuevo en unos minutos.';
    switch (err?.code) {
      case 'TOKEN_VENCIDO':
      case 'TOKEN_REEMPLAZADO':
      case 'TOKEN_INVALIDO':
        estado.value = 'reenviar';
        break;
      case 'CUENTA_YA_ACTIVA':
        estado.value = 'ya-activa';
        break;
      default:
        estado.value = 'error';
    }
  }
  await enfocarTitulo();
};

const continuar = () => {
  const destino = leerRetorno();
  limpiarRetorno();
  window.location.href = destino;
};

const iniciarSesion = () => {
  abrir({ pestana: 'miembro', alIniciarSesion: continuar });
};

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  tokenActual.value = params.get('token') ?? '';

  // El token es de un solo uso: se quita de la URL (y del historial) apenas se lee
  if (tokenActual.value) {
    params.delete('token');
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));
    activar();
  } else {
    mensajeError.value = 'El enlace de activación no es válido. Pide uno nuevo.';
    estado.value = 'reenviar';
  }
});
</script>
