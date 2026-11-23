<template>
  <ClubSeccion
    id="precios"
    kick="Precios"
    titulo="Cuánto cuesta"
    :lead="lead"
    fondo="azul"
    enfocable
  >
    <div class="grid gap-3 md:gap-4 lg:grid-cols-2 items-stretch">
      <!-- Con sesión: acceso a los planes con precios -->
      <div v-if="montado && esMiembro" class="bg-white rounded-band px-[18px] py-[22px] md:p-8 text-center text-ink border-2 border-ok flex flex-col items-center justify-center">
        <span class="bg-green-50 text-green-600 px-2.5 py-1 rounded-full text-[13px] font-bold">✓ Eres miembro del Club</span>
        <h3 class="mt-4 text-2xl font-bold">Ya puedes ver los precios</h3>
        <p class="mt-2 text-gray-600">Compara los planes de {{ producto.chip }} y elige el que más te sirva.</p>
        <button
          v-if="producto.contratarPorWhatsapp"
          type="button"
          :class="[BTN.principal, 'mt-6 w-full max-w-sm']"
          @click="emit('contratar')"
        >
          Cotizar por WhatsApp
        </button>
        <button v-else type="button" :class="[BTN.principal, 'mt-6 w-full max-w-sm']" @click="emit('ver-precios')">
          Ver planes y precios
        </button>
      </div>

      <!-- Sin sesión no se muestran precios (decisión de producto): bloqueo "solo para miembros" -->
      <div v-else class="bg-white rounded-band px-[18px] py-[22px] md:p-8 text-center text-ink border-2 border-dashed border-brand">
        <div class="grid gap-2 max-w-sm mx-auto mb-6 blur-[5px] opacity-75 select-none" aria-hidden="true">
          <div class="h-[46px] rounded-xl bg-accent-soft"></div>
          <div class="h-[46px] rounded-xl bg-soft"></div>
          <div class="h-[46px] rounded-xl bg-soft"></div>
        </div>
        <h3 class="text-2xl font-bold"><span aria-hidden="true">🔒 </span>Precios solo para miembros</h3>
        <p class="mt-2 text-gray-600">Crea tu cuenta en menos de un minuto. Es gratis y no te obliga a comprar.</p>
        <button type="button" :class="[BTN.principal, 'mt-6 w-full max-w-sm']" @click="emit('ver-precios')">
          Unirme gratis y ver precios
        </button>
      </div>

      <!-- Banda del Club -->
      <div class="rounded-band bg-white/5 border border-white/15 px-5 py-[22px] md:p-8 flex flex-col justify-center">
        <h3 class="text-2xl md:text-3xl font-bold text-white">{{ CLUB.bandaPrecios }}</h3>
        <p class="mt-3 text-blue-100 text-lg leading-relaxed">{{ CLUB.bandaPreciosTexto }}</p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" :class="BTN.principal" @click="emit('contratar')">{{ montado && esMiembro ? 'Contratar' : 'Unirme y contratar' }}</button>
          <button v-if="!(montado && esMiembro)" type="button" :class="BTN.bordeClaro" @click="emit('unirme')">{{ CLUB.unirseSinContratar }}</button>
        </div>
      </div>
    </div>

    <!-- Coberturas por plan (sin precios), con los montos reales de la API -->
    <div v-if="tabla" class="mt-4 bg-white rounded-[14px] border border-line overflow-x-auto text-ink">
      <table class="w-full min-w-[480px] text-sm md:text-base">
        <caption class="text-left px-5 md:px-6 pt-5 font-bold text-lg">Qué cubre cada plan</caption>
        <thead>
          <tr class="border-b border-gray-200">
            <th scope="col" class="text-left px-5 md:px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold">Cobertura</th>
            <th
              v-for="c in tabla.columnas"
              :key="c"
              scope="col"
              class="text-right px-5 md:px-6 py-3 text-xs uppercase tracking-wider text-gray-500 font-semibold"
            >
              {{ c }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in tabla.filas" :key="fila.nombre" class="border-b border-gray-100 last:border-0">
            <th scope="row" class="text-left px-5 md:px-6 py-3 font-medium text-gray-800">{{ fila.nombre }}</th>
            <td v-for="(v, i) in fila.valores" :key="i" class="text-right px-5 md:px-6 py-3 tabular-nums">{{ v }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { CLUB } from '../../../config/club';
import type { ProductoClub } from '../../../config/clubProductos';
import { tablaCoberturas, type PlanCoberturas } from '../../../composables/clubCoberturas';
import ClubSeccion from './ClubSeccion.vue';
import { BTN } from './clubEstilos';
import useClubSesion from '../../../composables/clubSesion';

const props = defineProps<{ producto: ProductoClub; planes: PlanCoberturas[] }>();
const emit = defineEmits<{ 'ver-precios': []; contratar: []; unirme: [] }>();

const { esMiembro } = useClubSesion();
// La sesión vive en localStorage: se lee al montar para no desajustar la hidratación
const montado = ref(false);
onMounted(() => (montado.value = true));

const lead = computed(() =>
  montado.value && esMiembro.value
    ? `Como miembro del Club ya puedes ver los planes y precios de ${props.producto.chip}.`
    : `Únete al Club SEGURU, que es gratis, y accede a los planes y precios de ${props.producto.chip}.`,
);

/** Solo Familia Protegida compara coberturas entre planes (como el prototipo) */
const tabla = computed(() => (props.producto.tablaCoberturas && props.planes.length ? tablaCoberturas(props.planes) : null));
</script>
