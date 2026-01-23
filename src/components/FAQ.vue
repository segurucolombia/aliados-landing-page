<template>
  <section id="faq" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <div class="flex flex-wrap gap-y-16 items-center">
        <!-- FAQ Image -->
        <div class="w-full xl:w-1/2 lg:w-1/3">
          <div class="faq-image relative">
            <div class="relative inline-block">
              <img
                src="/img/resources/faq-2-1.png"
                alt="Preguntas Frecuentes"
                class="w-full max-w-md rounded-3xl shadow-2xl"
                loading="lazy"
              />
              <div class="absolute -top-4 -left-4 w-32 h-32 bg-primary-200 rounded-full -z-10"></div>
              <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
            </div>
            <!-- <span class="absolute top-10 -right-10 w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg">
              <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </span> -->
          </div>
        </div>

        <!-- FAQ Content -->
        <div class="w-full xl:w-1/2 lg:w-2/3 xl:ml-auto">
          <div class="faq-content">
            <!-- Section Header -->
            <div class="mb-8">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-12 h-1 bg-primary-600"></div>
                <span class="text-primary-600 font-semibold">Preguntas Frecuentes</span>
              </div>
              <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Preguntas que quizás tú también<br class="hidden md:block" /> te haces
              </h2>
            </div>

            <!-- Accordion -->
            <div class="space-y-4">
              <div
                v-for="(faq, index) in faqs"
                :key="faq.id"
                class="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
                :class="{ 'border-primary-600 shadow-lg': activeIndex === index }"
              >
                <button
                  @click="toggleAccordion(index)"
                  class="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center gap-4 flex-1">
                    <span
                      class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                      :class="activeIndex === index ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'"
                    >
                      <svg
                        class="w-5 h-5 transition-transform duration-300"
                        :class="{ 'rotate-90': activeIndex === index }"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"></path>
                      </svg>
                    </span>
                    <h4
                      class="text-lg font-semibold transition-colors"
                      :class="activeIndex === index ? 'text-primary-600' : 'text-gray-900'"
                    >
                      {{ faq.question }}
                    </h4>
                  </div>
                </button>

                <!-- Accordion Content -->
                <transition
                  name="accordion"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave"
                >
                  <div v-show="activeIndex === index" class="accordion-content">
                    <div class="p-6 pt-0 pl-18 text-gray-600 leading-relaxed">
                      {{ faq.answer }}
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { FAQ } from '../types/faq';

// Datos de ejemplo - Serán reemplazados por consumo de API
const faqs = ref<FAQ[]>([
  {
    id: '1',
    question: '¿Es seguro comprar un seguro con SEGURU?',
    answer: 'Sí. SEGURU es una marca registrada de AIB SEGUROS - AMÉRICA INSURANCE BROKER LTDA., una agencia con más de 15 años de experiencia y presencia en toda Colombia. Estamos respaldados por más de 15 aseguradoras legalmente constituidas y vigiladas por la Superfinanciera de Colombia.',
    active: false
  },
  {
    id: '2',
    question: '¿Qué respaldo tengo si ocurre un siniestro?',
    answer: 'Te acompañamos durante todo el proceso. Nuestro equipo de siniestros te asesora paso a paso para garantizar que tu reclamación sea atendida de forma oportuna. Además, las pólizas que emitimos provienen de aseguradoras sólidas y reconocidas que responden cuando más las necesitas.',
    active: true
  },
  {
    id: '3',
    question: '¿Qué medios de pago aceptan?',
    answer: 'Puedes pagar con tarjeta débito o crédito, PSE, transferencia bancaria o incluso por links de pago personalizados. Nuestro sistema es 100% seguro y confiable. Ninguno de los miembros de nuestra empresa está autorizado para recibir dinero en efectivo.',
    active: false
  },
  {
    id: '4',
    question: '¿Puedo cancelar mi seguro si ya no lo necesito?',
    answer: 'Sí. En SEGURU creemos en la simplicidad y la libertad del cliente. Así como puedes comprar fácil, también puedes cancelar sin excusas ni trámites complicados. Solo contáctanos y nuestro equipo te acompañará para hacer el proceso claro, rápido y sin rodeos.',
    active: false
  }
]);

const activeIndex = ref<number | null>(1); // Segunda pregunta abierta por defecto

const toggleAccordion = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index;
};

// Animaciones del acordeón
const enter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = '0';
};

const afterEnter = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = 'auto';
};

const leave = (el: Element) => {
  const element = el as HTMLElement;
  element.style.height = element.scrollHeight + 'px';
  setTimeout(() => {
    element.style.height = '0';
  }, 0);
};
</script>

<style scoped>
.accordion-content {
  overflow: hidden;
  transition: height 0.3s ease-in-out;
}

.accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease-in-out;
}

.accordion-enter-from,
.accordion-leave-to {
  height: 0;
}

.pl-18 {
  padding-left: 4.5rem;
}
</style>
