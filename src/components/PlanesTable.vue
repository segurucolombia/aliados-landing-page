<template>
  <!-- Vista Mobile: Cards -->
  <div class="md:hidden space-y-4">
    <div
      v-for="plan in planes"
      :key="plan.id"
      class="flex items-stretch gap-1"
    >
      <!-- Logo Vigilado al lado izquierdo de cada card -->
      <div class="flex items-center justify-center flex-shrink-0">
        <img src="/img/vigilado-superintendencia.png" class="w-5" alt="Vigilado Superintendencia Financiera">
      </div>

      <!-- Card -->
      <div
        class="flex-1 rounded-2xl border-2 overflow-hidden shadow-md"
      >
      <!-- Card Header -->
      <div
        class="px-5 py-4"
        :style="plan.destacado && primaryColor ? { backgroundColor: hexToRgba(primaryColor, 0.12) } : {}"
        :class="!primaryColor && plan.destacado ? 'bg-primary-50' : 'bg-gray-50'"
      >
        <div class="flex items-center justify-between mb-1">
          <span class="text-lg font-bold text-gray-900">{{ plan.nombre }}</span>
          <span
            v-if="plan.destacado"
            class="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
            :style="primaryColor ? { backgroundColor: primaryColor } : {}"
            :class="!primaryColor ? 'bg-primary-600' : ''"
          >Recomendado</span>
        </div>
        <div class="flex items-baseline gap-1">
          <span
            class="text-3xl font-bold"
            :style="primaryColor ? { color: primaryColor } : {}"
            :class="!primaryColor ? 'text-primary-700' : ''"
          >{{ formatPrice(plan.precio) }}</span>
          <span class="text-sm text-gray-600">{{ plan.moneda }}</span>
        </div>
        <span class="text-xs text-gray-500">{{ formatPeriodicidad(plan.periodicidad) }}</span>
      </div>

      <!-- Coberturas list -->
      <div class="bg-white divide-y divide-gray-100">
        <div
          v-for="cobertura in coberturas"
          :key="cobertura.id"
          class="px-5 py-3 flex items-start gap-3"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-gray-900">{{ cobertura.nombre }}</p>
            <p v-if="cobertura.descripcion" class="text-xs text-gray-500 mt-0.5">{{ cobertura.descripcion }}</p>
            <p
              v-if="getCoberturaInfo(plan, cobertura.id)?.aplica && getCoberturaInfo(plan, cobertura.id)?.valorCubierto"
              class="text-sm font-bold mt-1"
              :style="primaryColor ? { color: primaryColor } : {}"
              :class="!primaryColor ? 'text-primary-700' : ''"
            >{{ formatCurrency(getCoberturaInfo(plan, cobertura.id)!.valorCubierto!) }}</p>
          </div>
          <div class="flex-shrink-0 mt-0.5">
            <div
              v-if="getCoberturaInfo(plan, cobertura.id)?.aplica"
              class="w-7 h-7 rounded-full flex items-center justify-center"
              :style="primaryColor ? { backgroundColor: hexToRgba(primaryColor, 0.12) } : {}"
              :class="!primaryColor ? 'bg-primary-100' : ''"
            >
              <svg class="w-4 h-4" :style="primaryColor ? { color: primaryColor } : {}" :class="!primaryColor ? 'text-primary-600' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div v-else class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="px-5 py-4 bg-gray-50">
        <button
          @click="$emit('seleccionar-plan', plan)"
          :style="getButtonStyle(plan)"
          :class="[
            'w-full px-6 py-3 rounded-lg font-semibold transition-all shadow-md text-white',
            !estilos && (plan.destacado
              ? 'bg-primary-700 hover:bg-primary-800 ring-2 ring-primary-600 ring-offset-2'
              : 'bg-primary-600 hover:bg-primary-700')
          ]"
        >Comprar</button>
      </div>
      </div>
    </div>
  </div>

  <!-- Vista Desktop: Tabla -->
  <div class="hidden md:block overflow-x-auto">
    <div class="min-w-full inline-block align-middle">
      <div class="overflow-hidden border border-gray-200 rounded-2xl shadow-lg">
        <table class="min-w-full divide-y divide-gray-200">
          <!-- Table Header -->
          <thead class="bg-gradient-to-b from-gray-50 to-white border-b-2 border-primary-600 shadow-sm">
            <tr>
              <!-- Primera columna - Coberturas -->
              <th class="sticky left-0 z-20 px-6 py-6 text-left bg-primary-100 to-white">
                <span class="text-lg font-bold text-gray-900">Coberturas</span>
              </th>

              <!-- Columnas de Planes -->
              <th
                v-for="plan in planes"
                :key="plan.id"
                class="px-6 py-6 text-center relative bg-primary-100 to-white"
              >
                <div class="flex flex-col items-center">
                  <span class="text-xl font-bold text-gray-900 mb-2">{{ plan.nombre }}</span>
                  <span class="text-sm text-gray-600 mb-3">{{ plan.descripcion }}</span>
                  <div class="flex items-baseline gap-1">
                    <span class="text-3xl font-bold text-primary-700" >{{ formatPrice(plan.precio) }}</span>
                    <span class="text-sm text-gray-600">{{ plan.moneda }}</span>
                  </div>
                  <span class="text-xs text-gray-500 mt-1">{{ formatPeriodicidad(plan.periodicidad) }}</span>
                </div>
              </th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(cobertura, index) in coberturas"
              :key="cobertura.id"
              :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'"
              class="hover:bg-blue-50 transition-colors"
            >
              <!-- Primera columna - Nombre de Cobertura -->
              <td class="sticky left-0 z-10 px-6 py-5 font-semibold text-gray-900"
                  :class="index % 2 === 0 ? 'bg-gray-50' : 'bg-white'">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                  <div>
                    <p class="font-semibold text-gray-900">{{ cobertura.nombre }}</p>
                    <p v-if="cobertura.descripcion" class="text-sm text-gray-600 mt-1">{{ cobertura.descripcion }}</p>
                  </div>
                </div>
              </td>

              <!-- Columnas de Coberturas por Plan -->
              <td
                v-for="plan in planes"
                :key="`${cobertura.id}-${plan.id}`"
                class="px-6 py-5 text-center"
                :class="getCellClass(plan, cobertura.id)"
              >
                <div v-if="getCoberturaInfo(plan, cobertura.id)">
                  <!-- Cobertura Aplica -->
                  <div v-if="getCoberturaInfo(plan, cobertura.id)?.aplica" class="flex flex-col items-center gap-2">
                    <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center" >
                      <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>

                    <!-- Valor Cubierto -->
                    <div v-if="getCoberturaInfo(plan, cobertura.id)?.valorCubierto" class="mt-2">
                      <p class="text-lg font-bold text-primary-700" >
                        {{ formatCurrency(getCoberturaInfo(plan, cobertura.id)?.valorCubierto!) }}
                      </p>
                    </div>

                    <!-- Descripción/Detalles -->
                    <div v-if="getCoberturaInfo(plan, cobertura.id)?.descripcion" class="mt-1">
                      <p class="text-sm text-gray-700">
                        {{ getCoberturaInfo(plan, cobertura.id)?.descripcion }}
                      </p>
                    </div>

                    <!-- Detalles adicionales -->
                    <div v-if="getCoberturaInfo(plan, cobertura.id)?.detalles" class="mt-1">
                      <p class="text-xs text-gray-600 italic">
                        {{ getCoberturaInfo(plan, cobertura.id)?.detalles }}
                      </p>
                    </div>
                  </div>

                  <!-- Cobertura No Aplica -->
                  <div v-else class="flex flex-col items-center">
                    <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </div>
                    <p class="text-xs text-gray-400 mt-2">No incluido</p>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>

          <!-- Table Footer - Botones CTA -->
          <tfoot class="bg-gray-50">
            <tr>
              <td class="sticky left-0 z-10 px-6 py-6 bg-gray-50"></td>
              <td
                v-for="plan in planes"
                :key="`footer-${plan.id}`"
                class="px-6 py-6 text-center"
              >
                <button
                  @click="$emit('seleccionar-plan', plan)"
                  :style="getButtonStyle(plan)"
                  :class="[
                    'w-full px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md text-white',
                    !estilos && (plan.destacado
                      ? 'bg-primary-700 hover:bg-primary-800 ring-2 ring-primary-600 ring-offset-2'
                      : 'bg-primary-600 hover:bg-primary-700')
                  ]"
                >
                  Comprar
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Plan, Cobertura, CoberturaPlan, EstilosAseguradora } from '../types/planes';

interface Props {
  planes: Plan[];
  coberturas: Cobertura[];
  estilos?: EstilosAseguradora | null;
}

const props = defineProps<Props>();
defineEmits(['seleccionar-plan']);

const primaryColor = computed(() => props.estilos?.color_primario || null);

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};


const getButtonStyle = (plan: Plan) => {
  if (!primaryColor.value) return {};
  const style: Record<string, string> = { backgroundColor: primaryColor.value };
  if (plan.destacado) {
    style.boxShadow = `0 0 0 2px white, 0 0 0 4px ${primaryColor.value}`;
  }
  return style;
};

const getCoberturaInfo = (plan: Plan, coberturaId: string): CoberturaPlan | undefined => {
  return plan.coberturas.find(c => c.coberturaId === coberturaId);
};

const getCellClass = (plan: Plan, coberturaId: string) => {
  const info = getCoberturaInfo(plan, coberturaId);
  if (!info) return 'bg-gray-50';

  if (info.aplica) {
    return plan.destacado ? 'bg-blue-50/50' : 'bg-white';
  }
  return 'bg-gray-50';
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const formatPeriodicidad = (periodicidad: string): string => {
  const map: Record<string, string> = {
    mensual: 'por mes',
    trimestral: 'por trimestre',
    semestral: 'por semestre',
    anual: 'por año'
  };
  return map[periodicidad] || periodicidad;
};
</script>

<style scoped>
/* Asegurar que la primera columna se mantenga fija al hacer scroll horizontal */
.sticky {
  position: sticky;
}

/* Estilos para tabla responsive */
@media (max-width: 768px) {
  table {
    font-size: 0.875rem;
  }

  th, td {
    padding: 0.75rem;
  }
}
</style>
