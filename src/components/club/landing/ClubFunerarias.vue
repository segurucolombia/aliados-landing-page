<template>
  <ClubSeccion
    id="funerarias"
    kick="Cobertura nacional"
    titulo="Busca las funerarias en tu ciudad"
    lead="Escribe el municipio donde vive tu familia y mira qué funerarias de la red atienden allí."
    :fondo="fondo"
  >
    <div class="grid gap-6 lg:grid-cols-2 items-start">
      <div :class="[TARJETA, 'p-6 md:p-8']">
        <label for="club-fq" class="block font-semibold text-gray-800 mb-2">Ciudad o municipio</label>
        <input
          id="club-fq"
          v-model="consulta"
          type="search"
          autocomplete="off"
          placeholder="Ej. Bucaramanga"
          aria-controls="club-fopts"
          :disabled="!datos"
          class="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          @input="buscar"
          @keydown.enter.prevent="elegirPrimero"
        />
        <div class="mt-3 flex flex-wrap gap-2">
          <button
            v-for="q in RAPIDAS"
            :key="q"
            type="button"
            :disabled="!datos"
            :class="[CHIP, FOCO]"
            @click="elegirRapida(q)"
          >
            {{ q }}
          </button>
        </div>

        <div id="club-fopts" class="mt-3 grid gap-2">
          <button
            v-for="m in opciones.slice(0, 8)"
            :key="m.i"
            type="button"
            class="flex items-center justify-between gap-3 text-left px-4 py-3 rounded-lg border border-gray-200 bg-white hover:border-primary-400 hover:bg-primary-50 transition-colors"
            :class="FOCO"
            @click="mostrar(m.i)"
          >
            <span class="font-medium text-gray-800">{{ m.municipio }}</span>
            <small class="text-gray-500">{{ m.departamento }} · {{ m.total }}</small>
          </button>
          <small v-if="opciones.length > 8" class="text-gray-500">Hay {{ opciones.length }} resultados. Escribe más letras para afinar.</small>
        </div>

        <details class="mt-5 group">
          <summary class="cursor-pointer text-primary-700 font-semibold text-sm" :class="FOCO">
            ¿No sabes cómo se escribe? Búscalo por departamento
          </summary>
          <select
            v-model="departamento"
            aria-label="Departamento"
            :disabled="!datos"
            class="mt-3 w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Elige un departamento</option>
            <option v-for="d in departamentos" :key="d">{{ d }}</option>
          </select>
          <div class="mt-3 flex flex-wrap gap-2">
            <button v-for="m in municipiosDepto" :key="m.i" type="button" :class="[CHIP, FOCO]" @click="mostrar(m.i, true)">
              {{ m.municipio }}
            </button>
          </div>
        </details>

        <p class="mt-5 text-sm text-gray-500">
          Listado de referencia de la red de funerarias. Puede cambiar: al llamar a la línea de atención se confirma la funeraria
          disponible. El plan incluye el traslado nacional del cuerpo.
        </p>
      </div>

      <div ref="resultado" aria-live="polite">
        <div v-if="elegido" :class="[TARJETA, 'p-6 md:p-8']">
          <h3 class="text-2xl font-bold text-gray-900">{{ elegido.municipio }}, {{ elegido.departamento }}</h3>
          <p class="mt-1 text-gray-600">
            {{ elegido.nombres.length }} {{ elegido.nombres.length === 1 ? 'funeraria atiende' : 'funerarias atienden' }} en este municipio.
          </p>
          <ul class="mt-5 grid gap-2 sm:grid-cols-2">
            <li v-for="n in elegido.nombres" :key="n" class="flex gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2.5 text-gray-800 font-medium">
              <span class="text-green-600 font-bold" aria-hidden="true">✓</span>{{ n }}
            </li>
          </ul>
        </div>
        <div v-else-if="sinResultado" class="rounded-2xl bg-orange-50 border border-orange-200 p-6 md:p-8 text-gray-800">
          <b>No encontramos “{{ sinResultado }}” en el listado.</b> Puede que tu municipio se atienda desde una ciudad cercana.
          Escríbenos por WhatsApp y te confirmamos la cobertura donde vives.
          <div class="mt-5">
            <a :class="BTN.whatsapp" :href="whatsapp" target="_blank" rel="noopener">Confirmar por WhatsApp</a>
          </div>
        </div>
        <p v-else-if="errorCarga" class="rounded-2xl bg-orange-50 border border-orange-200 p-6 text-gray-800">
          No pudimos cargar el listado de funerarias. Escríbenos por WhatsApp y te confirmamos la cobertura.
        </p>
        <div v-else class="hidden lg:flex h-full min-h-[16rem] items-center justify-center rounded-2xl border-2 border-dashed border-primary-200 bg-white/60 p-8 text-center text-gray-500">
          Elige una ciudad para ver las funerarias de la red que atienden allí.
        </div>
      </div>
    </div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, shallowRef } from 'vue';
import ClubSeccion from './ClubSeccion.vue';
import { BTN, FOCO, TARJETA } from './clubEstilos';

const CHIP =
  'px-3.5 py-1.5 rounded-full text-sm font-medium border border-gray-200 bg-white text-gray-700 hover:border-primary-400 hover:text-primary-700 transition-colors disabled:opacity-50';

withDefaults(defineProps<{ whatsapp: string; fondo?: 'blanco' | 'azulClaro' }>(), { fondo: 'azulClaro' });

interface Municipio {
  i: number;
  clave: string;
  municipio: string;
  departamento: string;
  total: number;
  funerarias: number[];
}

const RAPIDAS = ['Bogotá D.C.', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Cúcuta', 'Pereira'];

const normalizar = (t: string) =>
  String(t)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const datos = shallowRef<{ funerarias: string[]; municipios: Municipio[] } | null>(null);
const errorCarga = ref(false);
const consulta = ref('');
const opciones = ref<Municipio[]>([]);
const elegidoIndice = ref<number | null>(null);
const sinResultado = ref('');
const departamento = ref('');
const resultado = ref<HTMLElement | null>(null);

onMounted(async () => {
  try {
    // El listado (~47 KB) solo se descarga cuando se abre Exequias
    const json = (await import('../../../data/funerarias.json')).default as {
      funerarias: string[];
      municipios: { departamento: string; municipio: string; funerarias: number[] }[];
    };
    datos.value = {
      funerarias: json.funerarias,
      municipios: json.municipios.map((m, i) => ({
        i,
        clave: normalizar(m.municipio),
        municipio: m.municipio,
        departamento: m.departamento,
        total: m.funerarias.length,
        funerarias: m.funerarias,
      })),
    };
  } catch {
    errorCarga.value = true;
  }
});

const departamentos = computed(() =>
  datos.value ? [...new Set(datos.value.municipios.map((m) => m.departamento))].sort((a, b) => a.localeCompare(b, 'es')) : [],
);
const municipiosDepto = computed(() =>
  datos.value && departamento.value ? datos.value.municipios.filter((m) => m.departamento === departamento.value) : [],
);

const elegido = computed(() => {
  if (elegidoIndice.value === null || !datos.value) return null;
  const m = datos.value.municipios[elegidoIndice.value];
  return { ...m, nombres: m.funerarias.map((x) => datos.value!.funerarias[x]) };
});

const mostrar = (i: number, desplazar = false) => {
  if (!datos.value) return;
  elegidoIndice.value = i;
  sinResultado.value = '';
  opciones.value = [];
  consulta.value = datos.value.municipios[i].municipio;
  if (desplazar) resultado.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

const buscar = () => {
  if (!datos.value) return;
  const t = normalizar(consulta.value);
  elegidoIndice.value = null;
  sinResultado.value = '';
  if (t.length < 2) {
    opciones.value = [];
    return;
  }
  const inicio = datos.value.municipios.filter((m) => m.clave.startsWith(t));
  const contiene = datos.value.municipios.filter((m) => !m.clave.startsWith(t) && m.clave.includes(t));
  const hits = [...inicio, ...contiene];
  if (!hits.length) {
    opciones.value = [];
    sinResultado.value = consulta.value.trim();
    return;
  }
  if (hits.length === 1) {
    mostrar(hits[0].i);
    return;
  }
  opciones.value = hits;
};

const elegirPrimero = () => {
  if (opciones.value.length) mostrar(opciones.value[0].i);
};

const elegirRapida = (q: string) => {
  if (!datos.value) return;
  const k = normalizar(q);
  const m = datos.value.municipios.find((x) => x.clave === k || x.clave === k.replace(' d c', ''));
  consulta.value = q;
  if (m) mostrar(m.i);
  else buscar();
};
</script>
