<template>
  <div>
  <ClubHero :producto="producto" :aliado="aliado" @contratar="acciones.contratar" @ir-a-precios="irAPrecios" />

  <!-- La realidad -->
  <ClubSeccion v-if="ver.real" id="club-real" kick="La realidad" :titulo="producto.historiaTitulo" :lead="producto.historia" :fondo="fondo('real')">
    <div v-if="datos.length" class="grid gap-6 md:grid-cols-3">
      <div v-for="d in datos" :key="d.valor" :class="[TARJETA, 'p-6 md:p-7 border-t-4 !border-t-orange-500']">
        <p class="text-3xl md:text-4xl font-bold text-primary-700 leading-tight">{{ d.valor }}</p>
        <p class="mt-2 text-gray-600">{{ d.texto }}</p>
      </div>
    </div>
  </ClubSeccion>

  <ClubDosColumnas
    v-if="ver.vs"
    id="club-vs"
    kick="Dos escenarios"
    titulo="Con plan y sin plan"
    :fondo="fondo('vs')"
    :columnas="conItems([
      { tipo: 'sin', titulo: 'Sin respaldo', items: producto.sin },
      { tipo: 'con', titulo: 'Con SEGURU', items: producto.con },
    ])"
  />

  <!-- Qué recibes -->
  <ClubSeccion v-if="ver.inc" id="club-inc" kick="Qué recibes" :titulo="producto.incluyeTitulo" :fondo="fondo('inc')">
    <ul v-if="incluye.length" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <li v-for="item in incluye" :key="item.titulo" :class="[TARJETA, 'p-5 flex gap-4']">
        <span class="w-9 h-9 shrink-0 rounded-full bg-green-100 text-green-600 font-bold flex items-center justify-center" aria-hidden="true">✓</span>
        <div>
          <p class="font-semibold text-gray-900">{{ item.titulo }}</p>
          <p v-if="item.detalle" class="mt-1 text-sm text-gray-500">{{ item.detalle }}</p>
        </div>
      </li>
    </ul>
    <p v-if="producto.quien" :class="incluye.length ? 'mt-8' : ''" class="text-gray-600 text-lg leading-relaxed max-w-4xl">{{ producto.quien }}</p>
  </ClubSeccion>

  <ClubDosColumnas
    v-if="ver.para"
    id="club-para"
    kick="Para quién es"
    titulo="Es para ti si…"
    :fondo="fondo('para')"
    :columnas="conItems([
      { tipo: 'con', titulo: 'Es para ti', items: producto.paraTi },
      { tipo: 'sin', titulo: 'Quizás no es para ti', items: producto.noParaTi },
    ])"
  />

  <ClubPasos v-if="ver.dia" id="club-dia" kick="Cómo funciona de verdad" :titulo="producto.diaTitulo" :pasos="producto.dia" :fondo="fondo('dia')" />

  <ClubFunerarias v-if="producto.funerarias" :whatsapp="whatsapp" :fondo="fondo('fun')" />

  <ClubCalculadora v-if="producto.calculadora" :clave="producto.calculadora" :planes-fp="planesFp" :fondo="fondo('calc')" @ir-a-precios="irAPrecios" />

  <ClubAcordeon
    v-if="ver.obj"
    id="club-obj"
    kick="Lo que suele frenar la decisión"
    titulo="Dudas comunes, respuestas claras"
    :preguntas="producto.objeciones"
    :fondo="fondo('obj')"
  />

  <!-- Reseñas de Google (Trustindex): prueba social justo antes de los precios -->
  <ClubResenas :fondo="fondo('resenas')" />

  <ClubPrecios
    :producto="producto"
    :planes="planesFp"
    @ver-precios="acciones.verPrecios"
    @contratar="acciones.contratar"
    @unirme="acciones.unirme"
  />

  <!-- Quién está detrás + Lo que puedes verificar -->
  <section class="py-14 md:py-20 bg-white" aria-label="Quién está detrás y qué puedes verificar">
    <div :class="[CONTENEDOR, 'grid gap-12 lg:grid-cols-2']">
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[12.5px] font-bold tracking-[.1em] uppercase text-brand">Quién está detrás</span>
        </div>
        <h2 class="text-[clamp(26px,5vw,40px)] font-extrabold text-gray-900 leading-tight">Personas reales, empresa real</h2>
        <p class="mt-4 text-lg text-gray-600 leading-relaxed">{{ MARCA_SEGURU }} Si algo no te queda claro, hay un equipo que responde.</p>
      </div>
      <div>
        <div class="flex items-center gap-3 mb-4">
          <span class="text-[12.5px] font-bold tracking-[.1em] uppercase text-brand">Sin letra pequeña escondida</span>
        </div>
        <h2 class="text-[clamp(26px,5vw,40px)] font-extrabold text-gray-900 leading-tight">Lo que puedes verificar</h2>
        <ul class="mt-6 space-y-3">
          <li v-for="v in VERIFICABLE" :key="v" class="flex gap-3 text-gray-700">
            <span class="w-7 h-7 shrink-0 rounded-full bg-green-100 text-green-600 text-sm font-bold flex items-center justify-center" aria-hidden="true">✓</span>
            <span class="pt-0.5">{{ v }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ¿Por qué no dejarlo para después? (franja como MovimientoFamilias) -->
  <section v-if="producto.esperar" style="background-color: #141450" aria-labelledby="club-esperar-t">
    <div :class="[CONTENEDOR, 'py-12 md:py-16 grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-center']">
      <h2 id="club-esperar-t" class="text-[clamp(26px,5vw,40px)] font-extrabold text-white leading-tight">¿Por qué no dejarlo para después?</h2>
      <p class="text-blue-100 text-lg leading-relaxed">{{ producto.esperar }}</p>
    </div>
  </section>

  <!-- Por qué confiar -->
  <ClubSeccion v-if="producto.confianza.length" id="club-trust" kick="Por qué confiar" titulo="Con respaldo y sin letra pequeña escondida" fondo="azulClaro">
    <div class="grid gap-6 md:grid-cols-3">
      <div v-for="t in producto.confianza" :key="t.texto" :class="[TARJETA, 'p-6 flex gap-4 items-start']">
        <div class="w-14 h-14 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl" aria-hidden="true">{{ t.icono }}</div>
        <p class="text-gray-700 leading-relaxed">{{ t.texto }}</p>
      </div>
    </div>
  </ClubSeccion>

  <ClubPasos v-if="producto.pasos.length" id="club-pasos" kick="Cómo funciona" titulo="En 3 pasos" :pasos="producto.pasos" />

  <ClubAcordeon
    id="club-faq"
    kick="Preguntas frecuentes"
    titulo="Resuelve tus dudas"
    :preguntas="[...producto.preguntas, ...faqComunes]"
    fondo="azulClaro"
  />

  <!-- Banda final -->
  <section class="py-14 md:py-20 bg-brand-deep relative overflow-hidden" aria-labelledby="club-final-t">
    <div class="absolute top-10 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
    <div class="absolute bottom-0 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl" aria-hidden="true"></div>
    <div :class="[CONTENEDOR, 'relative z-10 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center']">
      <div>
        <h2 id="club-final-t" class="text-[clamp(26px,5vw,40px)] font-extrabold text-white leading-tight">
          Deja resuelto hoy lo que no quieres improvisar mañana
        </h2>
        <p class="mt-4 text-blue-100 text-lg">
          Contrata directo en la plataforma de SEGURU. Si prefieres pensarlo o hablar con alguien antes, escríbenos.
        </p>
      </div>
      <div class="flex flex-wrap gap-3 lg:justify-end">
        <button type="button" :class="BTN.principal" @click="acciones.contratar">Contratar ahora</button>
        <a :class="BTN.whatsapp" :href="whatsapp" target="_blank" rel="noopener">Hablar por WhatsApp</a>
      </div>
    </div>
  </section>

  <div class="bg-white">
    <p :class="[CONTENEDOR, 'py-6 text-xs text-gray-500 leading-relaxed']">{{ TEXTO_LEGAL }}</p>
  </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, toRef } from 'vue';
import ClubHero from './ClubHero.vue';
import ClubSeccion from './ClubSeccion.vue';
import ClubDosColumnas from './ClubDosColumnas.vue';
import ClubPasos from './ClubPasos.vue';
import ClubFunerarias from './ClubFunerarias.vue';
import ClubCalculadora from './ClubCalculadora.vue';
import ClubAcordeon from './ClubAcordeon.vue';
import ClubPrecios from './ClubPrecios.vue';
import ClubResenas from './ClubResenas.vue';
import { BTN, CONTENEDOR, TARJETA } from './clubEstilos';
import { FAQ_CLUB, MOSTRAR_DATOS_SIN_VALIDAR, whatsappUrl } from '../../../config/club';
import { MARCA_SEGURU, TEXTO_LEGAL, VERIFICABLE, mensajeWhatsapp, type ProductoClub } from '../../../config/clubProductos';
import useClubAcciones from '../../../composables/clubAcciones';
import useAliadoActual from '../../../composables/aliadoActual';
import useClubCoberturas, { formatoMillones } from '../../../composables/clubCoberturas';

/**
 * Cuerpo de la landing de un producto (todas las secciones, del hero a la nota legal).
 * Lo usan la home sin sesión (con pestañas) y la página de cada producto (/{slug}/{productoId}),
 * cuyo contenido viene de la API.
 */
const props = defineProps<{ producto: ProductoClub }>();
const producto = toRef(props, 'producto');

const acciones = useClubAcciones(producto);
const { nombre: aliado } = useAliadoActual();

const whatsapp = computed(() => whatsappUrl(mensajeWhatsapp(producto.value)));
const faqComunes = FAQ_CLUB.map((f) => ({ pregunta: f.pregunta, respuesta: f.respuesta }));

// Planes reales (API) para la tabla de coberturas, la calculadora de Familia Protegida y los montos
const necesitaPlanes = computed(
  () => producto.value.tablaCoberturas || producto.value.montosDesdePlanes || producto.value.calculadora === 'fp',
);
const { planes: planesFp } = useClubCoberturas(computed(() => (necesitaPlanes.value ? producto.value.productoId : null)));
const rangoFp = computed(() => {
  if (!producto.value.montosDesdePlanes) return null;
  const montos = planesFp.value.map((p) => p.valorAsegurado).filter(Boolean);
  if (!montos.length) return null;
  const [min, max] = [Math.min(...montos), Math.max(...montos)];
  const m = (v: number) => (v / 1_000_000).toLocaleString('es-CO', { maximumFractionDigits: 1 });
  return { valor: min === max ? `$${m(min)} millones` : `$${m(min)} a $${m(max)} millones`, min, max };
});

/** Cifras sin fuente fuera (salvo con la bandera) y, con `montosDesdePlanes`, el rango real */
const datos = computed(() =>
  producto.value.datos
    .filter((d) => MOSTRAR_DATOS_SIN_VALIDAR || !d.sinValidar)
    .map((d, i) => (i === 0 && rangoFp.value ? { ...d, valor: rangoFp.value.valor } : d)),
);

const incluye = computed(() => {
  const r = rangoFp.value;
  if (!r) return producto.value.incluye;
  const detalle =
    r.min === r.max ? `${formatoMillones(r.min)}, según el plan` : `Desde ${formatoMillones(r.min)} hasta ${formatoMillones(r.max)}, según el plan`;
  return producto.value.incluye.map((item, i) => (i < 2 ? { ...item, detalle } : item));
});

/**
 * Fondos alternos entre las secciones visibles, para que nunca queden dos iguales seguidos
 * antes de "Cuánto cuesta". La calculadora sigue la misma regla de visibilidad que ClubCalculadora.
 */
const calculadoraVisible = computed(() => {
  const c = producto.value.calculadora;
  if (!c) return false;
  if (c === 'eq') return MOSTRAR_DATOS_SIN_VALIDAR;
  if (c === 'fp') return planesFp.value.length > 0;
  return true;
});
/** Secciones con contenido: las que llegan vacías desde la API no se pintan */
const ver = computed(() => {
  const p = producto.value;
  return {
    real: !!(p.historiaTitulo || p.historia || datos.value.length),
    vs: !!(p.sin.length || p.con.length),
    inc: !!(incluye.value.length || p.quien),
    para: !!(p.paraTi.length || p.noParaTi.length),
    dia: p.dia.length > 0,
    obj: p.objeciones.length > 0,
  };
});
/** Columnas "sin / con" sin las que no traen items */
const conItems = <T extends { items: string[] }>(columnas: T[]) => columnas.filter((c) => c.items.length);

const ordenSecciones = computed(() =>
  [
    ver.value.real && 'real',
    ver.value.vs && 'vs',
    ver.value.inc && 'inc',
    ver.value.para && 'para',
    ver.value.dia && 'dia',
    producto.value.funerarias && 'fun',
    calculadoraVisible.value && 'calc',
    ver.value.obj && 'obj',
    'resenas',
  ].filter(Boolean) as string[],
);
const fondo = (seccion: string): 'azulClaro' | 'blanco' => {
  const i = ordenSecciones.value.indexOf(seccion);
  return i % 2 === 0 ? 'azulClaro' : 'blanco';
};

const irAPrecios = async () => {
  await nextTick();
  const seccion = document.getElementById('precios');
  if (!seccion) return;
  const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  seccion.scrollIntoView({ behavior: reducir ? 'auto' : 'smooth' });
  seccion.focus({ preventScroll: true });
};
</script>
