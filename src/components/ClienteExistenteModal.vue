<template>
  <!-- Sin cerrar con la X ni con Escape: la persona tiene que decir si es o no -->
  <Dialog
    :visible="!!cliente"
    modal
    :closable="false"
    :draggable="false"
    header="Encontramos tus datos, ¿eres tú?"
    :style="{ width: '28rem' }"
    :breakpoints="{ '575px': '92vw' }"
  >
    <p class="text-gray-700 mb-4">Encontramos un cliente registrado con este documento.</p>
    <DatosClienteExistente v-if="cliente" :cliente="cliente" />
    <p class="text-sm text-gray-500 mt-4">{{ aviso }}</p>

    <template #footer>
      <Button label="No soy yo" class="p-button-secondary p-button-outlined" type="button" @click="emit('descartar')" />
      <Button label="Sí, soy yo" icon="pi pi-check" class="p-button-primary" type="button" @click="emit('confirmar')" />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import DatosClienteExistente from './DatosClienteExistente.vue';
import type { ClienteExistente } from '../composables/clienteExistente';

withDefaults(defineProps<{
  cliente: ClienteExistente | null;
  /** Qué pasa si la persona confirma */
  aviso?: string;
}>(), {
  aviso: 'Si confirmas, usaremos los datos que ya tenemos registrados.',
});

const emit = defineEmits<{
  (e: 'confirmar'): void;
  (e: 'descartar'): void;
}>();
</script>
