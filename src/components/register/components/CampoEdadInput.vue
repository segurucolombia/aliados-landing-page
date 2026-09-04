<template>
  <div>
    <!--
      El campo `edad` se captura como fecha de nacimiento: en la renovación la venta
      se recotiza con las respuestas guardadas y la edad se recalcula sola.
    -->
    <input
      :id="id"
      type="date"
      :min="limites.min"
      :max="limites.max"
      :class="[claseInput, { 'border-red-400': invalido }]"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @change="$emit('change')"
      @blur="$emit('change')"
    />

    <span v-if="edad !== null" class="block text-xs text-gray-600 italic mt-1">
      Edad: {{ edad }} años
    </span>

    <!--
      Recargo que dispara la fecha elegida: es solo anticipo, cobra el backend.
      El motivo de rechazo lo muestra el formulario, junto con los del backend.
    -->
    <span
      v-for="(recargo, index) in recargos"
      :key="`recargo-${index}`"
      class="block text-xs font-medium text-amber-700 mt-1"
    >
      ⚠ {{ recargo }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  calcularEdad,
  evaluarReglasEdad,
  limitesFechaNacimiento,
  type CampoConReglas,
} from '../../../utils/reglasCampos';

const props = withDefaults(defineProps<{
  /** Un campo `edad` de los adicionales o un `EDAD` del titular: mismas reglas */
  campo: CampoConReglas;
  modelValue: string;
  id?: string;
  invalido?: boolean;
  /** Dentro de un grupo de registros el control va más compacto */
  compacto?: boolean;
  /** Clases del input, para que se vea como el resto del formulario que lo usa */
  claseControl?: string;
}>(), {
  modelValue: '',
  id: undefined,
  invalido: false,
  compacto: false,
  claseControl: undefined,
});

defineEmits<{
  (e: 'update:modelValue', valor: string): void;
  (e: 'change'): void;
}>();

const claseInput = computed(() => {
  if (props.claseControl) return props.claseControl;
  return props.compacto ? 'p-2 border rounded-md w-full text-sm' : 'p-2 border rounded-md w-full';
});

/**
 * `edadMinima` / `edadMaxima` no son topes duros: solo se bloquea el rango cuyo
 * límite tiene una regla que RECHAZA (o que no tiene regla).
 */
const limites = computed(() => limitesFechaNacimiento(props.campo));

const edad = computed(() => (props.modelValue ? calcularEdad(props.modelValue) : null));

/** Solo lo que dispara la fecha elegida: si la regla no aplica, no se muestra nada */
const recargos = computed(() => evaluarReglasEdad(props.campo, props.modelValue).recargos);
</script>
