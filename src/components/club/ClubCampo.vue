<template>
  <div>
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}<span v-if="requerido" class="text-red-600" aria-hidden="true"> *</span>
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="tipoActual"
        :value="modelValue"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :maxlength="maxlength"
        :max="max"
        :required="requerido"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="describedBy"
        class="w-full border rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        :class="[error ? 'border-red-500' : 'border-gray-300', tipo === 'password' ? 'pr-20' : '']"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        @blur="$emit('blur')"
      />
      <button
        v-if="tipo === 'password'"
        type="button"
        class="absolute inset-y-0 right-0 px-3 text-sm font-medium text-primary-700 hover:text-primary-900"
        :aria-pressed="mostrarClave ? 'true' : 'false'"
        :aria-label="mostrarClave ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`"
        @click="mostrarClave = !mostrarClave"
      >
        {{ mostrarClave ? 'Ocultar' : 'Mostrar' }}
      </button>
    </div>
    <p v-if="ayuda" :id="`${id}-ayuda`" class="mt-1 text-xs text-gray-500">{{ ayuda }}</p>
    <p v-if="error" :id="`${id}-error`" class="mt-1 text-sm text-red-600">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{
  id: string;
  label: string;
  modelValue: string;
  tipo?: string;
  error?: string;
  ayuda?: string;
  autocomplete?: string;
  inputmode?: 'text' | 'numeric' | 'tel' | 'email';
  maxlength?: number;
  max?: string;
  requerido?: boolean;
}>(), {
  tipo: 'text',
  error: '',
  ayuda: '',
  autocomplete: 'off',
  inputmode: undefined,
  maxlength: undefined,
  max: undefined,
  requerido: true,
});

defineEmits<{
  (e: 'update:modelValue', valor: string): void;
  (e: 'blur'): void;
}>();

const mostrarClave = ref(false);
const tipoActual = computed(() => (props.tipo === 'password' && mostrarClave.value ? 'text' : props.tipo));

const describedBy = computed(() => {
  const ids = [props.ayuda ? `${props.id}-ayuda` : '', props.error ? `${props.id}-error` : ''].filter(Boolean);
  return ids.length ? ids.join(' ') : undefined;
});
</script>
