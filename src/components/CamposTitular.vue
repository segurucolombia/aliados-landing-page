<template>
  <div class="campos-titular">
    <div class="form-grid">
      <div
        v-for="campo in camposAPintar"
        :key="campo.clave"
        class="field"
        :class="{ 'field-completo': campo.tipo === 'TEXTAREA' }"
      >
        <label :for="idCampo(campo)">
          {{ campo.nombre }} <span v-if="campo.requerido" class="required">*</span>
        </label>

        <!-- Texto largo -->
        <Textarea
          v-if="control(campo) === 'textarea'"
          :id="idCampo(campo)"
          v-model="datos[campo.clave]"
          rows="4"
          :class="{ 'p-invalid': !!mensajeError(campo) }"
          @blur="validarCampo(campo)"
        />

        <!-- Selección: las opciones vienen con la configuración del campo -->
        <Dropdown
          v-else-if="control(campo) === 'select'"
          :id="idCampo(campo)"
          v-model="datos[campo.clave]"
          :options="opcionesDeCampo(campo)"
          optionLabel="etiqueta"
          optionValue="clave"
          placeholder="Seleccione una opción"
          :class="{ 'p-invalid': !!mensajeError(campo) }"
          @change="validarCampo(campo)"
        >
          <!-- Lo que agrega elegir esa opción, igual que en los campos adicionales -->
          <template #option="{ option }">
            <div class="opcion">
              <span>{{ option.etiqueta }}</span>
              <span v-if="recargoDeOpcion(campo, option.clave)" class="opcion-recargo">
                {{ recargoDeOpcion(campo, option.clave) }}
              </span>
              <span v-else-if="rechazoDeOpcion(campo, option.clave)" class="opcion-rechazo">
                No disponible
              </span>
            </div>
          </template>
        </Dropdown>

        <!-- Ciudad: el selector que ya existe -->
        <AutoComplete
          v-else-if="control(campo) === 'ciudad'"
          :id="idCampo(campo)"
          v-model="datos[campo.clave]"
          optionLabel="name"
          :suggestions="ciudadesBuscadas"
          :class="{ 'p-invalid': !!mensajeError(campo) }"
          input-class="w-full"
          @complete="buscarCiudades"
          @change="validarCampo(campo)"
        />

        <!--
          EDAD: fecha de nacimiento con el mismo control que los campos adicionales, que
          muestra la edad y el recargo que dispara la fecha elegida.
        -->
        <CampoEdadInput
          v-else-if="campo.tipo === 'EDAD'"
          :id="idCampo(campo)"
          :campo="campo"
          v-model="datos[campo.clave]"
          :invalido="!!mensajeError(campo)"
          clase-control="p-inputtext p-component w-full"
          @change="validarCampo(campo)"
        />

        <!-- Fecha: se guarda y se envía como YYYY-MM-DD -->
        <input
          v-else-if="control(campo) === 'fecha'"
          :id="idCampo(campo)"
          v-model="datos[campo.clave]"
          type="date"
          class="p-inputtext p-component"
          :class="{ 'p-invalid': !!mensajeError(campo) }"
          @blur="validarCampo(campo)"
          @change="validarCampo(campo)"
        />

        <!-- Texto y número -->
        <InputText
          v-else-if="control(campo) === 'texto' || control(campo) === 'numero'"
          :id="idCampo(campo)"
          v-model="datos[campo.clave]"
          :type="campo.clave_sistema === 'EMAIL' ? 'email' : 'text'"
          :inputmode="control(campo) === 'numero' ? 'numeric' : undefined"
          :maxlength="maxLengthDeCampo(campo)"
          :class="{ 'p-invalid': !!mensajeError(campo) }"
          @blur="validarCampo(campo)"
        />

        <!--
          Tipo que la landing no conoce: no se captura como texto libre, se muestra
          bloqueado y la validación impide continuar.
        -->
        <InputText
          v-else
          :id="idCampo(campo)"
          model-value=""
          readonly
          disabled
          placeholder="Campo no disponible"
          class="p-invalid"
        />

        <!--
          Lo que este campo puede agregarle a la compra. Es solo anticipo: el cobro lo
          calcula el backend al cotizar (en EDAD lo muestra el propio control, y solo
          cuando la fecha elegida dispara la regla).
        -->
        <div v-if="avisos(campo).length > 0" class="campo-avisos">
          <span v-for="(aviso, index) in avisos(campo)" :key="index" :class="aviso.clase">
            {{ aviso.texto }}
          </span>
        </div>

        <small v-if="mensajeError(campo)" class="p-error">{{ mensajeError(campo) }}</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import AutoComplete from 'primevue/autocomplete';
import CampoEdadInput from './register/components/CampoEdadInput.vue';
import type { CampoTitular, DatosTitular } from '../types/planes';
import type { RechazoVenta } from '../types/cotizacion';
import { CiudadesColombiaService, type Ciudad } from '../services/ciudades-colombia.service';
import { mensajeDeRechazo } from '../utils/rechazosCampos';
import {
  avisoDeOpcionElegida,
  avisosDeRecargo,
  avisosDeRechazo,
  recargoDeOpcion,
  rechazoDeOpcion,
} from '../utils/reglasCampos';
import {
  camposVisibles,
  controlDeCampo,
  estadoInicialTitular,
  maxLengthDeCampo,
  opcionesDeCampo,
  sanitizarValorTitular,
  textoDeValor,
  validarCampoTitular,
  validarTitular,
} from '../utils/camposTitular';

/**
 * Formulario del titular. No tiene ningún campo fijo: qué se pide, en qué orden, con
 * qué etiqueta y qué es obligatorio sale de `version.campos_titular`.
 *
 * El estado va indexado por la `clave` del campo, que es como el backend va a recibir
 * al titular. La traducción al payload de venta de hoy vive en
 * `adaptarTitularAPayloadVenta`, no acá.
 */
const props = withDefaults(defineProps<{
  /** Configuración del titular de la versión del plan, ya ordenada */
  campos: CampoTitular[];
  /** Estado con el que arranca el formulario (al volver a este paso) */
  modelValue?: DatosTitular;
  /**
   * Rechazos del backend (422) que caen en campos del titular: son la razón por la
   * que la venta no se puede hacer, escrita por quien configuró la regla.
   */
  rechazos?: RechazoVenta[];
}>(), {
  modelValue: () => ({}),
  rechazos: () => [],
});

const emit = defineEmits<{
  (e: 'update:modelValue', titular: DatosTitular): void;
  (e: 'update:valid', valid: boolean): void;
}>();

/** Respuestas del titular, indexadas por `clave` */
const datos = ref<DatosTitular>({});
/** Errores visibles, indexados por `clave`. Se muestran al salir del campo o al enviar. */
const errores = ref<Record<string, string>>({});
const ciudadesBuscadas = ref<Array<Ciudad & { name: string }>>([]);

/** Los campos que aplican con el tipo de persona elegido */
const camposAPintar = computed(() => camposVisibles(props.campos, datos.value));

const idCampo = (campo: CampoTitular): string => `titular-${campo.clave}`;

/** Con qué control se pinta el campo; null si su tipo no se reconoce */
const control = (campo: CampoTitular) => controlDeCampo(campo);

/**
 * Avisos de las reglas del campo: lo que encarece la compra y lo que la impediría.
 * Es presentación, no cálculo: el total y los bloqueos los resuelve el backend al
 * cotizar. Un campo `EDAD` no los lleva acá porque su control ya muestra el recargo
 * que dispara la fecha elegida, y solo cuando aplica.
 */
const avisos = (campo: CampoTitular): Array<{ texto: string; clase: string }> => {
  if (campo.tipo === 'EDAD') return [];

  const lista = [
    ...avisosDeRecargo(campo).map((texto) => ({ texto, clase: 'aviso-recargo' })),
    ...avisosDeRechazo(campo).map((texto) => ({ texto, clase: 'aviso-rechazo' })),
  ];

  // Lo que ya disparó la opción elegida, debajo del campo y no solo dentro de la lista
  if (control(campo) === 'select') {
    const elegida = textoDeValor(datos.value[campo.clave]);
    const recargo = elegida ? avisoDeOpcionElegida(campo, elegida) : '';
    const rechazo = elegida ? rechazoDeOpcion(campo, elegida) : '';

    if (recargo) lista.unshift({ texto: recargo, clase: 'aviso-recargo' });
    if (!recargo && rechazo) lista.unshift({ texto: rechazo, clase: 'aviso-rechazo' });
  }

  return lista;
};

/**
 * Lo que se le muestra al cliente debajo del campo. El rechazo del backend manda:
 * es el motivo por el que no se puede vender, y va tal cual como lo escribió el admin.
 */
const mensajeError = (campo: CampoTitular): string =>
  mensajeDeRechazo(props.rechazos, campo.clave) || errores.value[campo.clave] || '';

const buscarCiudades = async (event: any): Promise<void> => {
  const { data } = await CiudadesColombiaService.buscarPorNombre(event.query, 20);
  // AutoComplete necesita la propiedad 'name'
  ciudadesBuscadas.value = data.map((ciudad) => ({ ...ciudad, name: ciudad.nombre }));
};

/** El tipo del campo manda el formato: se aplica sobre el estado, no sobre el evento */
const sanitizarEstado = (): void => {
  props.campos.forEach((campo) => {
    const limpio = sanitizarValorTitular(campo, datos.value[campo.clave]);
    if (limpio !== datos.value[campo.clave]) datos.value[campo.clave] = limpio;
  });
};

const validarCampo = (campo: CampoTitular): void => {
  const error = validarCampoTitular(campo, datos.value, props.campos);
  if (error) {
    errores.value[campo.clave] = error;
  } else {
    delete errores.value[campo.clave];
  }
};

/** Marca todos los errores. Devuelve si el formulario se puede enviar. */
const validarTodo = (): boolean => {
  errores.value = validarTitular(props.campos, datos.value);
  return Object.keys(errores.value).length === 0;
};

const esValido = computed(() => Object.keys(validarTitular(props.campos, datos.value)).length === 0);

// Una configuración nueva (otra versión del plan) rehace el formulario: se conserva
// solo lo que la nueva versión sigue pidiendo
watch(
  () => props.campos,
  () => {
    datos.value = estadoInicialTitular(props.campos, { ...props.modelValue, ...datos.value });
    errores.value = {};
    emit('update:modelValue', { ...datos.value });
    emit('update:valid', esValido.value);
  },
  { immediate: true },
);

watch(
  datos,
  () => {
    sanitizarEstado();

    // Un error ya visible se recalcula al tipear; los demás esperan al blur
    Object.keys(errores.value).forEach((clave) => {
      const campo = props.campos.find((c) => c.clave === clave);
      if (campo) validarCampo(campo);
    });

    emit('update:modelValue', { ...datos.value });
    emit('update:valid', esValido.value);
  },
  { deep: true },
);

defineExpose({ validarTodo });
</script>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* El texto largo ocupa la fila completa */
.field-completo {
  grid-column: 1 / -1;
}

.field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.required {
  color: #dc2626;
}

.campo-avisos {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.aviso-recargo {
  font-size: 0.75rem;
  font-weight: 500;
  color: #b45309;
}

.aviso-rechazo {
  font-size: 0.75rem;
  font-style: italic;
  color: #6b7280;
}

.opcion {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
}

.opcion-recargo {
  font-size: 0.75rem;
  font-weight: 600;
  color: #b45309;
  white-space: nowrap;
}

.opcion-rechazo {
  font-size: 0.75rem;
  font-weight: 600;
  color: #dc2626;
  white-space: nowrap;
}

.field :deep(.p-autocomplete),
.field :deep(.p-autocomplete-input) {
  width: 100%;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
