<template>
  <Dialog
    :visible="visible"
    modal
    :draggable="false"
    :dismissable-mask="true"
    :style="{ width: '34rem' }"
    :breakpoints="{ '640px': '100vw' }"
    :pt="{ root: { class: 'club-modal' } }"
    aria-labelledby="club-modal-titulo"
    @update:visible="(v: boolean) => { if (!v) cerrarModal(); }"
  >
    <template #header>
      <div class="w-full">
        <!-- Pasos cuando la persona venía de "Contratar" -->
        <!-- Pasos "1 · Únete (gratis) → 2 · Elige y paga", como en el prototipo -->
        <ol v-if="intencion === 'contratar'" class="flex gap-1.5 text-xs sm:text-sm font-bold mb-3" aria-label="Pasos para contratar">
          <li class="flex-1 rounded-full px-2.5 py-1 text-center bg-primary-600 text-white" aria-current="step">
            1 · {{ CLUB.pasosContratar[0] }}
          </li>
          <li class="flex-1 rounded-full px-2.5 py-1 text-center bg-gray-100 text-gray-600">
            2 · {{ CLUB.pasosContratar[1] }}
          </li>
        </ol>
        <h2 id="club-modal-titulo" class="text-xl sm:text-2xl font-extrabold text-gray-900">{{ tituloModal }}</h2>
        <p v-if="vista === 'formulario'" class="mt-1 text-sm text-gray-600">{{ subtituloModal }}</p>
        <ul v-if="vista === 'formulario' && pestana === 'unirme'" class="mt-3 space-y-1.5 text-sm text-gray-800">
          <li v-for="b in CLUB.beneficiosModal" :key="b" class="flex gap-2">
            <span class="text-green-700 font-extrabold" aria-hidden="true">✓</span>{{ b }}
          </li>
        </ul>
      </div>
    </template>

    <!-- Registrado o pendiente de activar -->
    <ClubCorreoEnviado
      v-if="vista === 'correo'"
      :key="correo.clave + correo.email"
      :email="correo.email"
      :numero-documento="correo.numeroDocumento"
      :clave="correo.clave"
      :titulo="correo.titulo"
      :mensaje="correo.mensaje"
      :correo-enviado="correo.correoEnviado"
      @ir-a-login="irA('miembro')"
    />

    <div v-else>
      <div role="tablist" aria-label="Club SEGURU" class="grid grid-cols-2 bg-gray-100 rounded-lg p-1 mb-5">
        <button
          v-for="tab in tabs"
          :id="`club-tab-${tab.id}`"
          :key="tab.id"
          type="button"
          role="tab"
          :aria-selected="pestana === tab.id ? 'true' : 'false'"
          :aria-controls="`club-panel-${tab.id}`"
          :tabindex="pestana === tab.id ? 0 : -1"
          class="py-2 rounded-md text-sm font-semibold transition-colors"
          :class="pestana === tab.id ? 'bg-white text-primary-700 shadow' : 'text-gray-600 hover:text-gray-900'"
          @click="pestana = tab.id"
          @keydown.right.prevent="moverTab(1)"
          @keydown.left.prevent="moverTab(-1)"
        >
          {{ tab.label }}
        </button>
      </div>

      <div v-show="pestana === 'unirme'" id="club-panel-unirme" role="tabpanel" aria-labelledby="club-tab-unirme">
        <ClubRegistroForm
          :email-inicial="emailInicial"
          @registrado="alRegistrarse"
          @pendiente="alQuedarPendiente"
          @ir-a-login="irA('miembro')"
        />
      </div>
      <div v-show="pestana === 'miembro'" id="club-panel-miembro" role="tabpanel" aria-labelledby="club-tab-miembro">
        <ClubLoginForm
          @sesion-iniciada="notificarSesionIniciada"
          @pendiente="alQuedarPendiente"
          @no-registrado="alNoEstarRegistrado"
        />
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import ClubRegistroForm, { type CredencialesPendientes } from './ClubRegistroForm.vue';
import ClubLoginForm from './ClubLoginForm.vue';
import ClubCorreoEnviado from './ClubCorreoEnviado.vue';
import useClubModal, { type PestanaClub } from '../../composables/clubModal';
import { CLUB } from '../../config/club';

const { visible, pestana, intencion, emailInicial, cerrar, notificarSesionIniciada } = useClubModal();

const tabs: { id: PestanaClub; label: string }[] = [
  { id: 'unirme', label: 'Unirme' },
  { id: 'miembro', label: 'Ya soy miembro' },
];

const vista = ref<'formulario' | 'correo'>('formulario');

/** Credenciales en memoria para reenviar/corregir. Se borran al cerrar el modal. */
const correoVacio = () => ({ email: '', numeroDocumento: '', clave: '', titulo: '', mensaje: '', correoEnviado: true });
const correo = reactive(correoVacio());

const tituloModal = computed(() => {
  if (vista.value === 'correo') return '¡Ya casi eres parte del Club!';
  if (intencion.value === 'contratar') return CLUB.tituloContratar;
  return pestana.value === 'miembro' ? 'Entra al Club SEGURU' : 'Únete al Club SEGURU';
});

const subtituloModal = computed(() => {
  if (intencion.value === 'contratar') return CLUB.textoContratar;
  if (pestana.value === 'miembro') return 'Entra con tu número de documento y tu contraseña.';
  return 'Es gratis y toma menos de un minuto.';
});

const irA = (destino: PestanaClub) => {
  vista.value = 'formulario';
  pestana.value = destino;
};

const moverTab = async (delta: number) => {
  const i = tabs.findIndex((t) => t.id === pestana.value);
  pestana.value = tabs[(i + delta + tabs.length) % tabs.length].id;
  await nextTick();
  document.getElementById(`club-tab-${pestana.value}`)?.focus();
};

const alRegistrarse = (datos: CredencialesPendientes & { correoEnviado: boolean }) => {
  Object.assign(correo, correoVacio(), {
    email: datos.email,
    numeroDocumento: datos.numero_documento,
    clave: datos.clave,
    correoEnviado: datos.correoEnviado,
  });
  vista.value = 'correo';
};

const alQuedarPendiente = (datos: { numero_documento: string; clave: string; mensaje: string; email?: string }) => {
  Object.assign(correo, correoVacio(), {
    numeroDocumento: datos.numero_documento,
    clave: datos.clave,
    titulo: 'Activa tu cuenta para continuar',
    mensaje: datos.mensaje || 'Tu cuenta está pendiente de activación. Revisa tu correo o pide que te reenviemos el enlace.',
  });
  vista.value = 'correo';
};

const alNoEstarRegistrado = (email: string) => {
  emailInicial.value = email;
  irA('unirme');
};

const cerrarModal = () => {
  cerrar();
};

// Al cerrar se olvidan el documento y la clave escritos
watch(visible, (abierto) => {
  if (!abierto) {
    Object.assign(correo, correoVacio());
    vista.value = 'formulario';
  }
});
</script>
