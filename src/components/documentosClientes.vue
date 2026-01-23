<template>
    <section>
        <Dialog v-model:visible="showModaleCreateAtachment" @hide="closeModal" modal header="Debes completar los documentos para tu poliza" :style="{ width: '50rem', zIndex: 1000 }">
            <LoadingSpinner :visible="isLoading" />
            <div>
                <div class="card">
                    <Steps v-model:activeStep="active" :readonly="false" :model="items" />
                    <div class="mt-4" v-if="active == 0">
                        <div>
                            <p class="text-sm font-bold italic">1. Selecciona el tipo de persona</p>
                        </div>
                        <div>
                            <div class="">
                                <label for="" class="text-gray-600 text-xs italic">Tipo de persona</label>
                                <Dropdown
                                  disabled
                                  v-model="model.type_person_id"
                                  :options="typePersonConfig"
                                  optionLabel="name"
                                  optionValue="id"
                                  @change="selectTypePerson"
                                  class="w-full md:w-14rem" />
                            </div>
                        </div>
                    </div>
                    <div  class="mt-4" v-if="active == 1">
                      <div>
                          <p class="text-sm font-bold italic mb-4">2. Adjunta los archivos requeridos</p>
                      </div>
                      <div v-if="!documentsFiltered.length" class="bg-yellow-300 border-2 rounded-md border-yellow-600 text-yellow-600 p-2 my-4">
                        <p>Debes seleccionar primero el tipo de persona</p>
                      </div>
                      <!-- {{ documentsFiltered }} -->
                      <div class="grid grid-cols-1 gap-2" v-for="doc in documentsFiltered">
                        <div>
                          <div class="bg-gray-300 rounded-md p-2 flex justify-between mb-4" v-if="doc.document">
                              <div class="flex gap-2 items-center my-2">
                                <i class="pi pi-file"></i>
                                <p>{{ doc?.title }}</p>
                              </div>
                              <button @click="doc.document = null">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                </svg>
                              </button>
                              <!-- <Button icon="pi pi-trash" severity="danger" text raised rounded class="bg-red-600 text-white" @click="doc.document = null" /> -->
                          </div>
                          <div v-else class="mb-4">
                            <FileUpload
                              :chooseLabel="`Subir archivo ${doc.title}`"
                              name="demo[]"
                              class="w-full"
                              url="/api/upload"
                              cancelLabel=""
                              uploadLabel=""
                              accept="application/pdf"
                              :maxFileSize="5242880"
                              :showUploadButton="false"
                              :showCancelButton="false"
                              @select="doc.document = $event.files[0]"
                            />

                            <!-- <FileUpload
                              name="demo[]"
                              url="/api/upload"
                              accept="application/pdf"
                              :maxFileSize="5242880"
                              chooseLabel="Subir archivo"
                              cancelLabel=""
                              uploadLabel=""
                              :showUploadButton="false"
                              :showCancelButton="false"
                              @select="doc.document = $event.files[0]"
                              class="w-full"
                            /> -->
                          </div>
                          <span v-if="doc.error && !doc.document" class="text-xs italic text-red-600">El archivo es requerido</span>
                        </div>
                      </div>
                      <!-- <Accordion :multiple="true" :activeIndex="0">
                          <AccordionTab class="border" v-for="tab in documentsFiltered" :key="tab.title" :header="tab.title">
                            <div class="bg-gray-300 rounded-md p-2 flex justify-between" v-if="tab.document">
                              <div class="flex gap-2 items-center my-2">
                                <i class="pi pi-file"></i>
                                <p>{{ tab.document?.name }}</p>
                              </div>
                              <Button icon="pi pi-trash" severity="danger" text raised rounded class="bg-red-600 text-white" @click="tab.document = null" />
                            </div>
                            <FileUpload
                              v-else
                              :chooseLabel="`Subir archivo ${tab.title}`"
                              mode="basic"
                              name="demo[]"
                              class="w-full"
                              url="/api/upload"
                              accept="application/pdf"
                              :maxFileSize="5242880"
                              @select="tab.document = $event.files[0]"
                            />
                            <span v-if="tab.error && !tab.document" class="text-xs italic text-red-600">El archivo es requerido</span>
                          </AccordionTab>
                      </Accordion> -->
                    </div>
                    <div class="mt-4" v-if="active == 2">
                        <div>
                            <p class="text-sm font-bold italic">3. Valor asegurado</p>
                        </div>
                        <div>
                            <div class="">
                                <label for="" class="text-gray-600 text-xs italic">Ingrese el valor asegurado</label>
                                <InputNumber disabled v-model="model.valor_asegurado" inputId="currency-us" class="w-full" mode="currency" currency="USD" locale="en-US" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex justify-between gap-2 mt-4">
                <div  class="w-full flex justify-start" v-if="active !== 0">
                    <Button @click="active -= 1 " icon="pi pi-arrow-left"  type="button" label="Anterior" severity="secondary"></Button>
                </div>
                <div class="w-full flex justify-end"  v-if="active !== 2">
                    <Button @click="active += 1 " icon="pi pi-arrow-right" type="button" label="Siguiente"></Button>
                </div>
                <div class="w-full flex justify-end" v-if="active == 2">
                    <Button @click="confirmData" :icon="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-save'" :disabled="isLoading" type="button" label="Guardar"></Button>
                </div>
            </div>
        </Dialog>
        <Dialog v-model:visible="showConfirmDialog" header="Confirmar datos" modal :closable="false" :style="{ width: '40rem' }">
            <div class="w-full">
                <div class="flex flex-column justify-center items-center w-full gap-3 border-bottom-1 surface-border">
                    <i class="pi pi-exclamation-circle text-6xl text-blue-600"></i>
                    <p>Por favor confirme que los datos sean correctos antes de hacer el envío del correo a la aseguradora</p>
                </div>
                <div class="w-full grid grid-cols-2 gap-2 mt-2 border p-2 rounded-md">
                    <p>Tipo de persona:</p>
                    <p>{{ typePersonConfig.find(a => a.id == model.type_person_id)?.name }}</p>
                    <p>Valor asegurado:</p>
                    <p>{{ formatPrice(model.valor_asegurado) }}</p>
                    <p>Documentos:</p>
                    <div>
                        <div v-for="tab in documentsFiltered" :key="tab.title">
                            <div class="flex gap-2 text-sm">
                                <p>{{ tab.title }} - {{ tab.document?.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-outlined p-button-sm" @click="showConfirmDialog = false" />
                <Button label="Enviar información" :disabled="isLoading" :icon="isLoading ? 'pi pi-spin pi-spinner' : 'pi pi-check'" class="p-button-sm" @click="confirmAndSave" />
            </template>
        </Dialog>
    </section>
</template>
<script setup lang="ts">
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Steps from 'primevue/steps';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import FileUpload from 'primevue/fileupload';
import { onMounted, ref, defineProps, watch } from 'vue';
import Dropdown from 'primevue/dropdown';
import Swal from 'sweetalert2';
import { useConfirm } from "primevue/useconfirm";
import InputNumber from 'primevue/inputnumber';
import type { TGetPreventaAtt } from '../types/pre-venta';
import { formatPrice } from '../shared/priceFormat';
import { PreVentaService } from '../services/pre-venta.service';
import { DocumentosClientesPolizasService } from '../services/documentos';
import { ConfigService } from '../services/config';
import LoadingSpinner from '../utils/LoadingSpinner.vue';

export interface TypePerson {
  id: string;
  name: string;
  state: boolean;
  created_at?: string; // opcional porque no siempre aparece
  updated_at?: string;
}

export interface ItemConfigDocument {
  id: string;
  name: string;
  state: boolean;
  typePerson?: TypePerson;   // opcional porque no todos lo tienen
  type_person_id?: string;   // opcional también
}

// Services

const _PreVentaService = new PreVentaService()
const _DocumentosClientesPolizasService = new DocumentosClientesPolizasService()
const _ConfigService = new ConfigService()


// Props

const props = defineProps({
  customer_id: String,
  customer_comercial_name: String,
  customer_nit: String,
  customer_name: String,
  show_modal:Boolean
})

// Emits

const emits = defineEmits(['complete'])

//Validation
const documentsFiltered = ref<{title:string; document: File | null; id:string; error:boolean}[]>([])
// Ref
const typePersonConfig = ref<{
  id: string;
  name: string;
  state: boolean;
}[]>([])
const configDocumentsList = ref<ItemConfigDocument[]>([])
const showModaleCreateAtachment = ref(false)
const showConfirmDialog = ref(false);
const isLoading = ref(false)
const model = ref({
  type_person_id: '',
  valor_asegurado: 0
})
const items = ref([
    {
        icon: 'pi pi-user',
        id: 1,
        label: 'Tipo de persona'
    },
    {
        icon: 'pi pi-calendar',
        id: 2,
        label: 'Documentos'
    },
    {
        icon: 'pi pi-check',
        id: 4,
        label: 'Valor asegurado'
    }
]);
const active = ref(0)
const preventaClienteData = ref<TGetPreventaAtt | null>(null)

// Methods

const selectTypePerson = () => {
  documentsFiltered.value = []
  for (const a of configDocumentsList.value) {
    if (a.type_person_id == model.value.type_person_id) {
      documentsFiltered.value.push({
        title: a.name,
        document: null,
        id: a.id,
        error: false
      })
    }
  }
}


const saveDocuments = async () => {
  // Validaciones previas
  if (!documentsFiltered.value || documentsFiltered.value.length === 0) {
    throw new Error('Debe seleccionar al menos un documento');
  }

  // Validar que todos los documentos tengan archivo y tipo
  for (let i = 0; i < documentsFiltered.value.length; i++) {
    const doc = documentsFiltered.value[i];
    
    if (!doc.document || !(doc.document instanceof File)) {
      throw new Error(`El documento en la posición ${i + 1} no es válido`);
    }
    
    if (!doc.id) {
      throw new Error(`Debe seleccionar el tipo de documento para el archivo ${doc.document.name}`);
    }
  }

  if (!props.customer_id) {
    throw new Error('ID del cliente es requerido');
  }

  if (!model.value.type_person_id) {
    throw new Error('Tipo de persona es requerido');
  }

  if (!model.value.valor_asegurado) {
    throw new Error('Valor asegurado es requerido');
  }

  const formData = new FormData();

  // Agregar los documentos y sus tipos
  documentsFiltered.value.forEach((doc, index) => {
    console.log(`Agregando documento ${index}:`, {
      filename: doc.document?.name,
      tipo: doc.id,
      isFile: doc.document instanceof File
    });
    
    formData.append(`detalles[${index}][tipo_documento_configuracion_id]`, doc.id);
    if (doc.document) {
      formData.append(`detalles[${index}][documento]`, doc.document);
    }
  });

  // Agregar campos principales
  formData.append('cliente_id', props.customer_id.toString());
  formData.append('tipo_persona', model.value.type_person_id);
  formData.append('valor_asegurado', model.value.valor_asegurado.toString());

  const conecteduserName = localStorage.getItem('userName');
  if (conecteduserName) {
    formData.append('created_by', conecteduserName);
  }

  try {
    isLoading.value = true
    
    await _DocumentosClientesPolizasService.crear(formData);
    isLoading.value = false
    
    Swal.fire({
      title: "Guardado",
      text: "Los documentos se han enviado a la aseguradora con éxito",
      icon: "success"
    }).then(() => {
      closeModal();
      emits('complete')
    });
    
  } catch (error:any) {
    isLoading.value = false
    console.error('Error al guardar documentos:', error);
    
    Swal.fire({
      title: "Error",
      text: error?.response?.data?.message || 'Ocurrió un error inesperado, por favor intenta nuevamente más tarde',
      icon: "error"
    });
  }
};

const confirmData = () => {
  if (documentsFiltered.value.some(a => !a.document)) {
    documentsFiltered.value = documentsFiltered.value.map(a => {
      a.error = true
      return a
    })
    return
  }
  showConfirmDialog.value = true;
};

const confirmAndSave = () => {
  showConfirmDialog.value = false;
  saveDocuments();
};

const closeModal = () => {
  showModaleCreateAtachment.value = false
  documentsFiltered.value = []
}

const obtenerConfiguracionTipoPersona = async () => {
  const {data} = await _ConfigService.getConfigTypePerson()
  typePersonConfig.value = data
}

const obtenerConfiguracionDocumentosClientes = async () => {
  const {data} = await _ConfigService.getConfigCustomerDocuments()
  configDocumentsList.value = data
}

const openModal = async () =>  {
  if (props.show_modal) {
    const {data} = await _PreVentaService.find({cliente_id:props.customer_id})
    preventaClienteData.value = data
    if (!preventaClienteData) return
    showModaleCreateAtachment.value = props.show_modal 
    isLoading.value = true 
    await obtenerConfiguracionTipoPersona()
    await obtenerConfiguracionDocumentosClientes()
    isLoading.value = false 
    console.log('typePersonConfig', typePersonConfig.value)
    if (preventaClienteData.value.tipo_documento_representante.toUpperCase() === 'NIT') {
      model.value.type_person_id = typePersonConfig.value?.find(a => a.name === 'Juridica')?.id || ''
    } else {
      model.value.type_person_id = typePersonConfig.value?.find(a => a.name === 'Natural')?.id || ''
    }
    model.value.valor_asegurado = preventaClienteData.value.plan_version?.valor_asegurado || 0
    selectTypePerson()
  }
}

// Watch
watch(() => props.show_modal, (newValue) => {
  if (newValue) {
    openModal()
  }
})

// Mounted
onMounted(() => {
  openModal()
})
</script>
<style>
.swal2-container {
  z-index: 999999;
}

.loading-overlay {
  z-index: 999999 !important;
}

input[type="file"]::-webkit-file-upload-value {
  display: none;
}
input[type="file"]::file-selector-button {
  font-size: 0; /* oculta el texto */
}

.p-fileupload input[type="file"] {
  display: none !important;
}
</style>