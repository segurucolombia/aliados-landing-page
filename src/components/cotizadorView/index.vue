<template>
    <section>
        <LoadingSpinner :visible="isLoading" />
        <div class="w-full">
            <div class="h-32 md:h-28 bg-header-cotizador">
                <div class="p-2 lg:p-8 text-center">
                    <p class="text-3xl md:text-4xl lg:text-5xl text-blue-800 font-bold">Protege tus huespedes y cumple con TRA/SIRE automáticamente</p>
                </div>
            </div>
            <div class="px-20 py-10 flex justify-center">
                <div class="border p-4 shadow-md rounded-md w-full lg:w-4/12">
                    <p class="font-bold text-blue-800 text-2xl text-center mb-4">Alojamientos incluidos en esta cotización</p>
                    <DataTable class="text-sm overflow-y-auto" style="max-height: 8rem;" :value="hoteles">
                        <Column field="nombre" header="Alojamiento"></Column>
                        <Column field="capacidad_maxima" header="Huespedes"></Column>
                        <Column field="numero_habitaciones" header="Número de habitaciones"></Column>
                    </DataTable>
                </div>
            </div>
            <div>
                <div v-if="planesCotizados.length" class="lg:flex lg:p-1 xl:px-2 lg:px-0 lg:flex-wrap lg:justify-around lg:gap-8 py-8">
                    <div
                    v-for="plan of planesCotizados"
                        :class="[
                            planPromicionar(plan.id) ? '' : 'my-8',
                            planesCotizados.length > 3 ? 'lg:w-[20%]' : 'lg:w-[30%] xl:w-[25%]',
                            'w-full border-1 border p-2 rounded-md border-blue-600'
                        ]"
                    >
                        <div :class="planPromicionar(plan.id) ? 'bg-blue-800' : 'bg-blue-600'" class="h-[calc(12rem)] card-header w-full drop-shadow-xl rounded-lg py-2 content-center">
                            <div class="w-full flex justify-center">
                                <div class="px-6 py-3 w-full rounded-full text-center">
                                    <p class="text-white font-medium text-2xl">{{ plan.nombre }}</p>
                                </div>
                            </div>
                            <div class="flex gap-2 items-baseline justify-center text-white font-medium">
                                <p class="text-xl font-bold">COP</p>
                                <p class="text-5xl">{{ formatPriceNoDecimal(plan.precio) }}</p>
                            </div>
                            <div class="text-center text-white mb-2 font-bold">
                                <p>PRECIO ANUAL</p>
                            </div>
                        </div>
                        <div class="w-full rounded-lg py-4 content-center" style="height: calc(100% - 12rem);">
                            <div class="text-gray-600 text-lg font-medium my-4">
                                <p class="text-lg font-bold text-center mb-4">Servicios incluidos</p>
                                <div v-for="coverage of plan.coberturas" class="flex gap-2 items-center mb-1">
                                    <div class="w-6 h-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2563eb" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                        </svg>
                                    </div>
                                    <p>{{ coverage.nombre + (coverage.descripcion || coverage.precio ? (' - ' + coverage.descripcion) : '') }} <span v-if="coverage.precio" class="text-xs italic mx-2 text-blue-600">{{ coverage.precio }}</span></p>
                                </div>
                            </div>
                            <div v-if="plan.documento_id" class="w-full text-center mt-8">
                                <PreviewModalPdf :id="plan.documento_id" nombre_boton="Ver detalles" />
                                <!-- <p class="text-blue-800 text-lg font-bold">Ver detalles</p> -->
                            </div>
                            <div class="w-full flex flex-col items-center gap-3 my-4">
                                <button @click="comprar(plan)" class="px-8 py-4 rounded-full bg-blue-800 text-white font-bold text-xl text-center hover:bg-blue-900 transition-colors w-10/12">Comprar plan</button>
                                <button @click="pruebaGratuita(plan)" class="px-8 py-3 rounded-full bg-white text-orange-600 font-medium text-lg text-center hover:bg-orange-50 transition-colors w-10/12 text-md">
                                    <div class="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                        </svg>
                                        <span>Prueba gratuita por 30 días</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { PlanesService } from '../../services/planes.service';
import { formatPrice, formatPriceNoDecimal } from '../../shared/priceFormat';
import Swal from 'sweetalert2';
import type { TFiltersCotizarPlan, THoteles, TPlanCotizar } from '../../types/planes';
import LoadingSpinner from '../../utils/LoadingSpinner.vue';
import { DataTable, Column } from 'primevue';
import PreviewModalPdf from '../previewModalPdf.vue';

export type TPlanesCotizados = {
    id:string;
    nombre:string;
    precio:number;
    version_id:string;
    documento_id?:string;
    coberturas: {id:string;nombre:string;precio:string, descripcion:string}[];
    alojamientos: {
        capacidad_id:string;
        capacidad_maxima:number;
        nombre:string;
        numero_habitaciones:number
    }[]
}

const _PlanesService = new PlanesService();

const planesCotizados = ref<TPlanesCotizados[]>([])
const isLoading = ref(false)

export type TSetPlanesCotizados = {
  capacidad_maxima:number;
  capacidad_id:string;
  nombre:string;
  numero_habitaciones:number;
  planes: {
      id:string;
      nombre:string;
      precio:number;
      version_id:string;
      documento_id?:string;
      coberturas: {id:string;nombre:string;precio:string, descripcion:string}[];
  }[];
}

const hoteles = ref<THoteles[]>([])
const transformarPlanesCotizados = (
    hoteles: THoteles[], 
    planesCotizados: TPlanCotizar[]
): TPlanesCotizados[] => {
    // Crear un mapa para agrupar planes por id
    const planesMap = new Map<string, TPlanesCotizados>();

    // Procesar cada capacidad cotizada
    for (const capacidad of planesCotizados) {
        // Buscar TODOS los hoteles con esta capacidad
        const hotelesConEstaCapacidad = hoteles.filter(
            h => h.capacidad_maxima === capacidad.capacidad_maxima
        );
        
        if (hotelesConEstaCapacidad.length === 0) continue;

        // Procesar cada plan de esta capacidad
        for (const plan of capacidad.planes) {
            // Procesar cada hotel con esta capacidad
            for (const hotel of hotelesConEstaCapacidad) {
                const planExistente = planesMap.get(plan.id);

                if (planExistente) {
                    // Sumar el precio del plan una vez por este hotel
                    planExistente.precio += plan.precio;
                    
                    // Agregar este hotel como alojamiento si no existe ya
                    const alojamientoExiste = planExistente.alojamientos.some(
                        a => a.capacidad_id === capacidad.capacidad_id && 
                             a.nombre === hotel.nombre
                    );
                    
                    if (!alojamientoExiste) {
                        planExistente.alojamientos.push({
                            capacidad_id: capacidad.capacidad_id,
                            capacidad_maxima: capacidad.capacidad_maxima,
                            nombre: hotel.nombre,
                            numero_habitaciones: hotel.numero_habitaciones
                        });
                    }
                } else {
                    // Si es la primera vez que vemos este plan, crearlo
                    planesMap.set(plan.id, {
                        id: plan.id,
                        nombre: plan.nombre,
                        precio: plan.precio, // Precio inicial (primer hotel)
                        version_id: plan.version_id,
                        documento_id: plan.documento_id,
                        coberturas: plan.coberturas.map(c => ({
                            id: c.id,
                            nombre: c.nombre,
                            precio: c.precio,
                            descripcion: c.descripcion
                        })),
                        alojamientos: [{
                            capacidad_id: capacidad.capacidad_id,
                            capacidad_maxima: capacidad.capacidad_maxima,
                            nombre: hotel.nombre,
                            numero_habitaciones: hotel.numero_habitaciones
                        }]
                    });
                }
            }
        }
    }

    // Convertir el mapa a array y ordenar por precio
    return Array.from(planesMap.values()).sort((a, b) => a.precio - b.precio);
};
const cotizarPlanes = async () => {
    planesCotizados.value = [];
    const bodyCotizacion = localStorage.getItem('bodyCotizacion');
    hoteles.value = JSON.parse(bodyCotizacion || '[]');
    
    if (!hoteles.value || !Array.isArray(hoteles.value) || hoteles.value.length === 0) {
        console.error('No se encontró el body de cotización en localStorage');
        return;
    }

    try {
        // Crear array de capacidades a cotizar
        const capacidadesCotizar: TFiltersCotizarPlan[] = hoteles.value.map(hotel => ({
            capacidad_maxima: hotel.capacidad_maxima
        }));

        isLoading.value = true;
        const { data } = await _PlanesService.cotizar({ filters: capacidadesCotizar });
        isLoading.value = false;

        // Transformar los datos usando la nueva función
        planesCotizados.value = transformarPlanesCotizados(hoteles.value, data);

        console.log('Planes cotizados:', planesCotizados.value);
    } catch (error) {
        isLoading.value = false;
        console.error('Error al cotizar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: (error as any)?.response?.data?.error || 
            'No se pudo realizar la cotización, por favor intenta nuevamente.',
        });
    }
};
const planPromicionar = (plan_id:string) => {
    return planesCotizados.value.findIndex(a => a.id == plan_id) == 1
}
const comprar = (plan:TPlanesCotizados) => {
    localStorage.setItem('planSeleccionado', JSON.stringify(plan))
    window.location.assign("/registro");
}

const pruebaGratuita = (plan:TPlanesCotizados) => {
    localStorage.setItem('prueba_gratuita', 'true')
    localStorage.setItem('planSeleccionado', JSON.stringify(plan))
    window.location.assign("/registro");
}
onMounted(() => {
    // hoteles.value = JSON.parse(localStorage.getItem('bodyCotizacion') || '[]');
    cotizarPlanes()
    localStorage.setItem('prueba_gratuita', 'false')
})
</script>
<style>
.bg-header-cotizador {
    background-image: linear-gradient(rgba(214, 223, 255, 0.925), rgba(199, 225, 255, 0.89)),url('/img/forms-bg-header.jpg');
    background-attachment: fixed;
    background-position: bottom;
    background-size: cover;
    /* border-radius: 0rem 0rem 20rem 0rem; */
}
.card-header {
    font-family: 'Montserrat', sans-serif; /* O cambia a Montserrat */
    font-weight: 700;
}
</style>