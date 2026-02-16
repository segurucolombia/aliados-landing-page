<template>
    <section>
      <Toast/>
      <LoadingSpinner :visible="isLoading" />
        <div class="p-2 md:p-4 xl:p-12 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:px-12 lg:h-[calc(100vh-20rem)] lg:overflow-auto">
            <div class="w-full p-2 rounded-md h-max ">
              <div class="card-header w-full drop-shadow-xl rounded-lg py-2 content-center hidden lg:block">
                  <div class="w-full flex justify-center">
                      <div class="px-3 py-1 w-full rounded-full text-center">
                          <p class=" font-bold justify-center text-lg lg:text-xl mb-4 hidden lg:flex">PLAN SELECCIONADO</p>
                          <p class=" font-medium text-2xl">{{ plan?.nombre ?? '' }}</p>
                      </div>
                    </div>
                    <div class="flex gap-2 items-baseline justify-center  font-medium">
                        <p class="text-xl font-bold">COP</p>
                        <p class="text-5xl">{{ formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                    </div>
                    <div class="text-center  mb-2 font-bold">
                        <p>PRECIO</p>
                    </div>
              </div>
              <div class="card-header w-full drop-shadow-xl rounded-lg py-2 content-center lg:hidden">
                <div class="flex gap-2 justify-center items-center">
                  <p class="font-medium text-xl text-center">{{ plan?.nombre ?? '' }} - COP {{ formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                  <button
                    @click="showDetail = !showDetail"
                    class="min-w-[44px] min-h-[44px] rounded-full shadow-md p-2 flex items-center justify-center"
                    :aria-label="showDetail ? 'Ocultar detalles del plan' : 'Mostrar detalles del plan'"
                    :aria-expanded="showDetail"
                  >
                    <svg v-if="showDetail" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>

                  </button>
                </div>
              </div>
              <!-- Web -->
              <div class="w-full rounded-lg py-1 content-center h-max hidden lg:inline">
                  <div class="text-gray-600 text-center font-medium my-2">
                      <p class="text-lg font-bold">Detalles del plan:</p>
                      <p>Fecha suscripción: {{ dayjs().format('YYYY-MM-DD') + ' - ' +  dayjs().add(1, 'year').format('YYYY-MM-DD')}}</p>
                  </div>
              </div>
              <div v-if="plan?.coberturas" class="w-full mt-4 hidden lg:block">
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h3 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 text-blue-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                          </svg>
                          Servicios incluidos
                      </h3>
                      <div class="space-y-2">
                          <div v-for="coverage of plan.coberturas" :key="coverage.nombre" class="flex gap-2 items-start p-2 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                              <div class="w-4 h-4 mt-0.5 flex-shrink-0 mt-2">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-blue-600">
                                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                                  </svg>
                              </div>
                              <div class="flex items-center gap-1">
                                  <p class="text-gray-700 text-xs leading-relaxed">
                                      <span class="font-medium ">{{ coverage.nombre }}</span>
                                      <span v-if="coverage.descripcion" class="text-gray-500"> - {{ coverage.descripcion }}</span>
                                  </p>
                                  <span v-if="coverage.precio" class="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{{ coverage.precio }}</span>
                              </div>
                          </div>
                      </div>
                      <div v-if="plan.documento_id" class="w-full text-center mt-4">
                          <PreviewModalPdf :id="plan.documento_id" nombre_boton="Ver detalles" />
                      </div>
                  </div>
              </div>
              <div class="w-full rounded-lg py-1 content-center h-max hidden lg:inline">
                  <div class="text-gray-600 text-lg font-medium my-2">
                      <p class="text-lg font-bold text-center mb-2">Alojamientos cotizados</p>
                      <div v-for="hotel in hoteles" class="grid grid-cols-3 gap-2">
                        <div>
                          <p class="text-xs italic">Nombre</p>
                          {{ hotel.nombre }}
                        </div>
                        <div>
                          <p class="text-xs italic">Huespedes</p>
                          {{ hotel.capacidad_maxima }}
                        </div>
                        <div>
                          <p class="text-xs italic">Número de habitaciones</p>
                          {{ hotel.numero_habitaciones }}
                        </div>
                      </div>
                  </div>
              </div>
              <!-- Mobile -->
              <div v-if="showDetail" class="w-full rounded-lg py-1 content-center h-max">
                  <div class="text-gray-600 text-center font-medium my-2">
                      <p class="text-lg font-bold">Detalles del plan:</p>
                      <p>Fecha suscripción: {{ dayjs().format('YYYY-MM-DD') + ' - ' +  dayjs().add(1, 'year').format('YYYY-MM-DD')}}</p>
                  </div>
              </div>
              <div v-if="plan?.coberturas && showDetail" class="w-full mt-3">
                  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                      <h3 class="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 text-blue-600">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                          </svg>
                          Servicios incluidos
                      </h3>
                      <div class="space-y-1.5">
                          <div v-for="coverage of plan.coberturas" :key="coverage.nombre" class="flex gap-2 items-start p-2 bg-blue-50 rounded-md">
                              <div class="w-3.5 h-3.5 mt-0.5 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3.5 h-3.5 text-blue-600">
                                      <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
                                  </svg>
                              </div>
                              <div class="flex-1">
                                  <p class="text-gray-700 text-xs leading-relaxed">
                                      <span class="font-medium">{{ coverage.nombre }}</span>
                                      <span v-if="coverage.descripcion" class="text-gray-500"> - {{ coverage.descripcion }}</span>
                                  </p>
                                  <span v-if="coverage.precio" class="inline-block mt-1 text-xs font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">{{ coverage.precio }}</span>
                              </div>
                          </div>
                      </div>
                      <div v-if="plan.documento_id" class="w-full text-center mt-3">
                          <PreviewModalPdf :id="plan.documento_id" nombre_boton="Ver detalles" />
                      </div>
                  </div>
              </div>
              <div v-if="showDetail" class="w-full rounded-lg py-1 content-center h-max">
                  <div class="text-gray-600 text-lg font-medium my-2">
                      <p class="text-lg font-bold text-center mb-2">Alojamientos cotizados</p>
                      <div v-for="hotel in hoteles" class="grid grid-cols-3 gap-2">
                        <div>
                          <p class="text-xs italic">Nombre</p>
                          {{ hotel.nombre }}
                        </div>
                        <div>
                          <p class="text-xs italic">Huespedes</p>
                          {{ hotel.capacidad_maxima }}
                        </div>
                        <div>
                          <p class="text-xs italic">Número de habitaciones</p>
                          {{ hotel.numero_habitaciones }}
                        </div>
                      </div>
                  </div>
              </div>
            </div>
          </div>
          <div class="col-span-2 lg:border-l px-2 lg:px-12 w-full">
            <Stepper @update:activeStep="onStepChange" v-model="pasoActivo">
              <StepList>
                  <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild active value="0">
                      <div class="flex flex-row flex-auto gap-2" v-bind="a11yAttrs.root">
                          <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="handleStepClick(activateCallback, '0', $event)" v-bind="a11yAttrs.header" aria-label="Paso 1: Información del cliente">
                              <span
                                  :class="[
                                      'rounded-full border-2 w-8 h-8 inline-flex items-center justify-center transition-all duration-200',
                                      {
                                          'bg-blue-600 text-white border-primary': parseInt(String(value)) < parseInt(String(pasoActivo)),
                                          'bg-blue-100 text-blue-600 border-blue-300': parseInt(String(value)) === parseInt(String(pasoActivo)),
                                          'border-surface-200  dark:border-surface-700 text-surface-400': parseInt(String(value)) > parseInt(String(pasoActivo))
                                      }
                                  ]"
                              >
                                  <!-- Icono de check para pasos completados -->
                                  <svg v-if="parseInt(String(value)) < parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                      <!-- <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" /> -->
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                    </svg>
                                  <!-- Icono de lista para paso actual -->
                                  <svg v-else-if="parseInt(String(value)) === parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                                  </svg>
                                  <!-- Número para pasos futuros -->
                                  <span v-else class="text-sm font-medium">1</span>
                              </span>
                          </button>
                          <p class="w-max font-medium hidden lg:inline" :class="{ 'text-primary': parseInt(String(value)) <= parseInt(String(pasoActivo)), 'text-surface-500': parseInt(String(value)) > parseInt(String(pasoActivo)) }">
                              Información del cliente
                          </p>
                          <Divider />
                      </div>
                  </Step>

                  <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild value="1">
                      <div class="flex flex-row flex-auto gap-2 ml-2" v-bind="a11yAttrs.root">
                          <button class="bg-transparent border-0 inline-flex flex-col gap-2" :disabled="true" @click="handleStepClick(activateCallback, '1', $event)" v-bind="a11yAttrs.header" aria-label="Paso 2: Alojamientos">
                              <span
                                  :class="[
                                      'rounded-full border-2 w-8 h-8 inline-flex items-center justify-center transition-all duration-200',
                                      { 
                                          'bg-blue-600 text-white border-primary': parseInt(String(value)) < parseInt(String(pasoActivo)), 
                                          'bg-blue-100 text-blue-600 border-blue-600': parseInt(String(value)) === parseInt(String(pasoActivo)),
                                          'border-surface-200 dark:border-surface-700 text-surface-400': parseInt(String(value)) > parseInt(String(pasoActivo)) 
                                      }
                                  ]"
                              >

                                  <svg v-if="parseInt(String(value)) < parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                  </svg>
                                  <svg v-else-if="parseInt(String(value)) === parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
                                      
                                  </svg>
                                  <span v-else class="text-sm font-medium">2</span>
                              </span>
                          </button>
                          <p class="w-max font-medium hidden lg:inline" :class="{ 'text-primary': parseInt(String(value)) <= parseInt(String(pasoActivo)), 'text-surface-500': parseInt(String(value)) > parseInt(String(pasoActivo)) }">
                              Alojamientos
                          </p>
                          <Divider />
                      </div>
                  </Step>

                  <Step v-slot="{ activateCallback, value, a11yAttrs }" asChild value="2">
                      <div class="flex justify-end gap-2 ml-2" v-bind="a11yAttrs.root">
                          <button class="bg-transparent border-0 inline-flex flex-col gap-2" @click="handleStepClick(activateCallback, '2', $event)" v-bind="a11yAttrs.header" aria-label="Paso 3: Pago">
                              <span
                                  :class="[
                                      'rounded-full border-2 w-8 h-8 inline-flex items-center justify-center transition-all duration-200',
                                      { 
                                          'bg-primary text-primary-contrast border-primary': parseInt(String(value)) < parseInt(String(pasoActivo)), 
                                          'bg-blue-100 text-blue-600 border-blue-600': parseInt(String(value)) === parseInt(String(pasoActivo)),
                                          'border-surface-200 dark:border-surface-700 text-surface-400': parseInt(String(value)) > parseInt(String(pasoActivo)) 
                                      }
                                  ]"
                              >
                                  <!-- Icono de check para pasos completados -->
                                  <svg v-if="parseInt(String(value)) < parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                  </svg>
                                  <!-- Icono de lista para paso actual -->
                                  <svg v-else-if="parseInt(String(value)) === parseInt(String(pasoActivo))" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5" aria-hidden="true">
                                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                  </svg>
                                  <!-- Número para pasos futuros -->
                                  <span v-else class="text-sm font-medium">3</span>
                              </span>
                          </button>
                          <p class="w-max font-medium hidden lg:inline" :class="{ 'text-primary': parseInt(String(value)) <= parseInt(String(pasoActivo)), 'text-surface-500': parseInt(String(value)) > parseInt(String(pasoActivo)) }">
                              Pago
                          </p>
                      </div>
                  </Step>
              </StepList>

              <StepPanels>
                <StepPanel value="0" active v-slot="{ activateCallback }">
                  <div v-if="captureFirstStepCallback(activateCallback)"></div>
                  <div class="mb-4">
                      <label for="nombre_representante" class="text-sm italic text-gray-600">Tipo de persona</label>
                      <Select v-model="tipo_persona" :options="['Natural', 'Juridica']"  class="w-full" />
                  </div>
                  <div v-if="tipo_persona" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-if="tipo_persona === 'Juridica'">
                      <label for="nit" class="text-sm italic text-gray-600">Nit *</label>
                      <input v-model="dataCrearCliente.nit" id="nit" type="text" class="p-2 border rounded-md w-full">
                    </div>
                    <div v-if="tipo_persona === 'Juridica'">
                      <label for="nombre_empresa" class="text-sm italic text-gray-600">Nombre de la empresa *</label>
                      <input v-model="dataCrearCliente.nombre_empresa" id="nombre_empresa" type="text" class="p-2 border rounded-md w-full">
                    </div>
                    <div v-if="tipo_persona === 'Natural'">
                      <label for="tipo_id_representante" class="text-sm italic text-gray-600">Tipo de documento *</label>
                      <div class="flex gap-1">
                        <Select v-model="dataCrearCliente.tipo_id_representante" :options="idsTypes" optionLabel="name" optionValue="id" class="w-full" />
                      </div>
                    </div>
                    <div v-if="tipo_persona === 'Natural'">
                      <label for="numero_doc_representante" class="text-sm italic text-gray-600">Número de documento *</label>
                      <input v-model="dataCrearCliente.numero_doc_representante" id="numero_doc_representante" type="text" class="p-2 border rounded-md w-full">
                    </div> 
                    <div>
                      <label for="nombre_representante" class="text-sm italic text-gray-600" v-if="tipo_persona === 'Natural'">Nombres y apellidos *</label>
                      <label for="nombre_representante" class="text-sm italic text-gray-600" v-else>Nombre del representante legal *</label>
                      <input v-model="dataCrearCliente.nombre_representante" id="nombre_representante" type="text" class="p-2 border rounded-md w-full">
                    </div>
                    <div>
                      <label for="telefono" class="text-sm italic text-gray-600">Teléfono *</label>
                      <input v-model="dataCrearCliente.telefono" id="telefono" type="text" class="p-2 border rounded-md w-full">
                    </div>
                    <div>
                      <label for="email" class="text-sm italic text-gray-600">Correo electrónico *</label>
                      <input v-model="dataCrearCliente.email" id="email" type="email" class="p-2 border rounded-md w-full">
                    </div>
                    <div>
                      <label for="usuario" class="text-sm italic text-gray-600">Nombre de usuario *</label>
                      <input v-if="tipo_persona === 'Juridica'" v-model="dataCrearCliente.nit" :disabled="true" id="usuario" type="text" class="p-2 border rounded-md w-full">
                      <input v-else v-model="dataCrearCliente.numero_doc_representante" :disabled="true" id="usuario" type="text" class="p-2 border rounded-md w-full">
                    </div>
                    <div>
                      <label for="contrasena" class="text-sm italic text-gray-600">Contraseña *</label>
                      <Password class="w-full" input-class="w-full" :feedback="false" v-model="dataCrearCliente.contrasena" toggleMask />
                    </div>
                    <div>
                      <label for="contrasena" class="text-sm italic text-gray-600">Confirmar contraseña *</label>
                      <Password class="w-full" input-class="w-full" :feedback="false" v-model="dataCrearCliente.contrasena_confirm" toggleMask />
                      <span v-if="dataCrearCliente.contrasena_confirm !== dataCrearCliente.contrasena" class="text-xs text-red-600 italic">Las contraseñas deben coincidir</span>
                    </div>
                  </div>
                <div class="mt-4 flex justify-between">
                  <button @click="back" class="px-6 py-3 min-h-[44px] bg-gray-700 text-white font-bold rounded-md hover:bg-gray-800 transition-colors" aria-label="Regresar a la página de cotización">Regresar</button>
                  <button :disabled="!validateCompleteData()" :class="validateCompleteData() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'" @click="activateCallback('1'), pasoActivo= 1" class="px-6 py-3 min-h-[44px] text-white font-bold rounded-md transition-colors" aria-label="Continuar al paso de alojamientos">Continuar</button>
                </div>
                </StepPanel>

                <StepPanel value="1" v-slot="{ activateCallback }">
                  <DataTable class="text-sm" :value="hotelesDetalle">
                    <Column field="nombre" header="Alojamiento">
                      <template #body="{data}">
                          <div class="w-60">
                            <p class="font-medium">{{ data.nombre }}</p>
                            <p class="text-sm italic text-gray-600">Capacidad máxima: <span class="font-medium">{{ data.capacidad_maxima }}</span></p>
                            <p class="text-sm italic text-gray-600">Número de habitaciones: <span class="font-medium">{{ data.numero_habitaciones }}</span></p>
                          </div>
                      </template>
                    </Column>
                    <Column field="name" header="Ciudad del alojamiento">
                      <template #body="{data}">
                          <div class="w-60">
                            <AutoComplete v-model="data.ciudad" option-label="name" class="w-full" input-class="w-full" :suggestions="ciudadesBuscadas" @complete="buscarUbicaciones" />
                          </div>
                      </template>
                    </Column>
                    <Column field="name" header="Dirección del alojamiento">
                      <template #body="{data}">
                          <div class="w-60">
                            <input v-model="data.direccion" type="text" class="p-2 rounded-md border w-full">
                          </div>
                      </template>
                    </Column>
                    <Column field="name" header="Tipo de alojamiento">
                      <template #body="{data}">
                          <div>
                            <Select v-model="data.tipo_alojamiento" :options="tipos_alojamiento" class="w-full md:w-56" />
                          </div>
                      </template>
                    </Column>
                    <Column field="name" header="Amenidades">
                      <template #body="{data}">
                          <div>
                            <MultiSelect v-model="data.amenidades" :options="amenidades" filter placeholder="" :maxSelectedLabels="3" class="w-full md:w-80" />
                          </div>
                      </template>
                    </Column>
                </DataTable>

                <!-- Campos Adicionales Dinámicos -->
                <div v-if="plan?.campos_adicionales?.secciones?.length" class="mt-6">
                  <div class="mb-4">
                    <h3 class="text-xl font-bold text-blue-800 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                      </svg>
                      Información Adicional del Plan
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">Complete la siguiente información requerida para este plan</p>
                  </div>
                  <CamposAdicionales
                    :campos-adicionales="plan.campos_adicionales"
                    @update:datos="handleCamposAdicionalesDatos"
                    @update:valid="handleCamposAdicionalesValid"
                  />
                </div>

                <div class="mt-4 flex justify-between">
                  <button @click="activateCallback('0'), pasoActivo= 0" class="px-6 py-3 min-h-[44px] bg-gray-700 text-white font-bold rounded-md hover:bg-gray-800 transition-colors" aria-label="Regresar a información del cliente">Regresar</button>
                  <button @click="activateCallback('2'), pasoActivo= 2" :disabled="!validateCompleteTable()" :class="validateCompleteTable() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'" class="px-6 py-3 min-h-[44px] text-white font-bold rounded-md transition-colors" aria-label="Continuar al paso de pago">Continuar</button>
                </div>
                </StepPanel>

                <StepPanel value="2" v-slot="{ activateCallback }">
                  <div>
                  <div>
                    <p class="mb-4 font-bold text-lg">Resumen del pago</p>
                    <p>Fecha suscripción: <span class="font-medium">{{ dayjs().format('YYYY-MM-DD') + ' - ' +  dayjs().add(1, 'year').format('YYYY-MM-DD')}}</span></p>
                    <p>Número de alojamientos: <span class="font-medium">{{ hoteles.length }}</span></p>
                    <p>Plan seleccionado: <span class="font-medium">{{ plan?.nombre ?? '' }}</span></p>
                  </div>
                  <div class="p-4 bg-blue-50 border-2 border-blue-400 rounded-lg mt-4 shadow-md" v-if="prueba_gratuita">
                    <div class="flex items-start gap-3">
                      <div class="flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7 text-blue-600">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                        </svg>
                      </div>
                      <div class="flex-1">
                        <p class="text-blue-800 font-bold text-lg mb-2">¡Felicidades! Has aceptado una Prueba Gratuita</p>
                        <p class="text-blue-700 mb-2">
                          Tendrás acceso completo al plan <span class="font-semibold">{{ plan?.nombre }}</span> por <span class="font-bold">1 mes completamente gratis</span>
                        </p>
                        <div class="bg-white rounded-md p-2 border border-blue-200 mb-2">
                          <p class="text-blue-600 text-sm">
                            <span class="font-semibold">Vigencia de prueba gratuita:</span> Desde {{ dayjs().format('DD/MM/YYYY') }} hasta {{ dayjs().add(1, 'month').format('DD/MM/YYYY') }}
                          </p>
                        </div>
                        <div class="bg-blue-100 rounded-md p-2 border border-blue-300">
                          <p class="text-blue-700 text-sm">
                            <span class="font-semibold">✨ ¿Qué sigue después?</span> Al finalizar tu mes gratuito, continuarás disfrutando del servicio con el pago de la anualidad por <span class="font-bold">{{ formatPriceNoDecimal(plan?.precio ?? 0) }}</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="p-4 bg-green-100 border-2 border-green-600 rounded-md mt-4" v-if="cuponDescuento.validado && !prueba_gratuita">
                    <p class="text-green-800 font-medium">¡Felicidades! tienes un descuento de <span class="font-bold">{{ formatPrice(cuponDescuento.valor) }}</span> con tu código {{ dataCrearCliente.codigo_descuento }}</p>
                  </div>
                  <div class="flex" v-else-if="!prueba_gratuita">
                    <div class="shadow-sm p-2 rounded-md my-4 flex items-center gap-1 lg:gap-2 border w-10/12">
                      <div aria-hidden="true">
                        <CouponIcon />
                      </div>
                      <label for="codigo_descuento" class="sr-only">Código de descuento</label>
                      <input placeholder="¿Tienes un cupón de descuento?" v-model="dataCrearCliente.codigo_descuento" id="codigo_descuento" type="text" class="p-2 rounded-md w-full border-0 focus:outline-none" aria-label="Código de descuento">
                    </div>
                    <div class="w-2/12 pl-2 lg:pl-4 py-4">
                      <button @click="validarCuponDescuento" class="px-4 py-3 min-h-[44px] rounded bg-green-600 hover:bg-green-700 text-white font-medium h-full flex gap-2 w-full justify-center items-center transition-colors" aria-label="Aplicar cupón de descuento">
                        <div class="w-5 h-5" aria-hidden="true">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                          </svg>
                        </div>
                        <p class="hidden lg:flex">Aplicar</p>
                      </button>
                    </div>
                  </div>

                  <div v-if="!prueba_gratuita" class="w-full text-end mt-12">
                    <p class="font-bold my-2 text-gray-800">Total a pagar: {{ formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                    <p class="font-bold my-2" :class="cuponDescuento.validado ? 'text-green-700' : 'text-gray-800'">Descuentos: {{ cuponDescuento.validado ? formatPrice(cuponDescuento.valor) : 0 }}</p>
                    <p class="font-bold my-2 text-gray-900 text-xl">Total: {{ cuponDescuento.validado ? formatPrice(cuponDescuento.valor_pagar_descuento) : formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                  </div>
                  <!-- <div v-else class="w-full text-center mt-12 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border-2 border-orange-300">
                    <p class="text-orange-800 font-bold text-xl mb-1">¡Sin costo por ahora! 🎉</p>
                    <p class="text-orange-600 text-sm">Tu prueba gratuita comienza hoy sin ningún cargo</p>
                  </div> -->

                  <div class="mt-8 flex items-start gap-2">
                    <input
                      v-model="aceptaPoliticas"
                      id="politicas-privacidad"
                      type="checkbox"
                      class="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <label for="politicas-privacidad" class="text-sm text-gray-700 cursor-pointer">
                      Acepto las
                      <a
                        href="https://www.segurucolombia.com/politica-privacidad.html"
                        target="_blank"
                        class="text-blue-600 underline hover:text-blue-800"
                      >
                        políticas de privacidad
                      </a>
                    </label>
                  </div>

                  <div class="mt-4 flex items-start gap-2">
                    <input
                      v-model="aceptaUsoDatos"
                      id="uso-datos"
                      type="checkbox"
                      class="mt-1 w-4 h-4 cursor-pointer"
                    />
                    <label for="uso-datos" class="text-sm text-gray-700 cursor-pointer">
                      Acepto la
                      <a
                        @click.prevent="showDataUsageModal = true"
                        href="#"
                        class="text-blue-600 underline hover:text-blue-800 cursor-pointer"
                      >
                        autorización para el uso de datos personales
                      </a>
                    </label>
                  </div>
                </div>
                <div class="mt-4 flex justify-between">
                  <button @click="activateCallback('1'), pasoActivo= 1" class="px-6 py-3 min-h-[44px] bg-gray-700 text-white font-bold rounded-md hover:bg-gray-800 transition-colors" aria-label="Regresar a alojamientos">Regresar</button>
                  <button
                    @click="crearPreventa"
                    :disabled="!aceptaPoliticas || !aceptaUsoDatos"
                    :class="(aceptaPoliticas && aceptaUsoDatos) ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'"
                    class="px-6 py-3 min-h-[44px] text-white font-bold rounded-md flex gap-2 items-center transition-colors"
                    :aria-label="prueba_gratuita ? 'Iniciar prueba gratuita' : 'Proceder al pago'"
                  >
                    <svg v-if="!prueba_gratuita" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                    </svg>
                    {{ prueba_gratuita ? 'Iniciar Prueba Gratuita' : 'Pagar' }}
                  </button>
                </div>
                </StepPanel>
              </StepPanels>
            </Stepper>
          </div>
        </div>
        <ProcesandoPago :is-loading="procesandoPago" />

        <Dialog v-model:visible="showDataUsageModal" modal :style="{ width: '50rem' }" :breakpoints="{ '960px': '75vw', '640px': '90vw' }">
          <template #header>
            <p class="text-lg font-bold text-blue-800">Autorización para el Uso de Datos Personales</p>
          </template>
          <div class="w-full max-h-96 overflow-y-auto px-2">
            <p class="text-sm text-gray-700 mb-4">
              Autorizo expresamente a <strong>GRUPO IGO COLOMBIA SAS</strong> (NIT. 901.383.133-2) y <strong>AMÉRICA INSURANCE BROKER LTDA</strong> (NIT. 900.360.430-2), operando bajo la marca comercial <strong>SEGURU</strong>, para:
            </p>

            <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
              <li>Realizar la evaluación de la solicitud de seguro y el análisis del estado del riesgo.</li>
              <li>Validar y verificar mi identidad para la vinculación, así como el ofrecimiento y otorgamiento de productos y servicios.</li>
              <li>Dar cumplimiento a las obligaciones contraídas con el titular de información en relación al contrato de seguro que se celebre y a las obligaciones legales que se deriven o sean accesorias a este.</li>
              <li>Remitir a las autoridades competentes, incluyendo las fiscales y a los reguladores financieros, nacionales o extranjeros, la información relacionada con la titularidad de los productos y servicios contratados o que llegare a contratar, datos de contacto, movimientos y saldos, y toda aquella información que sea solicitada por normas nacionales o extranjeras.</li>
              <li>Prevención y/o detección del fraude o cualquier tipo de delito, lo que incluye consultar y/o verificar la información personal que se encuentre publicada en redes sociales y/o internet.</li>
              <li>Consultar, corroborar, obtener información personal adicional y actualizar datos personales con la información que reposa en las bases de datos administrados por operadores de la información, bases de datos públicas u otras bases externas, con el propósito de dar cumplimiento a las instrucciones impartidas por la Superintendencia Financiera sobre prevención del riesgo de lavado de activos, la financiación del terrorismo y la proliferación de armas de destrucción masiva.</li>
              <li>Consultar, solicitar, suministrar, reportar, procesar y divulgar información que se refiera al comportamiento crediticio, financiero, comercial y civil, a las Centrales de Información u operadores de información como DATACREDITO y CIFIN, con el objeto de evaluar la solicitud de seguro y el cumplimiento de las obligaciones financieras, comerciales y/o crediticias.</li>
              <li>Con fines de seguridad y/o de prueba ante una autoridad judicial o administrativa, cuando los datos sean obtenidos a través de grabaciones o suministrados por el Titular para el ingreso o permanencia en las instalaciones.</li>
              <li>Fines estadísticos, de consulta, gremiales y técnico-actuariales.</li>
              <li>Fines tributarios, incluido el envío de información a autoridades tributarias de otros países, tal como la de posibles sujetos de tributación en los Estados Unidos al Internal Revenue Service (IRS) y/o a la Dirección de Impuestos y Aduanas Nacionales de Colombia (DIAN), en los términos del Foreign Account Tax Compliance Act (FATCA) o las normas que lo modifiquen y las reglamentaciones aplicables.</li>
            </ul>

            <p class="text-sm text-gray-700 mt-4">
              Con ocasión de lo anterior, autorizo a <strong>GRUPO IGO COLOMBIA SAS</strong> y <strong>AMÉRICA INSURANCE BROKER LTDA</strong> (SEGURU) para que compartan la información referida anteriormente, que consideren pertinente y/o necesaria con aseguradoras aliadas, intermediarios, reaseguradores, coaseguradores, operadores y prestadores de servicio y otros terceros con quienes tengan una relación contractual para la ejecución de las actividades descritas.
            </p>
          </div>
          <template #footer>
            <Button label="Cerrar" @click="showDataUsageModal = false" severity="secondary" />
          </template>
        </Dialog>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { formatPrice, formatPriceNoDecimal } from '../../shared/priceFormat';
import type { TPlanesCotizados } from '../cotizadorView/index.vue';
import type { TCustomerCreate } from '../../types/customers';
import dayjs from 'dayjs';
import { Select, DataTable, Column, MultiSelect, AutoComplete, Stepper, StepPanel, StepPanels, StepList, Step, Divider, Dialog, Button } from 'primevue';
import type { THoteles, THotelesDetalle } from '../../types/planes';
import { PreVentaService } from '../../services/pre-venta.service';
import Swal from 'sweetalert2';
import { CuponesService } from '../../services/cupones.service';
import Toast from 'primevue/toast';
import { useToast } from "primevue/usetoast";
import { UbicacionesService, type TLocationsColombiaAttributes } from '../../services/ubicaciones';
import { nextTick } from 'vue'
import {Password} from 'primevue';
import { TransactionService } from '../../services/transactions';
import { defineAsyncComponent } from 'vue';
import { transformarCamposAdicionalesBackend } from '../../utils/transformCamposAdicionales';
import { PlanesService } from '../../services/planes.service';

// Lazy loading de componentes pesados
const ProcesandoPago = defineAsyncComponent(() => import('./components/pago-proceso.vue'));
const LoadingSpinner = defineAsyncComponent(() => import('../../utils/LoadingSpinner.vue'));
const PreviewModalPdf = defineAsyncComponent(() => import('../previewModalPdf.vue'));
const CouponIcon = defineAsyncComponent(() => import('../icons/CouponIcon.vue'));
const CamposAdicionales = defineAsyncComponent(() => import('./components/CamposAdicionales.vue'));

// Servicios
const _PreVentaService = new PreVentaService()
const _CuponesService = new CuponesService()
const _UbicacionesService = new UbicacionesService()
const _TransactionService = new TransactionService()

// Utils
const toast = useToast();

// Referencias
const plan = ref<TPlanesCotizados>()
const hoteles = ref<THoteles[]>([])
const isLoading = ref(false)
const showDetail = ref(false)
const tipo_persona = ref('')
const prueba_gratuita = ref(false)
const firstStepCallback = ref<Function | null>(null)
const cuponDescuento = ref({
  validado: false,
  codigo: '',
  asesor_id: '',
  valor: 0,
  valor_pagar_descuento: 0
})

const amenidades = ref([
  'Piscinas',
  'Bares',
  'Restaurantes',
  'Gimnasios',
  'Sauna',
  'Turco',
  'Parqueaderos',
  'Ninguna'
])

const tipos_alojamiento = ref([
  'Albergues o Hostales',
  'Airbnb (tipo de alojamiento residencial en apartamentos o casas)',
  'Posadas o Pensión',
  'Casas Rurales o Fincas',
  'Campings o Glampings',
  'Hotel'
])

const dataCrearCliente = ref<TCustomerCreate>({
  contrasena: '',
  contrasena_confirm: '',
  email: '',
  nombre_empresa: '',
  nit: '',
  tipo_id_representante: '',
  numero_doc_representante: '',
  nombre_representante: '',
  telefono: '',
  usuario: '',
  codigo_descuento: '',
})

const procesandoPago = ref(false)

const pasoActivo = ref(0)

const idsTypes = ref([
  {
    name: 'Cédula de Ciudadanía',
    id: 'CC'
  },
  {
    name: 'Cédula de Extranjería',
    id: 'CE'
  },
  {
    name: 'Pasaporte',
    id: 'PP'
  },
  {
    name: 'Tarjeta de Identidad',
    id: 'TI'
  },
  {
    name: 'Documento Nacional de Identidad',
    id: 'DNI'
  },
  {
    name: 'Carteira de Identidade / Registro Geral',
    id: 'RG'
  },
  {
    name: 'Otro',
    id: 'OTHER'
  },
])

const ciudadesBuscadas = ref<TLocationsColombiaAttributes[]>([])
const hotelesDetalle = ref<THotelesDetalle[]>([])
const aceptaPoliticas = ref(false)
const aceptaUsoDatos = ref(false)
const showDataUsageModal = ref(false)
const camposAdicionalesDatos = ref<import('../../types/planes').CamposAdicionalesCapturados | null>(null)
const camposAdicionalesValidos = ref(true)

const validateCompleteData = () => {
  let validarByTipoPersona = false
  if (tipo_persona.value === 'Natural') {
    if (
      !dataCrearCliente.value.numero_doc_representante ||
      !dataCrearCliente.value.tipo_id_representante
    ) {
      validarByTipoPersona = false
    } else {
      validarByTipoPersona = true
    }
  }
  if (tipo_persona.value === 'Juridica') {
    if (
      !dataCrearCliente.value.nit ||
      !dataCrearCliente.value.nombre_empresa
    ) {
      validarByTipoPersona = false
    } else {
      validarByTipoPersona = true
    }
  }
  const isValid = !!dataCrearCliente.value.contrasena &&
    !!dataCrearCliente.value.email &&
    !!dataCrearCliente.value.nombre_representante &&
    !!dataCrearCliente.value.telefono &&
    dataCrearCliente.value.contrasena === dataCrearCliente.value.contrasena_confirm &&
    validarByTipoPersona
  return isValid
}

const validateCompleteTable = () => {
  const hotelesValidos = hotelesDetalle.value.every(a =>
    a.amenidades.length > 0 &&
    a.tipo_alojamiento &&
    typeof a.ciudad !== 'string' &&
    a.direccion
  )

  // Si el plan tiene campos adicionales, también validarlos
  const tieneCamposAdicionales = plan.value?.campos_adicionales?.secciones &&
                                  plan.value.campos_adicionales.secciones.length > 0

  if (tieneCamposAdicionales) {
    return hotelesValidos && camposAdicionalesValidos.value
  }

  return hotelesValidos
}

const handleCamposAdicionalesDatos = (datos: import('../../types/planes').CamposAdicionalesCapturados) => {
  camposAdicionalesDatos.value = datos
}

const handleCamposAdicionalesValid = (valid: boolean) => {
  camposAdicionalesValidos.value = valid
}

// Resto de métodos (sin cambios)
const crearPreventa = async () => {
  if ((plan.value?.precio ?? 0) === 0) return
  if ((!plan.value?.id)) return
  if (!hoteles.value.length) return
  const valorPagar = cuponDescuento.value.validado ? Number(cuponDescuento.value.valor_pagar_descuento) : plan.value?.precio ?? 0
  console.log('plan.value?.alojamientos', plan.value?.alojamientos)
  try {
    isLoading.value = true

    const {data: {hash, id_transaction}} = await _PreVentaService.crearPreVenta({
      contrasena: dataCrearCliente.value.contrasena,
      numero_documento_representante: dataCrearCliente.value.numero_doc_representante || dataCrearCliente.value.nit,
      tipo_documento_representante: dataCrearCliente.value.tipo_id_representante || 'NIT',
      email: dataCrearCliente.value.email,
      fecha_fin: dayjs().add(1, 'year').toDate(),
      fecha_inicio: dayjs().toDate(),
      nit: dataCrearCliente.value.nit,
      nombre_empresa: dataCrearCliente.value.nombre_empresa,
      nombre_representante: dataCrearCliente.value.nombre_representante,
      precio: valorPagar,
      telefono: dataCrearCliente.value.telefono,
      usuario: dataCrearCliente.value.nit || dataCrearCliente.value.numero_doc_representante,
      numero_alojamientos: hoteles.value.length || 1,
      codigo_descuento: cuponDescuento.value.validado ? cuponDescuento.value.codigo : undefined,
      numero_meses: 12,
      advisor_id: cuponDescuento.value.validado ? cuponDescuento.value.asesor_id : undefined,
      version_plan_id: plan.value.version_id,
      prueba_gratuita: prueba_gratuita.value,
      datos_adicionales: camposAdicionalesDatos.value && plan.value?.campos_adicionales?.secciones?.length ? camposAdicionalesDatos.value : undefined,
      detalle_alojamientos: hotelesDetalle.value.map(hotel => {
        return {
          ciudad: typeof hotel.ciudad === 'object' && hotel.ciudad !== null ? hotel.ciudad.name : hotel.ciudad,
          direccion: hotel.direccion,
          nombre_alojamiento: hotel.nombre,
          tipo_alojamiento: hotel.tipo_alojamiento,
          amenidades: hotel.amenidades.join(','),
          capacidad_maxima: hotel.capacidad_maxima,
          numero_habitaciones: hotel.numero_habitaciones,
          capacidad_id: plan.value?.alojamientos.find(hot => hot.capacidad_maxima === hotel.capacidad_maxima)?.capacidad_id || ''
        }
      })
    })
    isLoading.value = false
    localStorage.setItem('transaccionProcesoId', id_transaction)
    if (!prueba_gratuita.value) {
      sendWompi(id_transaction, hash, id_transaction)
    } else {
      // Redirigir a la vista de prueba gratuita aprobada
      window.location.href = '/prueba-gratuita-aprobada'
    }
  } catch (error: any) {
    isLoading.value = false
    procesandoPago.value = false
    console.error('Error al procesar la venta:', error)
    const errorMessage = error?.response?.data?.message || error?.message || "Ocurrio un error, por favor intenta mas tarde"
    Swal.fire({
      title: "Error",
      text: errorMessage,
      icon: "error"
    });
  }
}
const validarCuponDescuento = async () => {
  if (!dataCrearCliente.value.codigo_descuento) return
  isLoading.value = true
  const {data} = await _CuponesService.buscar({nombre: dataCrearCliente.value.codigo_descuento})
  isLoading.value = false
  if (data && data.estado) {
    cuponDescuento.value = {
      asesor_id: data.asesor_id || '',
      codigo: data.nombre,
      validado: true,
      valor: data.valor,
      valor_pagar_descuento: Number(plan.value?.precio) > data.valor ? Number(plan.value?.precio) - data.valor : 0
    }
  } else {
    dataCrearCliente.value.codigo_descuento = ''
    toast.add({ severity: 'warn', summary: 'Cupón invalido', detail: 'No se encontro cupón de descuento', life: 3000 });
    cuponDescuento.value = {
      validado: false,
      codigo: '',
      asesor_id: '',
      valor: 0,
      valor_pagar_descuento: 0
    }
  }
}
const sendWompi = (reference: string, signature: string, transaccionProcesoId:string) => {
  if ((plan.value?.precio ?? 0) === 0) return
  procesandoPago.value = true
  const valorPagar = cuponDescuento.value.validado ? Number(cuponDescuento.value.valor_pagar_descuento) : plan.value?.precio ?? 0
  const createHiddenInput = (name: any, value: any) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = name;
    input.value = value;
    return input;
  }

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
  form.appendChild(createHiddenInput('customer-data:email', dataCrearCliente.value.email));
  form.appendChild(createHiddenInput('customer-data:full-name', dataCrearCliente.value.nombre_representante));
  form.appendChild(createHiddenInput('customer-data:phone-number', dataCrearCliente.value.telefono));
  form.appendChild(createHiddenInput('customer-data:legal-id', dataCrearCliente.value.tipo_id_representante));
  form.appendChild(createHiddenInput('customer-data:legal-id-type', dataCrearCliente.value.numero_doc_representante));
  
  document.body.appendChild(form);
  form.submit();
  consultarTransaccion(transaccionProcesoId)
}
const back = () => {
  window.location.assign("/cotizacion");
}
const setDataHoteles = () => {
  hoteles.value = JSON.parse(localStorage.getItem('bodyCotizacion') || '[]');
  if (hoteles.value) {
    hoteles.value.map(h => {
      hotelesDetalle.value.push({
        amenidades: [],
        capacidad_maxima: h.capacidad_maxima,
        expanded: false,
        nombre: h.nombre,
        numero_habitaciones: h.numero_habitaciones,
        tipo_alojamiento: '',
        ciudad: '',
        direccion: '',
        id: h.id
      })
    })
  }
}
const buscarUbicaciones = async (event: any) => {
  const {data} = await _UbicacionesService.buscarUbicacionesColombia({name: event.query})
  ciudadesBuscadas.value = data
}
const onStepChange = (newStep:number) => {
  pasoActivo.value = newStep
}
const activateFirstStep = () => {
  if (firstStepCallback.value) {
    firstStepCallback.value('0')
  }
  pasoActivo.value = 0
}
const captureFirstStepCallback = (callback: Function) => {
  firstStepCallback.value = callback
  return null // No renderizar nada
}
const canGoToStep = (targetStep: number): boolean => {
  const currentStep = pasoActivo.value
  
  // Siempre permitir retroceder
  if (targetStep <= currentStep) {
    return true
  }
  
  // Validar paso por paso hacia adelante
  for (let step = currentStep; step < targetStep; step++) {
    if (step === 0 && !validateCompleteData()) {
      toast.add({ 
        severity: 'warn', 
        summary: 'Información incompleta', 
        detail: 'Complete todos los campos del paso 1 antes de continuar', 
        life: 3000 
      });
      onStepChange(0)
      activateFirstStep()
      return false
    }
    
    if (step === 1 && !validateCompleteTable()) {
      toast.add({ 
        severity: 'warn', 
        summary: 'Información incompleta', 
        detail: 'Complete toda la información de alojamientos antes de continuar', 
        life: 3000 
      });
      return false
    }
  }
  
  return true
}
const handleStepClick = (activateCallback: Function, targetStepValue: string, event?: Event) => {
  const targetStep = parseInt(targetStepValue)
  
  if (canGoToStep(targetStep)) {
    activateCallback(targetStepValue)
    pasoActivo.value = targetStep
  } else {
    // Prevenir la navegación si no pasa la validación
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
  }
}
const consultarTransaccion = async (transaccionIdProceso:string) => {
  // const transaccionIdProceso = localStorage.getItem('transaccionProcesoId')
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

const refrescarPlanSeleccionado = async () => {
  if (!plan.value?.id) return;

  try {
    const { data } = await PlanesService.findById(plan.value.id);
    const camposApi = data?.version?.campos_adicionales;
    if (camposApi) {
      plan.value.campos_adicionales = camposApi as any;
    }
  } catch (error) {
    console.warn('No se pudo refrescar el plan seleccionado. Se usa el cache local.', error);
  }
}


onMounted(async () => {
  prueba_gratuita.value = localStorage.getItem('prueba_gratuita') === 'true'
  
  const cupon = localStorage.getItem('cupon_activo_codigo')
  if (cupon) {
    dataCrearCliente.value.codigo_descuento = cupon
    validarCuponDescuento()
  }
  
  const planSeleccionado = localStorage.getItem('planSeleccionado'); 
  setDataHoteles()
  if (planSeleccionado) {
    const parsedPlan = JSON.parse(planSeleccionado);
    const camposAdicionalesNormalizados = transformarCamposAdicionalesBackend(parsedPlan.campos_adicionales);
    plan.value = {
      id: parsedPlan.id || '',
      version_id: parsedPlan.version_id || '',
      nombre: parsedPlan.nombre || '',
      precio: parsedPlan.precio || 0,
      coberturas: parsedPlan.coberturas || [],
      documento_id: parsedPlan.documento_id || '',
      alojamientos: parsedPlan.alojamientos,
      campos_adicionales: camposAdicionalesNormalizados
    };
    await refrescarPlanSeleccionado();
  } else {
    plan.value = { id: '', nombre: '', precio: 0, coberturas: [], version_id: '', alojamientos: [] };
  }
  onStepChange(0)
  await nextTick()
  activateFirstStep()
  const transaccionIdProceso = localStorage.getItem('transaccionProcesoId')
  if (transaccionIdProceso) {
    consultarTransaccion(transaccionIdProceso)
  }

})
</script>
<style>
.blue-steps .p-steps-item.p-highlight .p-steps-number {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

.blue-steps .p-steps-item.p-highlight .p-steps-title {
  color: #2563eb !important;
}

.blue-steps .p-steps-item.p-highlight .p-menuitem-link {
  border-color: #2563eb !important;
}

/* Screen reader only - para accesibilidad */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
