<template>
  <div class="min-h-screen bg-gray-50">
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pt-40 pb-32">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center">
          <div class="flex items-center justify-center gap-3 mb-6">
            <div class="w-12 h-1 bg-blue-300"></div>
            <span class="text-blue-200 font-semibold">Seguru</span>
            <div class="w-12 h-1 bg-blue-300"></div>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold mb-6">
            {{ t('affiliates.title') }}
          </h1>
          <p class="text-xl text-blue-100">
            {{ t('affiliates.sub-title') }}
          </p>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useTranslations } from '../i18n/utils';

const { t } = useTranslations();
</script>
