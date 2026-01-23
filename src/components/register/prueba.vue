<template>
                <Steps 
            class="blue-steps"
              v-model:activeStep="pasoActivo"
              :model="pasosPagar"
            />
            <div class="" v-if="pasoActivo === 0">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label for="nombre_representante" class="text-sm italic text-gray-600">Nombre del representante legal *</label>
                  <input v-model="dataCrearCliente.nombre_representante" id="nombre_representante" type="text" class="p-2 border rounded-md w-full">
                </div>
                <div>
                  <label for="tipo_id_representante" class="text-sm italic text-gray-600">Tipo de documento *</label>
                  <div class="flex gap-1">
                    <Select v-model="dataCrearCliente.tipo_id_representante" :options="idsTypes" optionLabel="name" optionValue="id" class="w-full" />
                  </div>
                </div>
                <div>
                  <label for="numero_doc_representante" class="text-sm italic text-gray-600">Número de documento *</label>
                  <input v-model="dataCrearCliente.numero_doc_representante" id="numero_doc_representante" type="text" class="p-2 border rounded-md w-full">
                </div>
                <div>
                  <label for="nombre_empresa" class="text-sm italic text-gray-600">Nombre de la empresa *</label>
                  <input v-model="dataCrearCliente.nombre_empresa" id="nombre_empresa" type="text" class="p-2 border rounded-md w-full">
                </div>
                <div>
                  <label for="nit" class="text-sm italic text-gray-600">Nit *</label>
                  <input v-model="dataCrearCliente.nit" id="nit" type="text" class="p-2 border rounded-md w-full">
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
                  <input v-model="dataCrearCliente.nit" :disabled="true" id="usuario" type="text" class="p-2 border rounded-md w-full">
                </div>
                <div>
                  <label for="contrasena" class="text-sm italic text-gray-600">Contraseña *</label>
                  <input v-model="dataCrearCliente.contrasena" id="contrasena" type="text" class="p-2 border rounded-md w-full">
                </div>
                <div>
                  <label for="contrasena" class="text-sm italic text-gray-600">Confirmar contraseña *</label>
                  <input v-model="dataCrearCliente.contrasena_confirm" id="contrasena_confirm" type="text" class="p-2 border rounded-md w-full">
                </div>
              </div>
              <div class="mt-4 flex justify-between">
                <button @click="back" class="p-2 bg-gray-600 text-white font-bold rounded-md">Regresar</button>
                <button :disabled="!validateCompleteData()" :class="validateCompleteData() ? 'bg-blue-600' : 'bg-blue-300'" @click="pasoActivo = 1" class="p-2 text-white font-bold rounded-md">Continuar</button>
              </div>
            </div>
            <div class="" v-if="pasoActivo === 1">
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
               <div class="mt-4 flex justify-between">
                <button @click="pasoActivo = 0" class="p-2 bg-gray-600 text-white font-bold rounded-md">Regresar</button>
                <button :disabled="!validateCompleteTable()" :class="validateCompleteTable() ? 'bg-blue-600' : 'bg-blue-300'" @click="pasoActivo = 2" class="p-2 text-white font-bold rounded-md">Continuar</button>
              </div>
            </div>
            <div v-if="pasoActivo === 2">
              <div>
                <div>
                  <p class="mb-4 font-bold text-lg">Resumen del pago</p>
                  <p>Fecha suscripción: <span class="font-medium">{{ dayjs().format('YYYY-MM-DD') + ' - ' +  dayjs().add(1, 'year').format('YYYY-MM-DD')}}</span></p>
                  <p>Número de alojamientos: <span class="font-medium">{{ hoteles.length }}</span></p>
                  <p>Plan seleccionado: <span class="font-medium">{{ plan?.nombre ?? '' }}</span></p>
                </div>
                <div class="p-4 bg-green-200 border rounded-md mt-4" v-if="cuponDescuento.validado">
                  <p class="text-green-600">Felicidades! tienes un descuento de <span class="font-bold">{{ formatPrice(cuponDescuento.valor) }}</span> con tu código {{ dataCrearCliente.codigo_descuento }}</p>
                </div>
                <div class="flex" v-else>
                  <div class="shadow-sm p-2 rounded-md my-4 flex items-center gap-1 lg:gap-2 border w-10/12">
                    <svg viewBox="0 0 200 120" width="60px" height="30px" xmlns="http://www.w3.org/2000/svg">
                      <!-- Fondo redondeado verde claro -->
                      <rect x="10" y="10" width="180" height="100" rx="15" ry="15" fill="#e6ffee" stroke="#d0f0d0" stroke-width="2"/>
                      
                      <!-- Cupón de descuento en verde oscuro -->
                      <g transform="translate(65, 35)">
                        <!-- Contorno del cupón -->
                        <rect x="0" y="0" width="70" height="45" rx="4" ry="4" fill="none" stroke="#155724" stroke-width="5"/>
                        
                        <!-- Muesca izquierda -->
                        <path d="M0,22 C-3,22 -3,16 0,16" fill="none" stroke="#155724" stroke-width="5" stroke-linecap="round"/>
                        
                        <!-- Muesca derecha -->
                        <path d="M70,22 C73,22 73,16 70,16" fill="none" stroke="#155724" stroke-width="5" stroke-linecap="round"/>
                        
                        <!-- Punto izquierdo del símbolo de porcentaje -->
                        <circle cx="25" cy="20" r="4" fill="#155724"/>
                        
                        <!-- Punto derecho del símbolo de porcentaje -->
                        <circle cx="45" cy="30" r="4" fill="#155724"/>
                        
                        <!-- Línea diagonal del símbolo de porcentaje -->
                        <line x1="20" y1="33" x2="48" y2="15" stroke="#155724" stroke-width="4" stroke-linecap="round"/>
                      </g>
                    </svg>
                    <input placeholder="Tienes un cupón de descuento?" v-model="dataCrearCliente.codigo_descuento" id="codigo_descuento" type="text" class="p-2 rounded-md w-full">
                  </div>
                  <div class="w-2/12 pl-2 lg:pl-4 py-4">
                    <button @click="validarCuponDescuento" class="p-2 rounded bg-green-600 text-white font-medium h-full flex gap-2 w-full justify-center items-center">
                      <div class="w-5 h-5">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      </div>
                      <p class="hidden lg:flex">Aplicar</p>
                    </button>
                  </div>
                </div>

                <div class="w-full text-end mt-12">
                  <p class="font-bold my-2 text-gray-600">Total a pagar: {{ formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                  <p class="font-bold my-2" :class="cuponDescuento.validado ? 'text-green-600' : ''">Descuentos: {{ cuponDescuento.validado ? formatPrice(cuponDescuento.valor) : 0 }}</p>
                  <p class="font-bold my-2">Total: {{ cuponDescuento.validado ? formatPrice(cuponDescuento.valor_pagar_descuento) : formatPriceNoDecimal(plan?.precio ?? 0) }}</p>
                </div>
              </div>
              <div class="mt-4 flex justify-between">
                <button @click="pasoActivo = 1" class="p-2 bg-gray-600 text-white font-bold rounded-md">Regresar</button>
                <button @click="crearPreventa" class="p-2 bg-blue-600 text-white font-bold rounded-md flex gap-2 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                  </svg>
                  Pagar
                </button>
              </div>
            </div>
</template>