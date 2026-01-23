<template>
    <div>
        <ProcesandoPago :is-loading="procesandoPago" />
        <LoadingSpinner :visible="isLoading" />
        <div class="bg-blue-100 w-full p-2 flex justify-center border-b header-form image-bg">
        <div class="w-full lg:w-10/12 xl:h-[calc(100vh-10rem)] flex items-center justify-center lg:justify-between py-12 lg:py-4">
            <div class="text-center lg:text-start w-11/12 lg:w-8/12">
                <p class="text-2xl md:text-4xl xl:text-7xl font-bold text-white">Cumple la ley y evita sanciones</p>
                <br class="hidden lg:flex lg:my-8">
                <p class="text-2xl  md:text-3xl xl:text-5xl font-bold text-white">Solución para alojamientos turisticos</p>
                <br class="hidden lg:flex lg:my-8">
                <p class="text-xl font-medium text-white hidden lg:flex lg:justify-self-start md:w-full xl:w-6/12">Ahorra tiempo y disminuye la carga operativa.</p>
                <br class="lg:my-8">
                <Cotizador/>
            </div>
            <div class="container-image-header xl:max-w-[calc(35rem)] md:max-w-[calc(25rem)] md:max-w-[calc(30rem)] lg:w-3/12 bg-white overflow-hidden hidden lg:flex items-center justify-center border border-blue-600 border-4">
                <img class="image-inside" src="img/couple-traveller.jpg" alt="">
            </div>
        </div>
        <Dialog v-model:visible="modalRetomarCompra" modal header="Retomar compra" class="w-11/12 md:w-3/4 lg:w-3/5 xl:w-2/3 max-w-3xl">
            <div>
                <div>
                    <p class="font-medium mb-4">Deseas finalizar tu proceso de compra?</p>
                </div>
                <div class="grid grid-cols-2 border p-2 rounded-md gap-2">
                    <div class="w-full">
                        <p>Tipo de persona: <span class="font-bold">{{ detalleCompra?.nit ? 'Juridica' : 'Natural'  }}</span></p>
                    </div>
                    <div class="w-full">
                        <p>Plan seleccionado: <span class="font-bold">{{ detalleCompra?.nombre_plan  }}</span></p>
                    </div>
                    <div class="w-full">
                        <p>Valor: <span class="font-bold">{{cuponDescuento.valor > 0 && compraRetomada && detalleCompra?.precio ? formatPrice(detalleCompra?.precio + cuponDescuento.valor)  :  detalleCompra?.precio ? formatPrice(detalleCompra?.precio) : 0  }}</span></p>
                    </div>
                    <div class="w-full" v-if="detalleCompra?.nit">
                        <p>Nombre empresa: <span class="font-bold">{{ detalleCompra?.nombre_empresa  }}</span></p>
                    </div>
                    <div class="w-full" v-if="detalleCompra?.numero_documento_representante">
                        <p>Nombre: <span class="font-bold">{{ detalleCompra?.nombre_representante  }}</span></p>
                    </div>
                    <div class="w-full" v-if="detalleCompra?.numero_documento_representante">
                        <p>Documento: <span class="font-bold">{{ detalleCompra?.tipo_documento_representante + ' - ' + detalleCompra.numero_documento_representante  }}</span></p>
                    </div>
                    <div class="w-full" v-if="detalleCompra?.nit">
                        <p>Nit: <span class="font-bold">{{ detalleCompra?.nit  }}</span></p>
                    </div>
                    <div class="w-full">
                        <p>Email: <span class="font-bold">{{ detalleCompra?.email  }}</span></p>
                    </div>
                </div>
                <div class="p-4 bg-green-200 border rounded-md mt-4" v-if="detalleCompra?.codigo_descuento">
                  <p class="text-green-600">Felicidades! tienes un descuento de <span class="font-bold">{{ formatPrice(cuponDescuento.valor) }}</span> con tu código {{ detalleCompra.codigo_descuento }} </p>
                  <p class="text-blue-600">Tu valor a pagar es <span class="text-blue-600 font-bold">{{ compraRetomada && cuponDescuento ? formatPrice(detalleCompra.precio) : formatPrice(cuponDescuento.valor_pagar_descuento) }}</span></p>
                </div>
                <DataTable class="text-sm" :value="detalleCompra?.alojamientos">
                    <Column field="nombre" header="Alojamiento">
                    <template #body="{data}">
                        <div class="w-60">
                            <p class="font-medium">{{ data.nombre }}</p>
                            <p class="text-sm italic text-gray-600">Capacidad máxima: <span class="font-medium">{{ data.capacidad_maxima }}</span></p>
                            <p class="text-sm italic text-gray-600">Número de habitaciones: <span class="font-medium">{{ data.numero_habitaciones }}</span></p>
                        </div>
                    </template>
                    </Column>
                    <Column field="ciudad" header="Ciudad del alojamiento"></Column>
                    <Column field="direccion" header="Dirección del alojamiento"></Column>
                    <Column field="tipo" header="Tipo de alojamiento"></Column>
                    <Column field="amenidades" header="Amenidades"></Column>
                </DataTable>
                <div class="mt-2 flex justify-end">
                    <button @click="crearPreventa" class="p-2 bg-blue-600 text-white font-bold rounded-md flex gap-2 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                        </svg>
                        Ir a pagar
                    </button>
                </div>
                <!-- {{ detalleCompra }} -->
            </div>
        </Dialog>
    </div>
    </div>
</template>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"/>
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Cotizador from '../components/cotizador.vue';
import { useTranslations } from '../i18n/utils';
import { CuponesService } from '../services/cupones.service';
import LoadingSpinner from '../utils/LoadingSpinner.vue';
import { PreVentaService } from '../services/pre-venta.service';
import { Dialog, DataTable, Column } from 'primevue';
import type { TGetPreventaAtt } from '../types/pre-venta';
import { formatPrice } from '../shared/priceFormat';
import ProcesandoPago from '../components/register/components/pago-proceso.vue'
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import { TransactionService } from '../services/transactions';
const {t} = useTranslations();

const _CuponesService = new CuponesService()
const _PreVentaService = new PreVentaService()
const _TransactionService = new TransactionService()
const isLoading = ref(false)
const procesandoPago = ref(false)
const modalRetomarCompra = ref(false)
const detalleCompra = ref<TGetPreventaAtt | null>(null)
const compraRetomada = ref(false)
const cuponDescuento = ref({
  validado: false,
  codigo: '',
  asesor_id: '',
  valor: 0,
  valor_pagar_descuento: 0
})
const validarCupon = async  () => {
    const url = new URL(window.location.href);

const cupon = url.searchParams.get('cupon');
    if (cupon) {
        isLoading.value = true
        const {data} = await _CuponesService.buscar({nombre: cupon})
        isLoading.value = false
        if (data?.estado) {
            localStorage.setItem('cupon_activo_codigo', data.nombre);
        }
    } else {
        console.log('❌ No se encontró parámetro de cupón');
    }
}
const retomarCompra = async () => {
  const url = new URL(window.location.href);
  const preventaId = url.searchParams.get('preventaId');
  if (!preventaId) return
  const {data} = await _PreVentaService.find({id:preventaId.toString()})
  compraRetomada.value = true
  detalleCompra.value = data
  await validarCuponDescuento()
  modalRetomarCompra.value = true
  console.log('findedPreventa', data)
}

const crearPreventa = async () => {
  if ((detalleCompra.value?.precio ?? 0) === 0) return
  if ((!detalleCompra.value?.id)) return
  
  try {
    isLoading.value = true
    if (compraRetomada.value) {
      const {data} = await _TransactionService.crear({
        amount: detalleCompra.value.precio,
        table_id: detalleCompra.value.id,
        table_name: 'PreVentaPlanes'
      })
      if (!data) {
        Swal.fire({
          title: "Oopss",
          text: "Ocurrio un error, por favor intenta mas tarde",
          icon: "error"
        });
        return
      }
      isLoading.value = false
      localStorage.setItem('transaccionProcesoId', data.transaccion_id)
      sendWompi(data.transaccion_id, data.hash, data.transaccion_id)
    } else {
      
      const {data: {hash, id_transaction}} = await _PreVentaService.crearPreVenta({
        contrasena: detalleCompra.value.contrasena,
        numero_documento_representante: detalleCompra.value.numero_documento_representante || detalleCompra.value.nit,
        tipo_documento_representante: detalleCompra.value.tipo_documento_representante || 'NIT',
        email: detalleCompra.value.email,
        fecha_fin: dayjs().add(1, 'year').toDate(),
        fecha_inicio: dayjs().toDate(),
        nit: detalleCompra.value.nit,
        nombre_empresa: detalleCompra.value.nombre_empresa,
        nombre_representante: detalleCompra.value.nombre_representante,
        precio: detalleCompra.value?.precio ?? 0,
        telefono: detalleCompra.value.telefono,
        usuario: detalleCompra.value.nit || detalleCompra.value.numero_documento_representante,
        numero_alojamientos: detalleCompra.value.alojamientos.length || 1,
        codigo_descuento: detalleCompra.value.codigo_descuento,
        numero_meses: 12,
        advisor_id: detalleCompra.value.advisor_id,
        version_plan_id: detalleCompra.value.id,
        prueba_gratuita: false,
        detalle_alojamientos: detalleCompra.value.alojamientos.map(hotel => {
          return {
            ciudad: hotel.ciudad,
            direccion: hotel.direccion,
            nombre_alojamiento: hotel.nombre,
            tipo_alojamiento: hotel.tipo,
            amenidades: hotel.amenidades,
            capacidad_maxima: hotel.capacidad_maxima,
            numero_habitaciones: hotel.numero_habitaciones,
            capacidad_id: hotel.capacidad_id
          }
        })
      })
      isLoading.value = false
      localStorage.setItem('transaccionProcesoId', id_transaction)
      sendWompi(id_transaction, hash, id_transaction)
    }
  } catch (error: any) {
    isLoading.value = false
    Swal.fire({
      title: "Oopss",
      text: error?.response?.data?.message || "Ocurrio un error, por favor intenta mas tarde",
      icon: "error"
    });
  }
}
const sendWompi = (reference: string, signature: string, transaccionProcesoId: string) => {
  if ((detalleCompra.value?.precio ?? 0) === 0) return
  procesandoPago.value = true
  let valorPagar = detalleCompra.value?.codigo_descuento ? cuponDescuento.value.valor_pagar_descuento : detalleCompra.value?.precio || 0
  if (compraRetomada) {
    valorPagar = detalleCompra.value?.precio || 0
  }
  const createHiddenInput = (name: any, value: any) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    return input;
  }
  if (valorPagar === 0) return

  const form = document.createElement('form');
  form.action = import.meta.env.PUBLIC_CHECKOUT_URL_WOMPI;
  form.method = 'GET';
  form.target = '_blank'

  form.appendChild(createHiddenInput('public-key', import.meta.env.PUBLIC_KEY_WOMPI));
  form.appendChild(createHiddenInput('currency', 'COP'));
  form.appendChild(createHiddenInput('amount-in-cents', (valorPagar * 100)));
  form.appendChild(createHiddenInput('reference', reference));
  form.appendChild(createHiddenInput('signature:integrity', signature));
  form.appendChild(createHiddenInput('redirect-url', import.meta.env.PUBLIC_WOMPI_REDIRECT_PAYMENT_COMPLETE || 'https://compras.segurucolombia.com/registro'));
  form.appendChild(createHiddenInput('customer-data:email', detalleCompra.value?.email || 'cliente@email.com'));
  form.appendChild(createHiddenInput('customer-data:full-name', detalleCompra.value?.nombre_representante));
  form.appendChild(createHiddenInput('customer-data:phone-number', detalleCompra.value?.telefono));
  form.appendChild(createHiddenInput('customer-data:legal-id', detalleCompra.value?.tipo_documento_representante || 'NIT'));
  form.appendChild(createHiddenInput('customer-data:legal-id-type', detalleCompra.value?.numero_documento_representante || detalleCompra.value?.nit));

  document.body.appendChild(form);
  form.submit();
  consultarTransaccion(transaccionProcesoId)
}
const consultarTransaccion = async (transaccionIdProceso: string) => {
  console.log('transaccionIdProceso', transaccionIdProceso)
  if(transaccionIdProceso) {
    const {data} = await _TransactionService.consultarTransaccion({
      id:transaccionIdProceso
    })
    if (data?.state === 'PENDING') {
      setTimeout(() => {
        consultarTransaccion(transaccionIdProceso)
      }, 20000)
    } else {
      window.location.href = '/pago-aprobado'
    }
  }
}

const validarCuponDescuento = async () => {
  if (!detalleCompra.value?.codigo_descuento) return
  isLoading.value = true
  const {data} = await _CuponesService.buscar({nombre: detalleCompra.value.codigo_descuento})
  isLoading.value = false
  if (data && data.estado) {
    cuponDescuento.value = {
      asesor_id: data.asesor_id || '',
      codigo: data.nombre,
      validado: true,
      valor: data.valor,
      valor_pagar_descuento: Number(detalleCompra.value?.precio) > data.valor ? Number(detalleCompra.value?.precio) - data.valor : 0
    }
  }
}
onMounted(() => {
    localStorage.clear()
    validarCupon()
    retomarCompra()
    const transaccionIdProceso = localStorage.getItem('transaccionProcesoId')
    if (transaccionIdProceso) {
      consultarTransaccion(transaccionIdProceso)
    }
})
</script>
<style>
@media only screen and (max-width: 1250px) {
    .header-form {
        border-radius: 0rem 0rem 5rem 0rem;
    }
}
@media only screen and (min-width: 1250px) {
    .header-form {
        border-radius: 0rem 0rem 20rem 0rem;
    }
}

.image-header {
    width: 36rem;
}
.container-image-header {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 20em 0 20em 20em;
  overflow: hidden;
  border: 4px solid #2563eb; /* azul-600 */
  background-color: white;
}

.image-inside {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.image-bg {
    background: linear-gradient(rgba(1, 60, 255, 0.5), rgba(0, 119, 255, 0.5)), 
                url("/img/forms-bg-header.jpg");
}
</style>