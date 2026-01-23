<template>
  <div class="loading-overlay" v-if="visible">
    <div class="spinner"></div>
  </div>
</template>

<script setup>
defineProps({
  visible: Boolean
});
</script>

<style>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999999 !important;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 6px solid #2E2EBF; /* Azul principal */
  border-top: 6px solid white; /* Naranja */
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
