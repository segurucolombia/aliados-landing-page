<template>
  <svg :width="width" :height="height" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
    <!-- Fondo redondeado verde claro -->
    <rect x="10" y="10" width="180" height="100" rx="15" ry="15" fill="#e6ffee" stroke="#d0f0d0" stroke-width="2"/>

    <!-- Cupón de descuento en verde oscuro -->
    <g transform="translate(65, 35)">
      <!-- Contorno del cupón -->
      <rect x="0" y="0" width="70" height="45" rx="4" ry="4" fill="none" stroke="#155724" stroke-width="5"/>

      <!-- Muesca izquierda -->
      <path d="M0,22 C-3,22 -3,16 0,16" fill="none" stroke="#155724" stroke-width="5" stroke-linecap="round"/>

      <!-- Muesca derecha -->
      <path d="M70,22 C73,22 73,16 70,16" fill="none" stroke="#155724" stroke-width="5" stroke-linecap="round"/>

      <!-- Punto izquierdo del símbolo de porcentaje -->
      <circle cx="25" cy="20" r="4" fill="#155724"/>

      <!-- Punto derecho del símbolo de porcentaje -->
      <circle cx="45" cy="30" r="4" fill="#155724"/>

      <!-- Línea diagonal del símbolo de porcentaje -->
      <line x1="20" y1="33" x2="48" y2="15" stroke="#155724" stroke-width="4" stroke-linecap="round"/>
    </g>
  </svg>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string;
  height?: string;
}>(), {
  width: '60px',
  height: '30px'
});
</script>
