<template>
  <ClubSeccion v-if="visible" id="club-calc" kick="Haz tus cuentas" :titulo="titulo" :fondo="fondo">
    <div :class="[TARJETA, 'p-6 md:p-8']">
      <div class="grid gap-8 lg:grid-cols-2">
        <!-- Exequias: solo con MOSTRAR_DATOS_SIN_VALIDAR (usa el costo de referencia sin fuente) -->
        <template v-if="clave === 'eq'">
          <div>
            <label for="club-c-in" :class="ETIQUETA">¿Cuánto puedes ahorrar cada mes?</label>
            <input id="club-c-in" :value="texto1" type="text" inputmode="numeric" aria-describedby="club-c-out" :class="CAMPO" @input="alEscribir($event, 1)" />
          </div>
          <div id="club-c-out" :class="RESULTADO" aria-live="polite">
            <template v-if="valor1 < 10_000">Escribe un valor mayor para calcular.</template>
            <template v-else>
              <span :class="GRANDE">{{ mesesAhorro }} meses ({{ anosAhorro }} años)</span>
              Es lo que te tomaría juntar {{ dinero(COSTO_EXEQUIAL_SIN_VALIDAR) }} sin gastar nada más.
              <small :class="NOTA">Cálculo ilustrativo con el costo de referencia de un servicio exequial.</small>
            </template>
          </div>
        </template>

        <!-- Familia Protegida: montos reales de los planes (API) -->
        <template v-else-if="clave === 'fp'">
          <div>
            <label for="club-c-in" :class="ETIQUETA">¿Cuánto gasta tu hogar al mes?</label>
            <input id="club-c-in" :value="texto1" type="text" inputmode="numeric" aria-describedby="club-c-out" :class="CAMPO" @input="alEscribir($event, 1)" />
            <div id="club-c-out" :class="RESULTADO" aria-live="polite">
              <template v-if="valor1 < 100_000">Escribe un valor mayor para calcular.</template>
              <template v-else>
                <span :class="GRANDE">Hasta {{ meses(maximoFp) }} meses</span>
                Con gastos de {{ dinero(valor1) }} al mes, el respaldo cubriría:
                {{ planesFp.map((p) => `${p.nombre} ${meses(p.valorAsegurado)}`).join(', ') }} meses.
                <small :class="NOTA">Ilustrativo: el respaldo es una suma única, no un ingreso mensual.</small>
              </template>
            </div>
          </div>
          <div>
            <label for="club-c-m" :class="ETIQUETA">¿Cuántos meses querrías tener cubiertos?</label>
            <select id="club-c-m" v-model.number="mesesObjetivo" aria-describedby="club-c-out2" :class="CAMPO">
              <option v-for="n in [6, 12, 18, 24]" :key="n" :value="n">{{ n }} meses</option>
            </select>
            <div v-if="valor1 >= 100_000" id="club-c-out2" :class="RESULTADO" aria-live="polite">
              <div :class="RECOMENDACION">
                <template v-if="planFp">Para cubrir {{ mesesObjetivo }} meses, el {{ planFp.nombre }} alcanza ({{ meses(planFp.valorAsegurado) }} meses).</template>
                <template v-else>Ni el plan más alto alcanza los {{ mesesObjetivo }} meses de estos gastos: cubriría {{ meses(maximoFp) }}.</template>
              </div>
              <small :class="NOTA">{{ planFp ? 'Orientativo. Revisa las condiciones de cada plan antes de decidir.' : 'Orientativo. Un respaldo parcial también reduce la carga de la familia.' }}</small>
            </div>
          </div>
        </template>

        <!-- Hogar: límites de cada plan, sin precios -->
        <template v-else-if="clave === 'hg'">
          <div>
            <label for="club-c-in" :class="ETIQUETA">¿Cuánto costaría reponer los muebles, electrodomésticos y cosas de tu casa?</label>
            <input id="club-c-in" :value="texto1" type="text" inputmode="numeric" aria-describedby="club-c-out" :class="CAMPO" @input="alEscribir($event, 1)" />
            <div id="club-c-out" :class="RESULTADO" aria-live="polite">
              <template v-if="valor1 < 1_000_000">Escribe un valor para calcular.</template>
              <template v-else>
                <span :class="GRANDE">{{ dinero(valor1) }}</span>Es lo que tendrías que sacar de tu bolsillo para reponer lo de adentro, sin seguro.
              </template>
            </div>
          </div>
          <div>
            <label for="club-c-e" :class="ETIQUETA">¿Cuánto costaría reparar o reconstruir tu vivienda?</label>
            <input id="club-c-e" :value="texto2" type="text" inputmode="numeric" aria-describedby="club-c-out2" :class="CAMPO" @input="alEscribir($event, 2)" />
            <div v-if="valor1 >= 1_000_000" id="club-c-out2" :class="RESULTADO" aria-live="polite">
              <template v-if="valor2 < 10_000_000">Escribe un valor para ver tu plan.</template>
              <template v-else-if="planHogar">
                <div :class="RECOMENDACION">
                  El {{ planHogar.nombre }} alcanza: protege la vivienda hasta {{ dinero(planHogar.vivienda) }} y los contenidos hasta
                  {{ dinero(planHogar.contenidos) }}.
                </div>
                <small :class="NOTA">Orientativo. Revisa las coberturas, deducibles y exclusiones antes de decidir.</small>
              </template>
              <template v-else>
                <div :class="RECOMENDACION">
                  Ni el plan más alto alcanza para esos valores: cubre hasta {{ dinero(maxHogar.vivienda) }} la vivienda y
                  {{ dinero(maxHogar.contenidos) }} los contenidos.
                </div>
                <small :class="NOTA">Escríbenos por WhatsApp y revisamos tu caso con la aseguradora.</small>
              </template>
            </div>
          </div>
        </template>
      </div>

      <div class="mt-8">
        <a :class="BTN.borde" href="#precios" @click.prevent="emit('ir-a-precios')">Ver precios</a>
      </div>
    </div>
  </ClubSeccion>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { MOSTRAR_DATOS_SIN_VALIDAR } from '../../../config/club';
import { COSTO_EXEQUIAL_SIN_VALIDAR, PLANES_HOGAR, type ClaveProducto, type TipoCalculadora } from '../../../config/clubProductos';
import type { PlanCoberturas } from '../../../composables/clubCoberturas';
import ClubSeccion from './ClubSeccion.vue';
import { BTN, TARJETA } from './clubEstilos';

const ETIQUETA = 'block font-semibold text-gray-800 mb-2';
const CAMPO =
  'w-full border border-gray-300 rounded-lg px-4 py-3 text-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500';
const RESULTADO = 'mt-4 text-gray-700 font-medium';
const GRANDE = 'block text-3xl font-bold text-primary-700 leading-tight mb-1';
const NOTA = 'block mt-2 text-sm font-normal text-gray-500';
const RECOMENDACION = 'bg-green-50 border border-green-100 rounded-lg px-4 py-3 text-gray-800 font-semibold';

const props = withDefaults(
  defineProps<{ clave: TipoCalculadora; planesFp: PlanCoberturas[]; fondo?: 'blanco' | 'azulClaro' }>(),
  { fondo: 'blanco' },
);
const emit = defineEmits<{ 'ir-a-precios': [] }>();

const VALORES_INICIALES: Record<ClaveProducto, [number, number]> = {
  eq: [500_000, 0],
  md: [0, 0],
  fp: [3_000_000, 0],
  hg: [25_000_000, 150_000_000],
};

const numero = (v: string) => parseInt(String(v).replace(/\D/g, ''), 10) || 0;
const conPuntos = (n: number) => (n ? n.toLocaleString('es-CO') : '');
const dinero = (n: number) => '$' + Math.round(n).toLocaleString('es-CO');

const valor1 = ref(0);
const valor2 = ref(0);
const texto1 = computed(() => conPuntos(valor1.value));
const texto2 = computed(() => conPuntos(valor2.value));
const mesesObjetivo = ref(12);

watch(
  () => props.clave,
  (k) => {
    [valor1.value, valor2.value] = VALORES_INICIALES[k];
    mesesObjetivo.value = 12;
  },
  { immediate: true },
);

const alEscribir = (evento: Event, campo: 1 | 2) => {
  const input = evento.target as HTMLInputElement;
  const n = numero(input.value);
  if (campo === 1) valor1.value = n;
  else valor2.value = n;
  input.value = conPuntos(n);
};

/**
 * Mi Doc Virtual: la calculadora del prototipo era solo de precios → no se muestra sin sesión.
 * Exequias: la parte de precios se quitó; la otra usa una cifra sin fuente → solo con la bandera.
 * Familia Protegida: necesita los planes de la API.
 */
const visible = computed(() => {
  if (props.clave === 'md') return false;
  if (props.clave === 'eq') return MOSTRAR_DATOS_SIN_VALIDAR;
  if (props.clave === 'fp') return props.planesFp.length > 0;
  return true;
});

const titulo = computed(
  () =>
    ({
      eq: '¿Cuánto te tomaría juntar ese dinero?',
      md: '',
      fp: '¿Cuántos meses de gastos cubriría?',
      hg: '¿Qué plan alcanza para tu casa?',
    })[props.clave],
);

const mesesAhorro = computed(() => Math.ceil(COSTO_EXEQUIAL_SIN_VALIDAR / valor1.value));
const anosAhorro = computed(() => (mesesAhorro.value / 12).toLocaleString('es-CO', { maximumFractionDigits: 1 }));

const meses = (monto: number) => (monto / valor1.value).toLocaleString('es-CO', { maximumFractionDigits: 1 });
const maximoFp = computed(() => Math.max(0, ...props.planesFp.map((p) => p.valorAsegurado)));
const planFp = computed(() => props.planesFp.find((p) => p.valorAsegurado / valor1.value >= mesesObjetivo.value) ?? null);

const planHogar = computed(() => PLANES_HOGAR.find((p) => p.vivienda >= valor2.value && p.contenidos >= valor1.value) ?? null);
const maxHogar = PLANES_HOGAR[PLANES_HOGAR.length - 1];
</script>
