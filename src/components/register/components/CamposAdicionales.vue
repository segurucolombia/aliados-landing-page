<template>
  <div v-if="tieneCamposAdicionales" class="campos-adicionales w-full">
    <div
      v-for="(seccion, seccionIndex) in camposAdicionalesNormalizados?.secciones || []"
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
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <!-- Textarea -->
            <textarea
              v-if="campo.tipoInput === 'textarea'"
              :id="`campo-${seccionIndex}-${campoIndex}`"
              :class="['p-2 border rounded-md w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              @blur="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
              rows="4"
            ></textarea>
            <!-- Autocomplete para ciudades -->
            <AutoComplete
              v-else-if="campo.tipoInput === 'ciudad'"
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              option-label="name"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              input-class="w-full"
              :suggestions="ciudadesBuscadas"
              @complete="buscarCiudades"
              @change="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
            />
            <!-- Input normal -->
            <input
              v-else
              :id="`campo-${seccionIndex}-${campoIndex}`"
              :type="getInputType(campo.tipoInput)"
              :class="['p-2 border rounded-md w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              @blur="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Este campo es obligatorio
            </span>
          </div>

          <!-- Dropdown -->
          <div v-else-if="campo.tipo === 'dropdown'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <Select
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              :options="campo.opciones"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              @change="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Debe seleccionar una opción
            </span>
          </div>

          <!-- Multiselect -->
          <div v-else-if="campo.tipo === 'multiselect'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <MultiSelect
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              :options="campo.opciones"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              @change="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
            />
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Debe seleccionar al menos una opción
            </span>
          </div>
          
          <!-- Autocomplete de ciudades -->
          <div v-else-if="campo.tipo === 'autocomplete' && campo.fuente === 'ciudades'" class="campo-group">
            <label :for="`campo-${seccionIndex}-${campoIndex}`" class="text-sm italic text-gray-600 mb-1 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>
            <AutoComplete
              :id="`campo-${seccionIndex}-${campoIndex}`"
              v-model="datosFormulario[seccion.titulo][campo.nombre]"
              option-label="name"
              :class="['w-full', {'border-red-400': hasError(seccion.titulo, campo.nombre)}]"
              input-class="w-full"
              :suggestions="ciudadesBuscadas"
              @complete="buscarCiudades"
              @change="validateField(seccion.titulo, campo.nombre, esRequerido(campo))"
            />hjksdfvjksdsdf
            <span v-if="hasError(seccion.titulo, campo.nombre)" class="text-xs text-red-600 italic mt-1">
              Este campo es obligatorio
            </span>
          </div>

          <!-- Grupo de Inputs Repetibles -->
          <div v-else-if="campo.tipo === 'grupo_inputs'" class="campo-group">
            <label class="text-sm font-medium text-gray-700 mb-2 block">
              {{ campo.nombre }} <span v-if="esRequerido(campo)" class="text-red-600">*</span>
            </label>

            <div
              v-for="(entrada, entradaIndex) in datosFormulario[seccion.titulo][campo.nombre]"
              :key="entradaIndex"
              class="grupo-entrada bg-gray-50 border border-gray-300 rounded-md p-4 mb-3 relative"
            >
              <div class="flex justify-between items-center mb-3">
                <span class="text-sm font-medium text-gray-600">
                  {{ campo.nombre }} #{{ Number(entradaIndex) + 1 }}
                </span>
                <button
                  v-if="datosFormulario[seccion.titulo][campo.nombre].length > 1"
                  @click="eliminarEntrada(seccion.titulo, campo.nombre, Number(entradaIndex))"
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
                <div v-for="(subcampo, subcampoIndex) in campo.campos" :key="subcampoIndex" class="subcampo">
                  <!-- Input dentro del grupo -->
                  <div v-if="subcampo.tipo === 'input'">
                    <label :for="`subcampo-${seccionIndex}-${campoIndex}-${entradaIndex}-${subcampoIndex}`" class="text-xs italic text-gray-600 mb-1 block">
                      {{ subcampo.nombre }} <span v-if="esRequerido(subcampo)" class="text-red-600">*</span>
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
                      {{ subcampo.nombre }} <span v-if="esRequerido(subcampo)" class="text-red-600">*</span>
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

            <div class="flex items-center gap-3 mt-2">
              <button
                @click="agregarEntrada(seccion.titulo, campo)"
                :disabled="!puedeAgregarMasRegistros(seccion.titulo, campo)"
                :class="[
                  'px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium',
                  !puedeAgregarMasRegistros(seccion.titulo, campo)
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

              <span v-if="campo.cantidad_maxima_registros" class="text-xs text-gray-600">
                {{ obtenerContadorRegistros(seccion.titulo, campo) }}
              </span>
            </div>

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
import { CiudadesColombiaService, type Ciudad } from '../../../services/ciudades-colombia.service';

const props = defineProps<{
  camposAdicionales?: CamposAdicionalesConfig;
}>();

const emit = defineEmits<{
  'update:datos': [datos: CamposAdicionalesCapturados];
  'update:valid': [valid: boolean];
}>();

// Estado
const datosFormulario = ref<Record<string, Record<string, any>>>({});
const errores = ref<Record<string, Set<string>>>({});
const ciudadesBuscadas = ref<Array<Ciudad & { name: string }>>([]);

// Computed
const tieneCamposAdicionales = computed(() => {
  return props.camposAdicionales?.secciones && props.camposAdicionales.secciones.length > 0;
});

const camposAdicionalesNormalizados = computed(() => {
  if (!props.camposAdicionales?.secciones) return null;

  return {
    secciones: props.camposAdicionales.secciones.map(seccion => ({
      ...seccion,
      campos: seccion.campos.map(campo => {
        if (campo.tipo === 'grupo_inputs') {
          return {
            ...campo,
            campos: campo.campos.map(normalizarCampo)
          };
        }
        return campo;
      })
    }))
  };
});

// Métodos
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
  if (!tipoInput) {
    console.warn('tipoInput es undefined o null');
    return 'text';
  }

  const typeMap: Record<string, string> = {
    'text': 'text',
    'number': 'number',
    'email': 'email',
    'date': 'date',
    'fecha': 'date',
    'tel': 'tel',
    'precio': 'number',
    'plano': 'number',
    'ciudad': 'text',
    'textarea': 'text'
  };

  const result = typeMap[tipoInput] || 'text';
  console.log(`getInputType(${tipoInput}) → ${result}`);
  return result;
};

const normalizarCampo = (campo: any): any => {
  // Si el campo dentro de grupo_inputs tiene tipo fecha, number, text, etc.
  // convertirlo a formato { tipo: 'input', tipoInput: 'fecha' }
  const tiposInput = ['text', 'number', 'email', 'date', 'fecha', 'tel', 'precio', 'plano', 'ciudad', 'textarea'];

  console.log('normalizarCampo - entrada:', campo.nombre, 'tipo:', campo.tipo, 'obligatorio:', campo.obligatorio);

  if (tiposInput.includes(campo.tipo)) {
    // Preservar obligatorio/requerido al normalizar
    const campoNormalizado: any = {
      ...campo,
      tipoInput: campo.tipo,
      tipo: 'input'
    };

    // Si tiene obligatorio pero no requerido, copiarlo
    if (Object.prototype.hasOwnProperty.call(campo, 'obligatorio') && !Object.prototype.hasOwnProperty.call(campo, 'requerido')) {
      campoNormalizado.requerido = campo.obligatorio;
    }

    console.log('normalizarCampo - salida:', campoNormalizado.nombre, 'tipo:', campoNormalizado.tipo, 'tipoInput:', campoNormalizado.tipoInput, 'requerido:', campoNormalizado.requerido);
    return campoNormalizado;
  }

  console.log('normalizarCampo - sin cambios (tipo no reconocido)');
  return campo;
};

const inicializarDatosFormulario = () => {
  if (!camposAdicionalesNormalizados.value?.secciones) return;

  const datos: Record<string, Record<string, any>> = {};
  const erroresIniciales: Record<string, Set<string>> = {};

  camposAdicionalesNormalizados.value.secciones.forEach(seccion => {
    datos[seccion.titulo] = {};
    erroresIniciales[seccion.titulo] = new Set();

    seccion.campos.forEach(campo => {
      if (campo.tipo === 'input') {
        // Para inputs de tipo ciudad, inicializar con objeto vacío
        if (campo.tipoInput === 'ciudad') {
          datos[seccion.titulo][campo.nombre] = null;
        } else {
          datos[seccion.titulo][campo.nombre] = '';
        }
      } else if (campo.tipo === 'dropdown') {
        datos[seccion.titulo][campo.nombre] = '';
      } else if (campo.tipo === 'multiselect') {
        datos[seccion.titulo][campo.nombre] = [];
      } else if (campo.tipo === 'autocomplete') {
        datos[seccion.titulo][campo.nombre] = null;
      } else if (campo.tipo === 'grupo_inputs') {
        // Los campos ya están normalizados
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
  // Validar límite máximo de registros
  const registrosActuales = datosFormulario.value[tituloSeccion][campo.nombre];

  if (campo.cantidad_maxima_registros) {
    const limite = parseInt(campo.cantidad_maxima_registros.toString());
    console.log(`agregarEntrada: ${campo.nombre} - Actual: ${registrosActuales.length}, Límite: ${limite}`);
    if (!isNaN(limite) && registrosActuales.length >= limite) {
      console.warn(`❌ Límite alcanzado! No se puede agregar más registros a ${campo.nombre}`);
      return; // No agregar más si se alcanzó el límite
    }
  }

  const entradaVacia: Record<string, any> = {};
  campo.campos.forEach(subcampo => {
    entradaVacia[subcampo.nombre] = '';
  });

  datosFormulario.value[tituloSeccion][campo.nombre].push(entradaVacia);
  console.log(`✅ Registro agregado a ${campo.nombre}. Total: ${datosFormulario.value[tituloSeccion][campo.nombre].length}`);
  emitirDatos();
};

const eliminarEntrada = (tituloSeccion: string, nombreCampo: string, index: number) => {
  datosFormulario.value[tituloSeccion][nombreCampo].splice(index, 1);
  emitirDatos();
};

const buscarCiudades = async (event: any) => {
  const { data } = await CiudadesColombiaService.buscarPorNombre(event.query, 20);
  // Mapear al formato esperado por AutoComplete (necesita la propiedad 'name')
  ciudadesBuscadas.value = data.map(ciudad => ({
    ...ciudad,
    name: ciudad.nombre
  }));
};

const validateField = (tituloSeccion: string, nombreCampo: string, requerido: boolean) => {
  if (!requerido) {
    errores.value[tituloSeccion]?.delete(nombreCampo);
    validarTodo();
    return;
  }

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
    // Para autocomplete y campos de ciudad (objeto)
    if (!valor.name) {
      errores.value[tituloSeccion].add(nombreCampo);
    } else {
      errores.value[tituloSeccion].delete(nombreCampo);
    }
  } else if (valor === null || valor === undefined) {
    // null o undefined siempre es error si el campo es requerido
    errores.value[tituloSeccion].add(nombreCampo);
  } else {
    // Para strings y números
    if (valor === '') {
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

const puedeAgregarMasRegistros = (tituloSeccion: string, campo: any): boolean => {
  // Si no hay límite, siempre se puede agregar
  if (!campo.cantidad_maxima_registros || campo.cantidad_maxima_registros === null) {
    return true;
  }

  const limite = parseInt(campo.cantidad_maxima_registros);
  if (isNaN(limite)) return true;

  const registrosActuales = datosFormulario.value[tituloSeccion]?.[campo.nombre];
  if (!Array.isArray(registrosActuales)) return true;

  const resultado = registrosActuales.length < limite;

  console.log(`puedeAgregarMasRegistros: ${campo.nombre} - ${registrosActuales.length}/${limite} - ${resultado ? 'SÍ' : 'NO'}`);

  return resultado;
};

const obtenerContadorRegistros = (tituloSeccion: string, campo: any): string => {
  const registrosActuales = datosFormulario.value[tituloSeccion]?.[campo.nombre];
  const cantidad = Array.isArray(registrosActuales) ? registrosActuales.length : 0;
  const limite = campo.cantidad_maxima_registros || 0;
  return `${cantidad} de ${limite} registros`;
};

const validarTodo = (): boolean => {
  if (!camposAdicionalesNormalizados.value?.secciones) return true;

  let esValido = true;

  camposAdicionalesNormalizados.value.secciones.forEach(seccion => {
    if (!errores.value[seccion.titulo]) {
      errores.value[seccion.titulo] = new Set();
    }

    seccion.campos.forEach(campo => {
      if (esRequerido(campo)) {
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
                return !esRequerido(subcampo) || (valorSubcampo !== '' && valorSubcampo !== null && valorSubcampo !== undefined);
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
      } else {
        // Evitar errores residuales cuando un campo ya no es obligatorio
        errores.value[seccion.titulo].delete(campo.nombre);
      }
    });
  });

  emit('update:valid', esValido);
  return esValido;
};

const emitirDatos = () => {
  if (!camposAdicionalesNormalizados.value?.secciones) return;

  const datosCapturados: CamposAdicionalesCapturados = {
    secciones: []
  };

  camposAdicionalesNormalizados.value.secciones.forEach(seccion => {
    const datosSeccion: DatosSeccionCapturados = {
      titulo: seccion.titulo,
      datos: {}
    };

    seccion.campos.forEach(campo => {
      const valor = datosFormulario.value[seccion.titulo][campo.nombre];

      // Para autocomplete y campos de ciudad, extraer solo el nombre
      if (campo.tipo === 'autocomplete' && typeof valor === 'object' && valor !== null) {
        datosSeccion.datos[campo.nombre] = valor.name || valor;
      } else if (campo.tipo === 'input' && campo.tipoInput === 'ciudad' && typeof valor === 'object' && valor !== null) {
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
watch(() => camposAdicionalesNormalizados.value, () => {
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
