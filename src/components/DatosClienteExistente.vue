<template>
  <!-- Lo único que se muestra de un cliente que ya existe, enmascarado desde el backend -->
  <div class="datos-cliente">
    <div v-if="cliente.nombre" class="linea"><span>Nombre</span><span>{{ cliente.nombre }}</span></div>
    <div v-if="cliente.correo" class="linea"><span>Correo</span><span>{{ cliente.correo }}</span></div>
    <div v-if="cliente.telefono" class="linea"><span>Teléfono</span><span>{{ cliente.telefono }}</span></div>
  </div>
</template>

<script setup lang="ts">
import type { ClientePorDocumento } from '../services/clientes.service';

defineProps<{ cliente: ClientePorDocumento }>();
</script>

<style scoped>
.datos-cliente {
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
}

.linea {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.25rem 0;
  font-size: 0.95rem;
  color: #374151;
}

.linea span:last-child {
  font-weight: 600;
  color: #111827;
  text-align: right;
  word-break: break-word;
}
</style>
