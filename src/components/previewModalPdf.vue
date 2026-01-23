<template>
    <Button 
        icon="pi pi-eye" 
        @click="manejarClick" 
        class="w-auto" 
        severity="info" 
        :label="props.nombre_boton" 
        text 
        rounded 
        aria-label="Ver PDF"
        :loading="cargando"
    />
    
    <Dialog 
        v-model:visible="visible" 
        modal 
        header="Vista previa del PDF" 
        :style="{ width: '95vw', maxWidth: '1200px' }"
        :breakpoints="{ '960px': '95vw', '640px': '100vw' }"
        :draggable="false"
        :resizable="false"
        class="pdf-dialog"
    >
        <template #header>
            <div class="flex justify-content-between align-items-center w-full">
                <span>Vista previa del PDF</span>
                <div class="flex gap-2">
                    <Button 
                        icon="pi pi-download" 
                        @click="descargarPdf" 
                        severity="secondary" 
                        text 
                        rounded 
                        aria-label="Descargar PDF"
                        :disabled="!pdfBlobUrl"
                    />
                </div>
            </div>
        </template>

        <div v-if="cargando" class="flex justify-content-center align-items-center" style="height: 400px;">
            <div class="flex flex-column align-items-center gap-3">
                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                <span>Cargando PDF...</span>
            </div>
        </div>

        <div v-else-if="error" class="flex justify-content-center align-items-center" style="height: 400px;">
            <div class="flex flex-column align-items-center gap-3 text-center">
                <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
                <span class="text-red-500">Error al cargar el PDF</span>
                <Button 
                    label="Reintentar" 
                    @click="reintentarCarga" 
                    severity="secondary" 
                    outlined
                />
            </div>
        </div>

        <div v-else-if="pdfBlobUrl" class="pdf-container">
            <!-- Siempre mostrar el iframe, pero con detección mejorada -->
            <div class="pdf-viewer">
                <iframe
                    :src="pdfUrl"
                    width="100%"
                    :height="alturaIframe"
                    style="border: none; border-radius: 6px;"
                    title="Vista previa del PDF"
                    @load="onIframeLoad"
                    @error="onIframeError"
                ></iframe>
                
                <!-- Fallback para móvil si el iframe no carga -->
                <div v-if="iframeError" class="iframe-fallback p-4 border-round bg-yellow-50 mt-3">
                    <div class="flex align-items-center gap-2 mb-3">
                        <i class="pi pi-exclamation-triangle text-yellow-600"></i>
                        <span class="font-semibold text-yellow-800">No se pudo cargar la vista previa</span>
                    </div>
                    
                    <p class="text-sm text-yellow-700 mb-3">
                        Tu navegador no puede mostrar el PDF directamente. Usa una de las siguientes opciones:
                    </p>
                    
                    <div class="flex flex-column gap-2">
                        <Button 
                            label="Abrir PDF en nueva pestaña" 
                            icon="pi pi-external-link" 
                            @click="abrirEnNuevaPestana"
                            class="w-full"
                            severity="primary"
                        />
                        
                        <Button 
                            label="Descargar PDF" 
                            icon="pi pi-download" 
                            @click="descargarPdf"
                            class="w-full"
                            severity="secondary"
                            outlined
                        />
                    </div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<script setup lang="ts">
import { ref, onUnmounted, computed } from "vue"
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import { AwsService } from "../services/aws";

const props = defineProps<{
  id: string;
  nombre_boton: string;
}>()

const visible = ref(false)
const pdfBlobUrl = ref<string | null>(null)
const cargando = ref(false)
const error = ref(false)
const iframeError = ref(false)

const awsService = new AwsService()

// URL del PDF con parámetros para mejor compatibilidad
const pdfUrl = computed(() => {
    if (!pdfBlobUrl.value) return undefined
    
    const navegador = detectarNavegador()
    
    if (navegador.isSafari || navegador.isIOS) {
        // Safari - sin parámetros adicionales para evitar problemas
        return pdfBlobUrl.value
    } else if (navegador.isMobile) {
        // Otros móviles - parámetros optimizados
        return `${pdfBlobUrl.value}#toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-width`
    } else {
        // Escritorio - parámetros completos
        return `${pdfBlobUrl.value}#toolbar=1&navpanes=1&scrollbar=1`
    }
})

// Altura dinámica del iframe
const alturaIframe = computed(() => {
    if (typeof window !== 'undefined') {
        const alturaVentana = window.innerHeight
        const isMobile = window.innerWidth <= 768
        return isMobile ? '400px' : Math.max(500, alturaVentana - 200) + 'px'
    }
    return '600px'
})

const detectarNavegador = () => {
    const userAgent = navigator.userAgent.toLowerCase()
    return {
        isMobile: /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent),
        isSafari: /safari/i.test(userAgent) && !/chrome/i.test(userAgent),
        isIOS: /iphone|ipad|ipod/i.test(userAgent),
        isChrome: /chrome/i.test(userAgent)
    }
}

async function manejarClick() {
    const navegador = detectarNavegador()
    
    if (navegador.isMobile) {
        if (navegador.isSafari || navegador.isIOS) {
            // Safari iOS - comportamiento especial
            await manejarSafariIOS()
        } else {
            // Otros navegadores móviles
            await cargarPdf()
            if (pdfBlobUrl.value) {
                abrirEnNuevaPestana()
            }
        }
    } else {
        // En escritorio o si ya está cargado, mostrar modal
        await abrirPdf()
    }
}

async function manejarSafariIOS() {
    try {
        cargando.value = true
        
        // En Safari iOS, descargar directamente en lugar de usar blob URL
        const response = await awsService.descargarPdfBlob(props.id)
        
        if (!response.data || response.data.size === 0) {
            throw new Error('PDF vacío o corrupto')
        }
        
        // Crear blob URL
        const blob = new Blob([response.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(blob)
        
        // En Safari iOS, usar un enfoque diferente
        const enlace = document.createElement('a')
        enlace.href = url
        enlace.target = '_blank'
        enlace.rel = 'noopener noreferrer'
        
        // Agregar al DOM temporalmente para Safari
        document.body.appendChild(enlace)
        enlace.click()
        document.body.removeChild(enlace)
        
        // Limpiar después de un delay
        setTimeout(() => {
            URL.revokeObjectURL(url)
        }, 1000)
        
    } catch (err) {
        console.error('Error en Safari iOS:', err)
        // Fallback: mostrar modal con opciones
        await abrirPdf()
    } finally {
        cargando.value = false
    }
}


async function cargarPdf() {
    if (pdfBlobUrl.value) return

    cargando.value = true
    error.value = false

    try {
        const response = await awsService.descargarPdfBlob(props.id)
        
        if (!response.data || response.data.size === 0) {
            throw new Error('PDF vacío o corrupto')
        }
        
        const blob = new Blob([response.data], { type: 'application/pdf' })
        pdfBlobUrl.value = URL.createObjectURL(blob)
        
    } catch (err) {
        console.error('Error al cargar PDF:', err)
        error.value = true
        throw err
    } finally {
        cargando.value = false
    }
}

async function abrirPdf() {
    if (!pdfBlobUrl.value) {
        await cargarPdf()
    }
    
    if (pdfBlobUrl.value) {
        visible.value = true
        iframeError.value = false
    }
}

async function reintentarCarga() {
    if (pdfBlobUrl.value) {
        URL.revokeObjectURL(pdfBlobUrl.value)
        pdfBlobUrl.value = null
    }
    await abrirPdf()
}

function abrirEnNuevaPestana() {
    if (pdfBlobUrl.value) {
        const navegador = detectarNavegador()
        
        if (navegador.isSafari || navegador.isIOS) {
            // Safari iOS - método especial
            const enlace = document.createElement('a')
            enlace.href = pdfBlobUrl.value
            enlace.target = '_blank'
            enlace.rel = 'noopener noreferrer'
            
            // Agregar al DOM temporalmente
            document.body.appendChild(enlace)
            enlace.click()
            document.body.removeChild(enlace)
        } else {
            // Otros navegadores
            window.open(pdfBlobUrl.value, '_blank')
        }
    }
}

function descargarPdf() {
    if (pdfBlobUrl.value) {
        const navegador = detectarNavegador()
        const enlace = document.createElement('a')
        enlace.href = pdfBlobUrl.value
        enlace.download = `documento-${props.id}.pdf`
        
        if (navegador.isSafari || navegador.isIOS) {
            // Safari iOS - método especial
            enlace.target = '_blank'
            enlace.rel = 'noopener noreferrer'
        }
        
        document.body.appendChild(enlace)
        enlace.click()
        document.body.removeChild(enlace)
    }
}

function onIframeLoad() {
    // El iframe cargó correctamente
    iframeError.value = false
}

function onIframeError() {
    // El iframe falló al cargar
    iframeError.value = true
}


onUnmounted(() => {
    if (pdfBlobUrl.value) {
        // En Safari, dar más tiempo antes de limpiar
        const navegador = detectarNavegador()
        if (navegador.isSafari || navegador.isIOS) {
            setTimeout(() => {
                URL.revokeObjectURL(pdfBlobUrl.value!)
            }, 2000)
        } else {
            URL.revokeObjectURL(pdfBlobUrl.value)
        }
    }
})

defineExpose({ abrirPdf, manejarClick })
</script>

<style scoped>
.pdf-dialog :deep(.p-dialog-content) {
    padding: 1rem;
}

.pdf-container {
    width: 100%;
}

.pdf-viewer {
    width: 100%;
    min-height: 400px;
}

.iframe-fallback {
    border: 1px solid #f59e0b;
    background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
}

/* Responsive */
@media (max-width: 768px) {
    .pdf-dialog :deep(.p-dialog) {
        margin: 0.5rem;
        max-height: 95vh;
        overflow-y: auto;
    }
    
    .pdf-dialog :deep(.p-dialog-header) {
        padding: 1rem;
        flex-wrap: wrap;
    }
    
    .pdf-dialog :deep(.p-dialog-content) {
        padding: 0.5rem 1rem 1rem;
        max-height: calc(95vh - 120px);
        overflow-y: auto;
    }
    
    .pdf-viewer {
        min-height: 300px;
    }
}
</style>