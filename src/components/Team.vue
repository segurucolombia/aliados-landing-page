<template>
  <section id="equipo" class="py-20 bg-gradient-to-br from-primary-700 to-primary-900 text-white relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-20 right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
    <div class="absolute top-1/2 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>

    <div class="container mx-auto px-4 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-12 h-1 bg-white/50"></div>
          <span class="text-white/90 font-semibold">Nuestro Equipo</span>
          <div class="w-12 h-1 bg-white/50"></div>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold mb-4">
          Profesionales comprometidos
        </h2>
        <p class="text-xl text-blue-100 max-w-2xl mx-auto">
          Conoce a nuestro equipo de expertos dedicados a brindarte el mejor servicio
        </p>
      </div>

      <!-- Team Swiper Slider -->
      <div class="relative px-12">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="20"
          :loop="true"
          :autoplay="{
            delay: 3500,
            disableOnInteraction: false,
          }"
          :navigation="{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }"
          :pagination="{
            clickable: true,
            el: '.swiper-pagination-custom',
          }"
          :breakpoints="{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 25,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
            1280: {
              slidesPerView: 5,
              spaceBetween: 30,
            }
          }"
          class="team-swiper"
        >
          <swiper-slide
            v-for="member in teamMembers"
            :key="member.id"
          >
            <!-- Card (más pequeño) -->
            <div class="group bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl h-full">
              <!-- Image Container (más pequeño) -->
              <div class="relative h-48 overflow-hidden bg-gradient-to-br from-primary-600 to-primary-800">
                <img
                  :src="`/img/team/${member.image}`"
                  :alt="member.name"
                  class="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />

                <!-- Overlay on hover -->
                <div class="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <!-- Social Links -->
                  <div class="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                    <a
                      v-if="member.socialLinks?.facebook"
                      :href="member.socialLinks.facebook"
                      target="_blank"
                      class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white transform hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clip-rule="evenodd"></path>
                      </svg>
                    </a>
                    <a
                      v-if="member.socialLinks?.instagram"
                      :href="member.socialLinks.instagram"
                      target="_blank"
                      class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transform hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                    </a>
                    <a
                      v-if="member.socialLinks?.linkedin"
                      :href="member.socialLinks.linkedin"
                      target="_blank"
                      class="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transform hover:scale-110 transition-all duration-200 shadow-lg"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Content (más compacto) -->
              <div class="p-4 text-center">
                <h3 class="text-base font-bold text-white mb-1 group-hover:text-blue-100 transition-colors line-clamp-2">
                  {{ member.name }}
                </h3>
                <p class="text-xs text-blue-200 font-medium line-clamp-1">
                  {{ member.position }}
                </p>
              </div>
            </div>
          </swiper-slide>
        </swiper>

        <!-- Navigation Arrows -->
        <button
          class="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg disabled:opacity-30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button
          class="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all shadow-lg disabled:opacity-30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <!-- Pagination Dots -->
      <div class="swiper-pagination-custom flex justify-center gap-2 mt-8"></div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { TeamMember } from '../types/team';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Swiper modules
const modules = [Navigation, Pagination, Autoplay];

// Datos de ejemplo del equipo
const teamMembers = ref<TeamMember[]>([
  {
    id: '1',
    name: 'Jhonatan Argüello Ovalle',
    position: 'Gerente de Negocios',
    image: 'team-3-7.jpg',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: '2',
    name: 'July Natalia Gaona Prada',
    position: 'Asesor Jurídico',
    image: 'team-3-1.jpg',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: '3',
    name: 'Victor Rangel Alvarez',
    position: 'Desarrollo de Negocios',
    image: 'team-3-2.jpg',
    socialLinks: {
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: '4',
    name: 'Olga Nubia Ovalle Florez',
    position: 'Cartera',
    image: 'team-3-5.jpg',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com'
    }
  },
  {
    id: '5',
    name: 'Milena Celis Solano',
    position: 'Analista Senior',
    image: 'team-3-3.jpg',
    socialLinks: {
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: '6',
    name: 'Zahira Jinneth Ardila',
    position: 'Analista Junior',
    image: 'team-3-4.jpg',
    socialLinks: {
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com'
    }
  },
  {
    id: '7',
    name: 'Maria Paula Alquichire',
    position: 'Tecnología',
    image: 'team-3-6.jpg',
    socialLinks: {
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com'
    }
  }
]);
</script>

<style scoped>
.team-swiper :deep(.swiper-pagination-custom) {
  position: relative;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.team-swiper :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.4);
  opacity: 1;
  transition: all 0.3s;
  border-radius: 9999px;
}

.team-swiper :deep(.swiper-pagination-bullet:hover) {
  background: rgba(255, 255, 255, 0.6);
}

.team-swiper :deep(.swiper-pagination-bullet-active) {
  width: 32px;
  background: white;
}
</style>
