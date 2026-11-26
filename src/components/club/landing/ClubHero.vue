<template>
  <!-- Hero: índigo profundo (brand-deep) con la foto de familia -->
  <section class="relative overflow-hidden" style="background-color: #141450" aria-labelledby="club-h1">
    <div class="absolute inset-0" aria-hidden="true">
      <img src="/img/imagen-familia.png" alt="" class="absolute inset-0 w-full h-full object-cover object-right" />
      <div
        class="absolute inset-0"
        style="background: linear-gradient(to right, #141450 0%, #141450 30%, #141450f0 45%, #141450b8 60%, #14145066 78%, #14145033 100%)"
      ></div>
      <!-- En celular la foto queda detrás del texto: se oscurece más -->
      <div class="absolute inset-0 bg-[#141450]/75 md:hidden"></div>
    </div>

    <div :class="[CONTENEDOR, 'relative z-10 py-14 md:py-24']">
      <div class="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <p v-if="aliado" class="mb-5 inline-block bg-accent-soft text-accent-ink rounded-xl px-3 py-2.5 text-[15px] leading-snug">
            👋 Te lo compartió <b>{{ aliado }}</b>, aliado independiente de SEGURU. No maneja tu dinero ni te asesora sobre
            coberturas: tú contratas y pagas directo en la plataforma.
          </p>
          <p :class="[KICK, '!text-orange-300']">{{ producto.kick }}</p>
          <!-- h1 viene de la configuración (texto fijo con <em>), nunca de datos del usuario -->
          <h1
            id="club-h1"
            class="mt-2 font-display text-[clamp(32px,8.6vw,54px)] font-extrabold text-white [&_em]:not-italic [&_em]:text-accent"
            v-html="titulo"
          ></h1>
          <p class="mt-3.5 text-[#D6D6F5] text-[18.5px] max-w-[34em]">{{ producto.sub }}</p>

          <div class="mt-[18px] flex flex-wrap items-center gap-2.5">
            <a :class="BTN.principal" href="#precios" @click.prevent="emit('ir-a-precios')">Ver precios</a>
            <button type="button" :class="BTN.bordeClaro" @click="emit('contratar')">Contratar</button>
          </div>
          <p class="mt-3 text-sm text-[#D6D6F5]">{{ CLUB.preciosMiembros }}</p>

          <ul v-if="producto.respaldos.length" class="mt-6 flex flex-wrap gap-2" aria-label="Respaldos">
            <li
              v-for="r in producto.respaldos"
              :key="r"
              class="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white rounded-full px-3 py-[5px] text-[13.5px] font-semibold"
            >
              <span class="text-green-300 font-extrabold" aria-hidden="true">✓</span>{{ r }}
            </li>
          </ul>
        </div>

        <!-- Video: solo aparece cuando hay una URL configurada -->
        <div v-if="urlVideo" class="rounded-card overflow-hidden border border-white/15 bg-brand-deep aspect-video">
          <video
            v-if="esArchivo"
            :src="urlVideo"
            controls
            preload="metadata"
            playsinline
            class="w-full h-full"
            :aria-label="`${producto.video.titulo}: ${producto.video.subtitulo}`"
          ></video>
          <iframe
            v-else
            :src="urlVideo"
            :title="`${producto.video.titulo}: ${producto.video.subtitulo}`"
            class="w-full h-full border-0"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CLUB, MOSTRAR_DATOS_SIN_VALIDAR } from '../../../config/club';
import type { ProductoClub } from '../../../config/clubProductos';
import { BTN, CONTENEDOR, KICK } from './clubEstilos';
import { extraerIdYoutube } from '../../../utils/videoYoutube';

const props = defineProps<{ producto: ProductoClub; aliado: string | null }>();
const emit = defineEmits<{ contratar: []; 'ir-a-precios': [] }>();

const titulo = computed(() =>
  MOSTRAR_DATOS_SIN_VALIDAR && props.producto.h1SinValidar ? props.producto.h1SinValidar : props.producto.h1,
);
const esArchivo = computed(() => /\.(mp4|webm|ogg)(\?|$)/i.test(props.producto.video.url));

/** Cualquier enlace de YouTube (watch, youtu.be, shorts…) se muestra como /embed/ */
const urlVideo = computed(() => {
  const url = props.producto.video.url.trim();
  if (!url || esArchivo.value) return url;
  const id = extraerIdYoutube(url);
  return id ? `https://www.youtube.com/embed/${id}` : '';
});
</script>
