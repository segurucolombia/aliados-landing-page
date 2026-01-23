<template>
    <Toast />
    <div class="bg-white p-4 rounded-md w-full lg:w-10/12 xl:w-8/12 justify-self-center lg:justify-self-start">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="col-span-2">
                <div class="flex gap-2 mb-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
                    </svg>
                    <label class="text-xs italic" for="">Alojamientos a cotizar</label>
                </div>
                <div :class="hoteles.length > 1 ? 'lg:grid-cols-7' : 'lg:grid-cols-6'" class="w-full grid grid-cols-1 gap-2" v-for="(item, index) in hoteles">
                    <div class="col-span-2">
                        <label class="text-xs italic" for="">Nombre</label>
                        <input v-model="item.nombre" type="text" class="p-2 rounded-md border w-full">
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs italic" for="">Capacidad día</label>
                        <input v-model="item.capacidad_maxima" type="number" class="p-2 rounded-md border w-full">
                        <span v-if="item.capacidad_maxima > capacidadMaxima" class="text-xs text-red-600 italic">La capacidad maxima es de {{ capacidadMaxima }}</span>
                    </div>
                    <div class="col-span-2">
                        <label class="text-xs italic" for=""># Habitaciones</label>
                        <input v-model="item.numero_habitaciones" type="number" class="p-2 rounded-md border w-full">
                    </div>
                    <div class="flex items-center h-full pt-5" v-if="hoteles.length > 1">
                        <button @click="eliminarHotel(index)" class=" p-2 rounded-md text-white flex items-center justify-center w-full h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-red-600">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="my-4">
                    <button @click="agregarHotel">
                        <p class="text-blue-600 text-sm italic font-medium"> + Agregar registro</p>
                    </button>
                </div>
            </div>
        </div>
        <div class="w-full mt-4 lg:mt-2 flex items-center justify-center">
            <button @click="cotizar" class="bg-green-600 w-full rounded-md text-white p-4 text-lg font-bold flex gap-2 items-center justify-center">
                <p>{{ t('quoter.button_text') }}</p>
                <img src="iconos/loupe.svg" class="w-5 color-fill-icon-loupe" alt="">
            </button>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useToast, Toast } from 'primevue';
import { onMounted, ref } from 'vue';
import { useTranslations } from '../i18n/utils';
import type { THoteles } from '../types/planes';
import { CapacidadesService } from '../services/capacidades.service';

// Services

const _CapacidadesService = new CapacidadesService();

// Toast

const toast = useToast();

// Composables

const {t} = useTranslations();

// Types

export type TSeguroSaveStorage = {
    cantidadAsistentes: number;
    dates: Array<any>;
    evento:{name:string;id:string;risk_id:string;};
}

// Ref

const hoteles = ref<THoteles[]>([{
    capacidad_maxima: 0,
    numero_habitaciones: 0,
    nombre: '',
    id: 1
}])
const capacidadMaxima = ref(0)


// Methods

const agregarHotel = () => {
    const nuevoHotel: THoteles = {
        capacidad_maxima: 0,
        numero_habitaciones: 0,
        nombre: '',
        id: hoteles.value.length + 1
    }
    hoteles.value.push(nuevoHotel)
}
const eliminarHotel = (index: number) => {
    hoteles.value.splice(index, 1)
    let id = 0
    hoteles.value =  hoteles.value.map(a => {
        id += 1
        return {
            ...a,
            id
        }
    })
}

const validarCamposCompletos = () => {
    if (capacidadMaxima.value === 0) {
        toast.add({ severity: 'error', summary: 'Error al cotizar', detail: 'Ocurrio un  error al cotizar los hoteles, por favor intentalo mas tarde', life: 3000 });
        return false
    }
    if (hoteles.value.length && hoteles.value.some(a => a.capacidad_maxima > capacidadMaxima.value)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No te podremos ofrecer cobertura para uno de los hoteles ya que exede la capacidad limite', life: 6000 });
        return false
    }
    if (hoteles.value.length === 0) {
        toast.add({ severity: 'error', summary: 'Información incompleta', detail: 'Agrega al menos un hotel para continuar', life: 3000 });
        return false
    }
    for (let i = 0; i < hoteles.value.length; i++) {
        const item = hoteles.value[i];
        if (!item.capacidad_maxima || !item.numero_habitaciones || !item.nombre) {
            toast.add({ severity: 'error', summary: 'Información incompleta', detail: 'Completa todos los campos para continuar', life: 3000 });
            return false
        }
    }
    return true
}

const cotizar = async () => {
    const validarCamposCompletosConst = validarCamposCompletos()
    if (!validarCamposCompletosConst) {
        return
    }
    localStorage.setItem('bodyCotizacion', JSON.stringify(hoteles.value))
    window.location.assign("/cotizacion");
}

const obtenerCapacidadMaxima = async () => {
    try {
        const {data} = await _CapacidadesService.obtenerCapacidadMaxima()
    capacidadMaxima.value = data.capacidad_maxima
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron obtener las capacidades máximas correctamente', life: 3000 });
    }
}


// Mounted

onMounted(() => {
    obtenerCapacidadMaxima()
})

</script>
<style>
    .color-fill-icon-loupe {
        filter: brightness(0) saturate(100%) invert(90%) sepia(100%) saturate(0%) hue-rotate(277deg) brightness(108%) contrast(101%);
    }
</style>