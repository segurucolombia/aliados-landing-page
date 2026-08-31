<template>
  <div v-if="tieneCamposAdicionales" class="campos-adicionales w-full">
    <div
      v-for="(seccion, seccionIndex) in secciones"
      :key="seccionIndex"
      class="seccion-card bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
    >
      <div class="seccion-header mb-4">
        <h3 class="text-lg font-bold text-blue-800">{{ seccion.titulo }}</h3>
        <p v-if="seccion.descripcion" class="text-sm text-gray-600 mt-1">{{ seccion.descripcion }}</p>
      </div>

      <div class="seccion-campos space-y-4">
        <div v-for="campo in seccion.campos" :key="campo.clave">
          <!-- Input Simple -->
          <div v-if="campo.tipo === 'input'" class="campo-group">
            <label :for="idCampo(seccionIndex, campo)" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>

            <!-- Textarea -->
            <textarea
              v-if="campo.tipoInput === 'textarea'"
              :id="idCampo(seccionIndex, campo)"
              :class="['p-2 border rounded-md w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              @blur="validarCampo(seccionIndex, campo)"
              rows="4"
            ></textarea>

            <!-- Ciudades -->
            <AutoComplete
              v-else-if="campo.tipoInput === 'ciudad'"
              :id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              option-label="name"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              input-class="w-full"
              :suggestions="ciudadesBuscadas"
              @complete="buscarCiudades"
              @change="validarCampo(seccionIndex, campo)"
            />

            <!-- Precio: número con formato de moneda -->
            <InputNumber
              v-else-if="campo.tipoInput === 'precio'"
              :input-id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              mode="currency"
              currency="COP"
              locale="es-CO"
              :max-fraction-digits="0"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              input-class="w-full"
              @blur="validarCampo(seccionIndex, campo)"
            />

            <!-- Plano: número sin formato -->
            <InputNumber
              v-else-if="campo.tipoInput === 'plano'"
              :input-id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              :use-grouping="false"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              input-class="w-full"
              @blur="validarCampo(seccionIndex, campo)"
            />

            <!-- Input normal (text, fecha, email, tel) -->
            <input
              v-else
              :id="idCampo(seccionIndex, campo)"
              :type="getInputType(campo.tipoInput)"
              :class="['p-2 border rounded-md w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              @blur="validarCampo(seccionIndex, campo)"
              @change="validarCampo(seccionIndex, campo)"
            />

            <CampoAvisos :campo="campo" />
            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>

          <!-- Dropdown -->
          <div v-else-if="campo.tipo === 'dropdown'" class="campo-group">
            <label :for="idCampo(seccionIndex, campo)" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <Select
              :id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              :options="campo.opciones"
              option-label="etiqueta"
              option-value="clave"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              @change="validarCampo(seccionIndex, campo)"
            >
              <template #option="{ option }">
                <OpcionConRecargo :campo="campo" :opcion="option" />
              </template>
            </Select>

            <CampoAvisos :campo="campo" />
            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>

          <!-- Multiselect -->
          <div v-else-if="campo.tipo === 'multiselect'" class="campo-group">
            <label :for="idCampo(seccionIndex, campo)" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <MultiSelect
              :id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              :options="campo.opciones"
              option-label="etiqueta"
              option-value="clave"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              @change="validarCampo(seccionIndex, campo)"
            >
              <template #option="{ option }">
                <OpcionConRecargo :campo="campo" :opcion="option" />
              </template>
            </MultiSelect>

            <CampoAvisos :campo="campo" />
            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>

          <!-- Autocomplete de ciudades -->
          <div v-else-if="campo.tipo === 'autocomplete'" class="campo-group">
            <label :for="idCampo(seccionIndex, campo)" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <AutoComplete
              :id="idCampo(seccionIndex, campo)"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              option-label="name"
              :class="['w-full', { 'border-red-400': hasError(seccionIndex, campo.clave) }]"
              input-class="w-full"
              :suggestions="ciudadesBuscadas"
              @complete="buscarCiudades"
              @change="validarCampo(seccionIndex, campo)"
            />

            <CampoAvisos :campo="campo" />
            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>

          <!-- Edad (se captura la fecha de nacimiento y se calcula la edad) -->
          <div v-else-if="campo.tipo === 'edad'" class="campo-group">
            <label :for="idCampo(seccionIndex, campo)" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <CampoEdadInput
              :id="idCampo(seccionIndex, campo)"
              :campo="campo"
              v-model="datosFormulario[seccionIndex][campo.clave]"
              :invalido="hasError(seccionIndex, campo.clave)"
              @change="validarCampo(seccionIndex, campo)"
            />

            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>

          <!-- Grupo de Inputs Repetibles -->
          <div v-else-if="campo.tipo === 'grupo_inputs'" class="campo-group">
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>

            <div
              v-for="(entrada, entradaIndex) in datosFormulario[seccionIndex][campo.clave]"
              :key="entradaIndex"
              class="grupo-entrada bg-gray-50 border border-gray-300 rounded-md p-4 mb-3 relative"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600">
                  {{ campo.nombre }} #{{ Number(entradaIndex) + 1 }}
                </span>
                <button
                  v-if="datosFormulario[seccionIndex][campo.clave].length > 1"
                  @click="eliminarEntrada(seccionIndex, campo.clave, Number(entradaIndex))"
                  class="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                  type="button"
                  :aria-label="`Eliminar ${campo.nombre} #${Number(entradaIndex) + 1}`"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="subcampo in campo.campos" :key="subcampo.clave" class="subcampo">
                  <!-- Input dentro del grupo -->
                  <div v-if="subcampo.tipo === 'input'">
                    <label :for="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="esRequerido(subcampo)" class="text-red-600">*</span>
                    </label>
                    <InputNumber
                      v-if="subcampo.tipoInput === 'precio' || subcampo.tipoInput === 'plano'"
                      :input-id="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)"
                      v-model="entrada[subcampo.clave]"
                      :mode="subcampo.tipoInput === 'precio' ? 'currency' : 'decimal'"
                      currency="COP"
                      locale="es-CO"
                      :max-fraction-digits="0"
                      :use-grouping="subcampo.tipoInput === 'precio'"
                      class="w-full text-sm"
                      input-class="w-full"
                    />
                    <input
                      v-else
                      :id="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)"
                      :type="getInputType(subcampo.tipoInput)"
                      :class="['p-2 border rounded-md w-full text-sm', { 'border-red-400': !!errorDeSubcampo(seccionIndex, campo, subcampo, Number(entradaIndex)) }]"
                      v-model="entrada[subcampo.clave]"
                    />
                  </div>

                  <!-- Fecha de nacimiento dentro del grupo -->
                  <div v-else-if="subcampo.tipo === 'edad'">
                    <label :for="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="esRequerido(subcampo)" class="text-red-600">*</span>
                    </label>
                    <CampoEdadInput
                      :id="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)"
                      :campo="subcampo"
                      v-model="entrada[subcampo.clave]"
                      :invalido="!!errorDeSubcampo(seccionIndex, campo, subcampo, Number(entradaIndex))"
                      compacto
                    />
                  </div>

                  <!-- Dropdown dentro del grupo -->
                  <div v-else-if="subcampo.tipo === 'dropdown'">
                    <label :for="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="esRequerido(subcampo)" class="text-red-600">*</span>
                    </label>
                    <Select
                      :id="idSubcampo(seccionIndex, campo, Number(entradaIndex), subcampo)"
                      v-model="entrada[subcampo.clave]"
                      :options="subcampo.opciones"
                      option-label="etiqueta"
                      option-value="clave"
                      :class="['w-full text-sm', { 'border-red-400': !!errorDeSubcampo(seccionIndex, campo, subcampo, Number(entradaIndex)) }]"
                    >
                      <template #option="{ option }">
                        <OpcionConRecargo :campo="subcampo" :opcion="option" />
                      </template>
                    </Select>
                  </div>

                  <MensajeError :texto="errorDeSubcampo(seccionIndex, campo, subcampo, Number(entradaIndex))" />
                </div>
              </div>

              <MensajeError :texto="rechazoDeRegistro(seccionIndex, campo, Number(entradaIndex))" />
            </div>

            <div class="flex flex-wrap items-center gap-3 mt-2">
              <button
                @click="agregarEntrada(seccionIndex, campo)"
                :disabled="!puedeAgregarMasRegistros(seccionIndex, campo)"
                :class="[
                  'px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium',
                  !puedeAgregarMasRegistros(seccionIndex, campo)
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                ]"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Agregar {{ campo.nombre }}
              </button>

              <!-- Anticipo del cobro por registro adicional -->
              <span v-if="avisoRegistroAdicional(campo)" class="text-xs font-medium text-amber-700">
                {{ avisoRegistroAdicional(campo) }}
              </span>

              <span v-if="campo.cantidad_maxima_registros" class="text-xs text-gray-600">
                {{ obtenerContadorRegistros(seccionIndex, campo) }}
              </span>
            </div>

            <CampoAvisos :campo="campo" />
            <MensajeError :texto="mensajeError(seccionIndex, campo)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from 'vue';
import { Select, MultiSelect, AutoComplete, InputNumber } from 'primevue';
import type {
  CamposAdicionalesConfig,
  CampoAdicional,
  CampoGrupoInputs,
  CamposAdicionalesCapturados,
  DatosSeccionCapturados,
  OpcionCampo,
  TipoInput,
} from '../../../types/planes';
import type { RechazoVenta, RespuestaCampo, ValorRespuesta } from '../../../types/cotizacion';
import { CiudadesColombiaService, type Ciudad } from '../../../services/ciudades-colombia.service';
import CampoEdadInput from './CampoEdadInput.vue';
import {
  construirRespuestas,
  nombreCiudad,
  numerosDeRegistro,
  registroTieneDatos,
  type DatosFormulario,
} from '../../../utils/respuestasCampos';
import {
  avisosDeRecargo,
  avisosDeRechazo,
  calcularEdad,
  evaluarReglasEdad,
  recargoDeOpcion,
  recargoRegistroAdicional,
  rechazoDeOpcion,
} from '../../../utils/reglasCampos';

const props = withDefaults(defineProps<{
  camposAdicionales?: CamposAdicionalesConfig;
  /** Rechazos devueltos por el backend (422): marcan los campos que impiden la venta */
  rechazos?: RechazoVenta[];
  /**
   * Respuestas con las que arranca el formulario, en el mismo formato en que se
   * mandan a cotizar. Se usan al retomar una compra: repintan los controles con lo
   * que el cliente ya había respondido.
   */
  respuestasIniciales?: RespuestaCampo[];
}>(), {
  rechazos: () => [],
  respuestasIniciales: () => [],
});

const emit = defineEmits<{
  /** Snapshot crudo del formulario (se manda como `datos_adicionales`) */
  'update:datos': [datos: CamposAdicionalesCapturados];
  /** Respuestas normalizadas que se mandan a cotizar y a crear la venta */
  'update:respuestas': [respuestas: RespuestaCampo[]];
  'update:valid': [valid: boolean];
}>();

/**
 * Estado del formulario indexado por posición de sección y por `clave` del campo.
 * La clave es lo que el backend espera en `campo_clave`; el nombre solo se muestra.
 */
const datosFormulario = ref<DatosFormulario>({});
const errores = ref<Record<number, Set<string>>>({});
const ciudadesBuscadas = ref<Array<Ciudad & { name: string }>>([]);

const secciones = computed(() => props.camposAdicionales?.secciones ?? []);

const tieneCamposAdicionales = computed(() => secciones.value.length > 0);

/* ------------------------------------------------------------------ *
 * Presentación de las reglas de precio (solo anticipo: cobra el backend)
 * ------------------------------------------------------------------ */

/** Opción de un select con su recargo al lado */
const OpcionConRecargo = ({ campo, opcion }: { campo: CampoAdicional; opcion: OpcionCampo }) => {
  const recargo = recargoDeOpcion(campo, opcion.clave);
  const rechazo = rechazoDeOpcion(campo, opcion.clave);

  return h('div', { class: 'flex items-center justify-between gap-3 w-full' }, [
    h('span', opcion.etiqueta),
    recargo ? h('span', { class: 'text-xs font-semibold text-amber-700 whitespace-nowrap' }, recargo) : null,
    !recargo && rechazo ? h('span', { class: 'text-xs font-semibold text-red-600 whitespace-nowrap' }, 'No disponible') : null,
  ]);
};

/** Avisos de recargo/rechazo del campo que no dependen de una opción puntual */
const CampoAvisos = ({ campo }: { campo: CampoAdicional }) => {
  const recargos = avisosDeRecargo(campo);
  const rechazosConfigurados = avisosDeRechazo(campo);
  if (recargos.length === 0 && rechazosConfigurados.length === 0) return null;

  return h('div', { class: 'mt-1 space-y-0.5' }, [
    ...recargos.map((texto) => h('span', { class: 'block text-xs text-amber-700' }, texto)),
    ...rechazosConfigurados.map((texto) => h('span', { class: 'block text-xs text-gray-500 italic' }, texto)),
  ]);
};

const MensajeError = ({ texto }: { texto: string }) => {
  if (!texto) return null;
  return h('span', { class: 'block text-xs text-red-600 italic mt-1' }, texto);
};

const avisoRegistroAdicional = (campo: CampoAdicional): string => {
  return recargoRegistroAdicional(campo, (campo.nombre || '').toLowerCase());
};

/* ------------------------------------------------------------------ *
 * Utilidades de campos
 * ------------------------------------------------------------------ */

const idCampo = (seccionIndex: number, campo: CampoAdicional): string => `campo-${seccionIndex}-${campo.clave}`;

const idSubcampo = (seccionIndex: number, campo: CampoAdicional, registro: number, subcampo: CampoAdicional): string =>
  `subcampo-${seccionIndex}-${campo.clave}-${registro}-${subcampo.clave}`;

const parseBanderaBoolean = (valor: unknown): boolean | undefined => {
  if (typeof valor === 'boolean') return valor;

  if (typeof valor === 'number') {
    if (valor === 1) return true;
    if (valor === 0) return false;
    return undefined;
  }

  if (typeof valor === 'string') {
    const normalizado = valor.trim().toLowerCase();
    if (['true', '1', 'si', 'sí', 'yes'].includes(normalizado)) return true;
    if (['false', '0', 'no', ''].includes(normalizado)) return false;
  }

  return undefined;
};

const esRequerido = (campo: any): boolean => {
  if (!campo || typeof campo !== 'object') return false;

  // 'obligatorio' tiene prioridad total sobre 'requerido'
  const obligatorio = parseBanderaBoolean(campo.obligatorio);
  if (obligatorio !== undefined) return obligatorio;

  const requerido = parseBanderaBoolean(campo.requerido);
  if (requerido !== undefined) return requerido;

  return false;
};

const getInputType = (tipoInput: TipoInput | string): string => {
  const typeMap: Record<string, string> = {
    text: 'text',
    fecha: 'date',
    date: 'date',
    email: 'email',
    tel: 'tel',
    number: 'number',
    precio: 'number',
    plano: 'number',
    ciudad: 'text',
    textarea: 'text',
  };

  return typeMap[tipoInput as string] || 'text';
};

/**
 * Motivo por el que la fecha de nacimiento elegida impide vender, según las reglas
 * del campo. Un límite con regla `COBRAR` no bloquea: se permite y se cobra.
 */
const rechazoPorEdad = (campo: CampoAdicional, valor: any): string => {
  if (!valor) return ''; // la ausencia de valor la maneja la validación de "requerido"
  return evaluarReglasEdad(campo, String(valor)).rechazos[0] ?? '';
};

const valorVacio = (valor: any): boolean => {
  if (valor === null || valor === undefined || valor === '') return true;
  if (Array.isArray(valor)) return valor.length === 0;
  if (typeof valor === 'object') return !valor.name && !valor.nombre;
  return false;
};

/* ------------------------------------------------------------------ *
 * Rechazos del backend
 * ------------------------------------------------------------------ */

const rechazoDeCampo = (clave: string): string => {
  return props.rechazos.find((rechazo) => rechazo.campo_clave === clave)?.mensaje ?? '';
};

/** Registros cargados de un grupo */
const registrosDe = (seccionIndex: number, grupo: CampoGrupoInputs): Record<string, any>[] => {
  const registros = datosFormulario.value[seccionIndex]?.[grupo.clave];
  return Array.isArray(registros) ? registros : [];
};

/**
 * Número con el que viaja un registro en las respuestas. No es su posición en
 * pantalla: los registros en blanco no se mandan y no consumen número.
 */
const numeroDeRegistro = (seccionIndex: number, grupo: CampoGrupoInputs, entradaIndex: number): number | null => {
  return numerosDeRegistro(grupo, registrosDe(seccionIndex, grupo))[entradaIndex] ?? null;
};

/** Rechazo sobre un registro puntual de un grupo (campo_clave del grupo + numero_registro) */
const rechazoDeRegistro = (seccionIndex: number, grupo: CampoGrupoInputs, entradaIndex: number): string => {
  const numero = numeroDeRegistro(seccionIndex, grupo, entradaIndex);
  if (numero === null) return '';

  return props.rechazos.find(
    (rechazo) => rechazo.campo_clave === grupo.clave && rechazo.numero_registro === numero,
  )?.mensaje ?? '';
};

/**
 * Error a mostrar en un subcampo: el rechazo del backend o de las reglas, o la
 * obligatoriedad, que aplica desde que el registro existe (tiene algún dato).
 */
const errorDeSubcampo = (
  seccionIndex: number,
  grupo: CampoGrupoInputs,
  subcampo: CampoAdicional,
  entradaIndex: number,
): string => {
  const rechazo = rechazoDeSubcampo(seccionIndex, grupo, subcampo, entradaIndex);
  if (rechazo) return rechazo;

  const entrada = registrosDe(seccionIndex, grupo)[entradaIndex];
  if (!entrada || !registroTieneDatos(grupo, entrada)) return '';

  if (esRequerido(subcampo) && valorVacio(entrada[subcampo.clave])) return 'Este campo es obligatorio';

  return '';
};

/** Rechazo sobre un subcampo de un registro puntual */
const rechazoDeSubcampo = (
  seccionIndex: number,
  grupo: CampoGrupoInputs,
  subcampo: CampoAdicional,
  entradaIndex: number,
): string => {
  const numero = numeroDeRegistro(seccionIndex, grupo, entradaIndex);
  if (numero === null) return '';

  const rechazoBackend = props.rechazos.find((rechazo) => {
    if (rechazo.campo_clave !== subcampo.clave) return false;
    return rechazo.numero_registro == null || rechazo.numero_registro === numero;
  })?.mensaje;
  if (rechazoBackend) return rechazoBackend;

  // Las reglas que rechazan se muestran apenas se elige la fecha, sin esperar a cotizar
  if (subcampo.tipo === 'edad') {
    const entrada = registrosDe(seccionIndex, grupo)[entradaIndex] ?? {};
    return rechazoPorEdad(subcampo, entrada[subcampo.clave]);
  }

  return '';
};

/* ------------------------------------------------------------------ *
 * Validación local (obligatoriedad y rangos: feedback inmediato)
 * ------------------------------------------------------------------ */

const hasError = (seccionIndex: number, clave: string): boolean => {
  return errores.value[seccionIndex]?.has(clave) || !!rechazoDeCampo(clave);
};

/** Texto de error del campo: primero el del backend, que está escrito para el cliente */
const mensajeError = (seccionIndex: number, campo: CampoAdicional): string => {
  const rechazo = rechazoDeCampo(campo.clave);
  if (rechazo) return rechazo;

  if (!errores.value[seccionIndex]?.has(campo.clave)) return '';

  const valor = datosFormulario.value[seccionIndex]?.[campo.clave];

  if (campo.tipo === 'edad') {
    const rechazoEdad = rechazoPorEdad(campo, valor);
    if (rechazoEdad) return rechazoEdad;
  }

  if (campo.tipo === 'grupo_inputs') {
    const registros = registrosDe(seccionIndex, campo as CampoGrupoInputs);
    const hayRegistros = registros.some((entrada) => registroTieneDatos(campo as CampoGrupoInputs, entrada));
    // Lo que falta dentro de un registro se marca en cada subcampo
    return hayRegistros ? '' : 'Debe agregar al menos un registro';
  }
  if (campo.tipo === 'dropdown') return 'Debe seleccionar una opción';
  if (campo.tipo === 'multiselect') return 'Debe seleccionar al menos una opción';

  return 'Este campo es obligatorio';
};

const campoInvalido = (seccionIndex: number, campo: CampoAdicional): boolean => {
  const valor = datosFormulario.value[seccionIndex]?.[campo.clave];

  if (campo.tipo === 'edad') {
    if (esRequerido(campo) && valorVacio(valor)) return true;
    return !!rechazoPorEdad(campo, valor);
  }

  if (campo.tipo === 'grupo_inputs') {
    const grupo = campo as CampoGrupoInputs;
    const registros: Record<string, any>[] = Array.isArray(valor) ? valor : [];

    // Un registro en blanco es un registro que el cliente no llenó, no un error
    const conDatos = registros.filter((entrada) => registroTieneDatos(grupo, entrada));

    if (esRequerido(campo) && conDatos.length === 0) return true;

    // Un registro que ya existe tiene que quedar completo, y su fecha de
    // nacimiento no puede caer en un rango que impida vender
    return conDatos.some((entrada) =>
      grupo.campos.some((subcampo) => {
        if (esRequerido(subcampo) && valorVacio(entrada[subcampo.clave])) return true;
        return subcampo.tipo === 'edad' && !!rechazoPorEdad(subcampo, entrada[subcampo.clave]);
      }),
    );
  }

  return esRequerido(campo) && valorVacio(valor);
};

const validarCampo = (seccionIndex: number, campo: CampoAdicional): void => {
  if (!errores.value[seccionIndex]) errores.value[seccionIndex] = new Set();

  if (campoInvalido(seccionIndex, campo)) {
    errores.value[seccionIndex].add(campo.clave);
  } else {
    errores.value[seccionIndex].delete(campo.clave);
  }

  emit('update:valid', calcularEsValido());
};

/** Revisa todo el formulario y deja marcados los campos con problema */
const validarTodo = (): boolean => {
  let esValido = true;

  secciones.value.forEach((seccion, seccionIndex) => {
    if (!errores.value[seccionIndex]) errores.value[seccionIndex] = new Set();

    seccion.campos.forEach((campo) => {
      if (campoInvalido(seccionIndex, campo)) {
        esValido = false;
        errores.value[seccionIndex].add(campo.clave);
      } else {
        errores.value[seccionIndex].delete(campo.clave);
      }
    });
  });

  emit('update:valid', esValido);
  return esValido;
};

/** Igual que validarTodo pero sin marcar errores: se usa mientras el cliente escribe */
const calcularEsValido = (): boolean => {
  return secciones.value.every((seccion, seccionIndex) =>
    seccion.campos.every((campo) => !campoInvalido(seccionIndex, campo)),
  );
};

/* ------------------------------------------------------------------ *
 * Registros de un grupo
 * ------------------------------------------------------------------ */

const entradaVacia = (campo: CampoGrupoInputs): Record<string, any> => {
  const entrada: Record<string, any> = {};
  campo.campos.forEach((subcampo) => {
    entrada[subcampo.clave] = '';
  });
  return entrada;
};

const puedeAgregarMasRegistros = (seccionIndex: number, campo: any): boolean => {
  const limite = Number(campo.cantidad_maxima_registros);
  if (!campo.cantidad_maxima_registros || isNaN(limite)) return true;

  const registros = datosFormulario.value[seccionIndex]?.[campo.clave];
  if (!Array.isArray(registros)) return true;

  return registros.length < limite;
};

const agregarEntrada = (seccionIndex: number, campo: CampoGrupoInputs): void => {
  if (!puedeAgregarMasRegistros(seccionIndex, campo)) return;

  datosFormulario.value[seccionIndex][campo.clave].push(entradaVacia(campo));
};

const eliminarEntrada = (seccionIndex: number, clave: string, index: number): void => {
  datosFormulario.value[seccionIndex][clave].splice(index, 1);
};

const obtenerContadorRegistros = (seccionIndex: number, campo: any): string => {
  const registros = datosFormulario.value[seccionIndex]?.[campo.clave];
  const cantidad = Array.isArray(registros) ? registros.length : 0;
  return `${cantidad} de ${campo.cantidad_maxima_registros} registros`;
};

const buscarCiudades = async (event: any): Promise<void> => {
  const { data } = await CiudadesColombiaService.buscarPorNombre(event.query, 20);
  // Mapear al formato esperado por AutoComplete (necesita la propiedad 'name')
  ciudadesBuscadas.value = data.map((ciudad) => ({ ...ciudad, name: ciudad.nombre }));
};

/* ------------------------------------------------------------------ *
 * Inicialización
 * ------------------------------------------------------------------ */

const inicializarDatosFormulario = (): void => {
  const datos: DatosFormulario = {};
  const erroresIniciales: Record<number, Set<string>> = {};

  secciones.value.forEach((seccion, seccionIndex) => {
    datos[seccionIndex] = {};
    erroresIniciales[seccionIndex] = new Set();

    seccion.campos.forEach((campo) => {
      if (campo.tipo === 'multiselect') {
        datos[seccionIndex][campo.clave] = [];
      } else if (campo.tipo === 'autocomplete' || (campo.tipo === 'input' && campo.tipoInput === 'ciudad')) {
        datos[seccionIndex][campo.clave] = null;
      } else if (campo.tipo === 'input' && (campo.tipoInput === 'precio' || campo.tipoInput === 'plano')) {
        datos[seccionIndex][campo.clave] = null;
      } else if (campo.tipo === 'grupo_inputs') {
        datos[seccionIndex][campo.clave] = [entradaVacia(campo)];
      } else {
        datos[seccionIndex][campo.clave] = '';
      }
    });
  });

  aplicarRespuestasIniciales(datos);

  datosFormulario.value = datos;
  errores.value = erroresIniciales;
};

/**
 * Inverso de `valorParaRespuesta`: lleva el valor que viaja al backend al formato
 * que espera el control del formulario.
 */
const valorParaFormulario = (campo: CampoAdicional, valor: ValorRespuesta): any => {
  if (campo.tipo === 'multiselect') return Array.isArray(valor) ? valor : [String(valor)];

  if (campo.tipo === 'autocomplete' || (campo.tipo === 'input' && campo.tipoInput === 'ciudad')) {
    const nombre = String(valor ?? '');
    return nombre === '' ? null : { name: nombre, nombre };
  }

  if (campo.tipo === 'input' && (campo.tipoInput === 'precio' || campo.tipoInput === 'plano')) {
    const numero = Number(valor);
    return isNaN(numero) ? null : numero;
  }

  // El campo `edad` guarda la fecha de nacimiento tal como se manda (YYYY-MM-DD)
  return valor;
};

/**
 * Repinta el formulario con `respuestasIniciales`. Los subcampos de un grupo se
 * reparten en registros por su `numero_registro`, que empieza en 1.
 */
const aplicarRespuestasIniciales = (datos: DatosFormulario): void => {
  const iniciales = props.respuestasIniciales ?? [];
  if (iniciales.length === 0) return;

  secciones.value.forEach((seccion, seccionIndex) => {
    seccion.campos.forEach((campo) => {
      if (campo.tipo === 'grupo_inputs') {
        const grupo = campo as CampoGrupoInputs;
        const clavesDelGrupo = new Set(grupo.campos.map((subcampo) => subcampo.clave));

        const respuestasDelGrupo = iniciales.filter(
          (respuesta) => clavesDelGrupo.has(respuesta.campo_clave) && respuesta.numero_registro != null,
        );
        if (respuestasDelGrupo.length === 0) return;

        const numeros = [...new Set(respuestasDelGrupo.map((respuesta) => respuesta.numero_registro as number))]
          .sort((uno, otro) => uno - otro);

        datos[seccionIndex][grupo.clave] = numeros.map((numero) => {
          const entrada = entradaVacia(grupo);

          grupo.campos.forEach((subcampo) => {
            const respuesta = respuestasDelGrupo.find(
              (candidata) => candidata.campo_clave === subcampo.clave && candidata.numero_registro === numero,
            );
            if (respuesta) entrada[subcampo.clave] = valorParaFormulario(subcampo, respuesta.valor);
          });

          return entrada;
        });
        return;
      }

      const respuesta = iniciales.find(
        (candidata) => candidata.campo_clave === campo.clave && candidata.numero_registro == null,
      );
      if (respuesta) datos[seccionIndex][campo.clave] = valorParaFormulario(campo, respuesta.valor);
    });
  });
};

/* ------------------------------------------------------------------ *
 * Salida: snapshot del formulario y respuestas para cotizar
 * ------------------------------------------------------------------ */

const emitirDatos = (): void => {
  const datosCapturados: CamposAdicionalesCapturados = { secciones: [] };

  secciones.value.forEach((seccion, seccionIndex) => {
    const datosSeccion: DatosSeccionCapturados = { titulo: seccion.titulo, datos: {} };

    seccion.campos.forEach((campo) => {
      const valor = datosFormulario.value[seccionIndex]?.[campo.clave];

      if (campo.tipo === 'autocomplete' || (campo.tipo === 'input' && campo.tipoInput === 'ciudad')) {
        datosSeccion.datos[campo.nombre] = nombreCiudad(valor);
      } else if (campo.tipo === 'edad') {
        datosSeccion.datos[campo.nombre] = valor
          ? { fechaNacimiento: valor, edad: calcularEdad(valor) }
          : { fechaNacimiento: '', edad: null };
      } else {
        datosSeccion.datos[campo.nombre] = valor;
      }
    });

    datosCapturados.secciones.push(datosSeccion);
  });

  emit('update:datos', datosCapturados);
};

/* ------------------------------------------------------------------ *
 * Watchers
 * ------------------------------------------------------------------ */

// Las respuestas iniciales llegan con la venta, después de la configuración:
// cuando cambian hay que repintar el formulario desde cero.
watch([secciones, () => props.respuestasIniciales], () => {
  inicializarDatosFormulario();
}, { immediate: true, deep: true });

watch(datosFormulario, () => {
  emitirDatos();
  emit('update:respuestas', construirRespuestas(secciones.value, datosFormulario.value));
  emit('update:valid', calcularEsValido());
}, { deep: true });

// Exponer método de validación para uso externo
defineExpose({
  validarTodo,
});
</script>

<style scoped>
.seccion-card {
  transition: all 0.2s ease;
}

.seccion-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.grupo-entrada {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
