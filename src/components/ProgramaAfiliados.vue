<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Modal formulario -->
    <CrearAliadoForm
      v-if="mostrarFormulario"
      @close="mostrarFormulario = false"
      @created="onAliadoCreado"
    />

    <!-- BLOQUE 1 – HERO PRINCIPAL -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pt-40 pb-36 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
      </div>
      <div class="relative container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-12 h-1 bg-blue-300"></div>
            <span class="text-blue-200 font-semibold tracking-widest uppercase text-sm">Programa de Afiliados</span>
            <div class="w-12 h-1 bg-blue-300"></div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Genera ingresos adicionales compartiendo protección
          </h1>
          <p class="text-xl text-blue-100 mb-10 leading-relaxed">
            Únete al Programa de Afiliados SEGURU y gana comisiones cada vez que alguien contrate desde tu enlace digital.
          </p>
          <div class="flex flex-col items-center gap-4">
            <button
              @click="mostrarFormulario = true"
              class="inline-flex items-center gap-2 bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
            >
              👉 Quiero ser Afiliado
            </button>
            <p class="text-blue-200 text-sm">Sin horarios. Sin metas obligatorias. 100% digital.</p>

            <!-- Mensaje aliado padre encontrado -->
            <div v-if="buscandoAliadoPadre" class="flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-5 py-3 text-blue-100 text-sm">
              <svg class="w-4 h-4 animate-spin flex-shrink-0" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Verificando aliado...
            </div>
            <div v-else-if="aliadoPadreNombre" class="flex items-center gap-3 bg-white/15 border border-white/25 backdrop-blur-sm rounded-xl px-5 py-3 text-sm">
              <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-white">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </div>
              <span class="text-white">Tu aliado asociado es <strong>{{ aliadoPadreNombre }}</strong></span>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <!-- BLOQUE 2 – ¿CÓMO FUNCIONA? -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="text-center mb-14">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-10 h-1 bg-primary-600"></div>
            <span class="text-primary-600 font-semibold uppercase text-sm tracking-widest">¿Cómo funciona?</span>
            <div class="w-10 h-1 bg-primary-600"></div>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900">Es simple</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div
            v-for="step in steps"
            :key="step.number"
            class="relative rounded-3xl p-10 text-center flex flex-col items-center gap-5 shadow-lg hover:scale-105 transition-transform duration-300"
            :class="step.cardClass"
          >
            <span class="w-14 h-14 flex items-center justify-center" :class="step.iconClass" v-html="step.icon"></span>
            <h3 class="text-2xl font-bold tracking-wide uppercase" :class="step.titleClass">{{ step.title }}</h3>
            <p class="leading-relaxed text-base" :class="step.textClass">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOQUE 3 – ¿QUÉ PUEDES COMPARTIR? -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-1 bg-primary-600"></div>
              <span class="text-primary-600 font-semibold uppercase text-sm tracking-widest">Productos</span>
              <div class="w-10 h-1 bg-primary-600"></div>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
              Productos claros y fáciles de recomendar
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div v-for="product in products" :key="product.name" class="flex items-center gap-4 bg-primary-50 rounded-xl px-6 py-4 hover:bg-primary-100 transition-colors">
              <div class="w-10 h-10 bg-primary-600 text-white rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                {{ product.icon }}
              </div>
              <span class="text-gray-800 font-medium">{{ product.name }}</span>
            </div>
          </div>
          <p class="text-center text-gray-500 text-sm">
            Todo se contrata directamente en nuestra plataforma digital.
          </p>
        </div>
      </div>
    </section>

    <!-- BLOQUE 4 – BENEFICIOS DEL PROGRAMA -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-1 bg-primary-600"></div>
              <span class="text-primary-600 font-semibold uppercase text-sm tracking-widest">Beneficios</span>
              <div class="w-10 h-1 bg-primary-600"></div>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
              Ventajas de ser Afiliado SEGURU
            </h2>
          </div>
          <div class="bg-white rounded-2xl shadow-md p-8">
            <ul class="space-y-4">
              <li v-for="benefit in benefits" :key="benefit" class="flex items-center gap-4">
                <div class="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">✓</div>
                <span class="text-gray-700 text-lg">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOQUE 5 – TRANSPARENCIA -->
    <section class="py-20 bg-primary-700 text-white">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-10 h-1 bg-blue-300"></div>
            <span class="text-blue-200 font-semibold uppercase text-sm tracking-widest">Transparencia</span>
            <div class="w-10 h-1 bg-blue-300"></div>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Modelo 100% digital</h2>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-8 space-y-4 text-left border border-white/20">
            <p class="text-blue-100 leading-relaxed">
              SEGURU opera bajo un modelo de contratación directa. Los afiliados no realizan asesoría ni intermediación de seguros.
            </p>
            <div class="w-full h-px bg-white/20"></div>
            <p class="text-blue-100 leading-relaxed">
              La compra se realiza exclusivamente en la plataforma oficial.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOQUE 6 – ¿PARA QUIÉN ES ESTE PROGRAMA? -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <div class="flex items-center justify-center gap-3 mb-4">
              <div class="w-10 h-1 bg-primary-600"></div>
              <span class="text-primary-600 font-semibold uppercase text-sm tracking-widest">¿Para quién es?</span>
              <div class="w-10 h-1 bg-primary-600"></div>
            </div>
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
              Este programa es para ti
            </h2>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="profile in profiles" :key="profile.label" class="flex flex-col items-center gap-3 bg-gray-50 rounded-2xl p-6 text-center hover:bg-primary-50 hover:shadow-md transition-all">
              <div class="text-3xl">{{ profile.icon }}</div>
              <span class="text-gray-800 font-semibold">{{ profile.label }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BLOQUE 7 – CTA FINAL -->
    <section class="py-24 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 left-10 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
      </div>
      <div class="relative container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-5xl font-bold mb-4">Empieza hoy</h2>
        <p class="text-xl text-blue-100 mb-10 max-w-xl mx-auto">
          Regístrate y comienza a generar ingresos compartiendo protección.
        </p>
        <button
          @click="mostrarFormulario = true"
          class="inline-flex items-center gap-2 bg-white text-primary-700 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-xl"
        >
          👉 Crear mi cuenta de Afiliado
        </button>

        <!-- Bloque legal -->
        <div class="mt-14 max-w-2xl mx-auto border-t border-white/20 pt-8">
          <p class="text-blue-200 text-xs leading-relaxed">
            Al registrarte aceptas los Términos y Condiciones del Programa de Afiliados SEGURU.
            El Afiliado actúa como promotor digital de enlaces y no realiza intermediación de seguros ni asesoría.
          </p>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CrearAliadoForm from './CrearAliadoForm.vue';
import { AliadosService, type Aliado } from '../services/aliados.service';

const mostrarFormulario = ref(false);
const aliadoPadreNombre = ref('');
const buscandoAliadoPadre = ref(false);

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  const codigoPadre = params.get('codigo-unico-padre-aliado');
  if (!codigoPadre) return;

  const codigoSanitizado = codigoPadre.toUpperCase().replace(/[^A-Z0-9]/g, '');
  localStorage.setItem('codigo_padre_aliado', codigoSanitizado);

  buscandoAliadoPadre.value = true;
  try {
    const aliado = await AliadosService.encontrarAliado({ codigo_unico: codigoSanitizado });
    if (aliado) {
      aliadoPadreNombre.value = aliado.usuario?.persona?.nombre ?? aliado.usuario?.usuario ?? codigoSanitizado;
    }
  } catch {
    // Silencioso — el mensaje simplemente no aparece si falla
  } finally {
    buscandoAliadoPadre.value = false;
  }
});

function onAliadoCreado(aliado: Aliado) {
  mostrarFormulario.value = false;
  console.log('Aliado creado:', aliado);
}

const steps = [
  {
    number: 1,
    title: 'Únete',
    description: 'Inscríbete en el programa completando el formulario digital y acepta los términos.',
    cardClass: 'bg-primary-500 text-white',
    titleClass: 'text-white',
    textClass: 'text-blue-100',
    iconClass: 'text-white',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>`
  },
  {
    number: 2,
    title: 'Comparte',
    description: 'Recibe tu enlace personalizado y compártelo en redes sociales, WhatsApp o con tu comunidad.',
    cardClass: 'bg-primary-100 text-gray-900',
    titleClass: 'text-primary-800',
    textClass: 'text-gray-600',
    iconClass: 'text-primary-600',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" /></svg>`
  },
  {
    number: 3,
    title: 'Gana',
    description: 'Recibe comisión cada vez que una persona contrate digitalmente desde tu enlace.',
    cardClass: 'bg-primary-900 text-white',
    titleClass: 'text-white',
    textClass: 'text-blue-200',
    iconClass: 'text-blue-300',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-14 h-14"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" /></svg>`
  }
];

const products = [
  { icon: '🏠', name: 'Protección familiar' },
  { icon: '🏡', name: 'Seguro para alojamientos turísticos' },
  { icon: '💊', name: 'Planes de asistencia y salud' },
  { icon: '💼', name: 'Beneficios empresariales' }
];

const benefits = [
  'Comisiones por venta confirmada',
  'Sin metas obligatorias',
  'Sin inversión inicial',
  'Plataforma 100% digital',
  'Material promocional oficial',
  'Puedes hacerlo desde cualquier lugar'
];

const profiles = [
  { icon: '📱', label: 'Creadores de contenido' },
  { icon: '👥', label: 'Comunidades digitales' },
  { icon: '🏢', label: 'Líderes empresariales' },
  { icon: '💬', label: 'Administradores de grupos' },
  { icon: '🌐', label: 'Personas con redes de contacto' }
];
</script>
