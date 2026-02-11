<template>
  <div v-if="tieneCamposAdicionales" class="campos-adicionales w-full">
    <div
      v-for="(seccion, seccionIndex) in camposAdicionales.secciones"
      :key="seccionIndex"
      class="seccion-card bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm"
    >
      <div class="seccion-header mb-4">
        <h3 class="text-lg font-bold text-blue-800">{{ seccion.titulo }}</h3>
        <p v-if="seccion.descripcion" class="text-sm text-gray-600 mt-1">{{ seccion.descripcion }}</p>
      </div>

      <div class="seccion-campos space-y-4">
        <div v-for="(campo, campoIndex) in seccion.campos" :key="campoIndex">
          <!-- Input Simple -->
          <div v-if="campo.tipo === 'input'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="campo.requerido !== false" class="text-red-600">*</span>
            </label>
            <input
              :id="`campo-${seccionIndex}-${campoIndex}`"
              :type="getInputType(campo.tipoInput)"
              :class="['p-2 border rounded-md w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              @blur="validateField(seccion.titulo, campo.nombre, campo.requerido)"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Este campo es obligatorio
            </span>
          </div>

          <!-- Dropdown -->
          <div v-else-if="campo.tipo === 'dropdown'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="campo.requerido !== false" class="text-red-600">*</span>
            </label>
            <Select
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              :options="campo.opciones"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              @change="validateField(seccion.titulo, campo.nombre, campo.requerido)"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Debe seleccionar una opción
            </span>
          </div>

          <!-- Multiselect -->
          <div v-else-if="campo.tipo === 'multiselect'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="campo.requerido !== false" class="text-red-600">*</span>
            </label>
            <MultiSelect
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              :options="campo.opciones"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              @change="validateField(seccion.titulo, campo.nombre, campo.requerido)"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Debe seleccionar al menos una opción
            </span>
          </div>

          <!-- Autocomplete de ciudades -->
          <div v-else-if="campo.tipo === 'autocomplete' && campo.fuente === 'ciudades'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="campo.requerido !== false" class="text-red-600">*</span>
            </label>
            <AutoComplete
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              option-label="name"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              input-class="w-full"
              :suggestions="ciudadesBuscadas"
              @complete="buscarCiudades"
              @change="validateField(seccion.titulo, campo.nombre, campo.requerido)"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Este campo es obligatorio
            </span>
          </div>

          <!-- Grupo de Inputs Repetibles -->
          <div v-else-if="campo.tipo === 'grupo_inputs'" class="campo-group">
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              {{ campo.nombre }} <span v-if="campo.requerido !== false" class="text-red-600">*</span>
            </label>

            <div
              v-for="(entrada, entradaIndex) in datosFormulario[seccion.titulo][campo.nombre]"
              :key="entradaIndex"
              class="grupo-entrada bg-gray-50 border border-gray-300 rounded-md p-4 mb-3 relative"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600">
                  {{ campo.nombre }} #{{ entradaIndex + 1 }}
                </span>
                <button
                  v-if="datosFormulario[seccion.titulo][campo.nombre].length > 1"
                  @click="eliminarEntrada(seccion.titulo, campo.nombre, entradaIndex)"
                  class="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-50 transition-colors"
                  type="button"
                  :aria-label="`Eliminar ${campo.nombre} #${entradaIndex + 1}`"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <div v-for="(subcampo, subcampoIndex) in campo.campos" :key="subcampoIndex" class="subcampo">
                  <!-- Input dentro del grupo -->
                  <div v-if="subcampo.tipo === 'input'">
                    <label :for="`subcampo-${seccionIndex}-${campoIndex}-${entradaIndex}-${subcampoIndex}`" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="subcampo.requerido !== false" class="text-red-600">*</span>
                    </label>
                    <input
                      :id="`subcampo-${seccionIndex}-${campoIndex}-${entradaIndex}-${subcampoIndex}`"
                      :type="getInputType(subcampo.tipoInput)"
                      class="p-2 border rounded-md w-full text-sm"
                      v-model="entrada[subcampo.nombre]"
                    />
                  </div>

                  <!-- Dropdown dentro del grupo -->
                  <div v-else-if="subcampo.tipo === 'dropdown'">
                    <label :for="`subcampo-${seccionIndex}-${campoIndex}-${entradaIndex}-${subcampoIndex}`" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="subcampo.requerido !== false" class="text-red-600">*</span>
                    </label>
                    <Select
                      :id="`subcampo-${seccionIndex}-${campoIndex}-${entradaIndex}-${subcampoIndex}`"
                      v-model="entrada[subcampo.nombre]"
                      :options="subcampo.opciones"
                      class="w-full text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="agregarEntrada(seccion.titulo, campo)"
              class="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Agregar {{ campo.nombre }}
            </button>

            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1 block">
              Debe agregar al menos un registro
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Select, MultiSelect, AutoComplete } from 'primevue';
import type {
  CamposAdicionalesConfig,
  CampoAdicional,
  CampoGrupoInputs,
  TipoInput,
  CamposAdicionalesCapturados,
  DatosSeccionCapturados
} from '../../../types/planes';
import { UbicacionesService, type TLocationsColombiaAttributes } from '../../../services/ubicaciones';

const props = defineProps<{
  camposAdicionales?: CamposAdicionalesConfig;
}>();

const emit = defineEmits<{
  'update:datos': [datos: CamposAdicionalesCapturados];
  'update:valid': [valid: boolean];
}>();

// Servicios
const _UbicacionesService = new UbicacionesService();

// Estado
const datosFormulario = ref<Record<string, Record<string, any>>>({});
const errores = ref<Record<string, Set<string>>>({});
const ciudadesBuscadas = ref<TLocationsColombiaAttributes[]>([]);

// Computed
const tieneCamposAdicionales = computed(() => {
  return props.camposAdicionales?.secciones && props.camposAdicionales.secciones.length > 0;
});

// Métodos
const getInputType = (tipoInput: TipoInput): string => {
  const typeMap: Record<TipoInput, string> = {
    'text': 'text',
    'number': 'number',
    'email': 'email',
    'date': 'date',
    'tel': 'tel',
    'precio': 'number',
    'plano': 'number'
  };
  return typeMap[tipoInput] || 'text';
};

const inicializarDatosFormulario = () => {
  if (!props.camposAdicionales?.secciones) return;

  const datos: Record<string, Record<string, any>> = {};
  const erroresIniciales: Record<string, Set<string>> = {};

  props.camposAdicionales.secciones.forEach(seccion => {
    datos[seccion.titulo] = {};
    erroresIniciales[seccion.titulo] = new Set();

    seccion.campos.forEach(campo => {
      if (campo.tipo === 'input') {
        datos[seccion.titulo][campo.nombre] = '';
      } else if (campo.tipo === 'dropdown') {
        datos[seccion.titulo][campo.nombre] = '';
      } else if (campo.tipo === 'multiselect') {
        datos[seccion.titulo][campo.nombre] = [];
      } else if (campo.tipo === 'autocomplete') {
        datos[seccion.titulo][campo.nombre] = '';
      } else if (campo.tipo === 'grupo_inputs') {
        // Inicializar con un registro vacío
        const entradaVacia: Record<string, any> = {};
        campo.campos.forEach(subcampo => {
          entradaVacia[subcampo.nombre] = '';
        });
        datos[seccion.titulo][campo.nombre] = [entradaVacia];
      }
    });
  });

  datosFormulario.value = datos;
  errores.value = erroresIniciales;
};

const agregarEntrada = (tituloSeccion: string, campo: CampoGrupoInputs) => {
  const entradaVacia: Record<string, any> = {};
  campo.campos.forEach(subcampo => {
    entradaVacia[subcampo.nombre] = '';
  });

  datosFormulario.value[tituloSeccion][campo.nombre].push(entradaVacia);
  emitirDatos();
};

const eliminarEntrada = (tituloSeccion: string, nombreCampo: string, index: number) => {
  datosFormulario.value[tituloSeccion][nombreCampo].splice(index, 1);
  emitirDatos();
};

const buscarCiudades = async (event: any) => {
  const { data } = await _UbicacionesService.buscarUbicacionesColombia({ name: event.query });
  ciudadesBuscadas.value = data;
};

const validateField = (tituloSeccion: string, nombreCampo: string, requerido?: boolean) => {
  if (requerido === false) return;

  const valor = datosFormulario.value[tituloSeccion][nombreCampo];

  if (!errores.value[tituloSeccion]) {
    errores.value[tituloSeccion] = new Set();
  }

  // Validar según el tipo de valor
  if (Array.isArray(valor)) {
    if (valor.length === 0) {
      errores.value[tituloSeccion].add(nombreCampo);
    } else {
      errores.value[tituloSeccion].delete(nombreCampo);
    }
  } else if (typeof valor === 'object' && valor !== null) {
    // Para autocomplete (objeto ciudad)
    if (!valor.name) {
      errores.value[tituloSeccion].add(nombreCampo);
    } else {
      errores.value[tituloSeccion].delete(nombreCampo);
    }
  } else {
    // Para strings y números
    if (!valor || valor === '') {
      errores.value[tituloSeccion].add(nombreCampo);
    } else {
      errores.value[tituloSeccion].delete(nombreCampo);
    }
  }

  validarTodo();
};

const hasError = (tituloSeccion: string, nombreCampo: string): boolean => {
  return errores.value[tituloSeccion]?.has(nombreCampo) || false;
};

const validarTodo = (): boolean => {
  if (!props.camposAdicionales?.secciones) return true;

  let esValido = true;

  props.camposAdicionales.secciones.forEach(seccion => {
    seccion.campos.forEach(campo => {
      if (campo.requerido !== false) {
        const valor = datosFormulario.value[seccion.titulo][campo.nombre];

        if (campo.tipo === 'grupo_inputs') {
          // Validar que tenga al menos un elemento
          if (!Array.isArray(valor) || valor.length === 0) {
            esValido = false;
            if (!errores.value[seccion.titulo]) {
              errores.value[seccion.titulo] = new Set();
            }
            errores.value[seccion.titulo].add(campo.nombre);
          } else {
            // Validar que cada entrada tenga todos los campos completos
            const todasEntradasCompletas = valor.every(entrada => {
              return campo.campos.every(subcampo => {
                const valorSubcampo = entrada[subcampo.nombre];
                return subcampo.requerido === false || (valorSubcampo !== '' && valorSubcampo !== null && valorSubcampo !== undefined);
              });
            });

            if (!todasEntradasCompletas) {
              esValido = false;
            }
          }
        } else if (Array.isArray(valor)) {
          if (valor.length === 0) {
            esValido = false;
            if (!errores.value[seccion.titulo]) {
              errores.value[seccion.titulo] = new Set();
            }
            errores.value[seccion.titulo].add(campo.nombre);
          }
        } else if (typeof valor === 'object' && valor !== null) {
          // Para autocomplete
          if (!valor.name) {
            esValido = false;
            if (!errores.value[seccion.titulo]) {
              errores.value[seccion.titulo] = new Set();
            }
            errores.value[seccion.titulo].add(campo.nombre);
          }
        } else {
          if (!valor || valor === '') {
            esValido = false;
            if (!errores.value[seccion.titulo]) {
              errores.value[seccion.titulo] = new Set();
            }
            errores.value[seccion.titulo].add(campo.nombre);
          }
        }
      }
    });
  });

  emit('update:valid', esValido);
  return esValido;
};

const emitirDatos = () => {
  if (!props.camposAdicionales?.secciones) return;

  const datosCapturados: CamposAdicionalesCapturados = {
    secciones: []
  };

  props.camposAdicionales.secciones.forEach(seccion => {
    const datosSeccion: DatosSeccionCapturados = {
      titulo: seccion.titulo,
      datos: {}
    };

    seccion.campos.forEach(campo => {
      const valor = datosFormulario.value[seccion.titulo][campo.nombre];

      // Para autocomplete, extraer solo el nombre de la ciudad
      if (campo.tipo === 'autocomplete' && typeof valor === 'object' && valor !== null) {
        datosSeccion.datos[campo.nombre] = valor.name || valor;
      } else {
        datosSeccion.datos[campo.nombre] = valor;
      }
    });

    datosCapturados.secciones.push(datosSeccion);
  });

  emit('update:datos', datosCapturados);
};

// Watchers
watch(() => props.camposAdicionales, () => {
  inicializarDatosFormulario();
}, { immediate: true, deep: true });

watch(datosFormulario, () => {
  emitirDatos();
}, { deep: true });

// Exponer método de validación para uso externo
defineExpose({
  validarTodo
});
</script>

<style scoped>
.campos-adicionales {
  /* Estilos adicionales si es necesario */
}

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
