<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-700 to-primary-900 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">

      <div class="bg-gradient-to-br from-primary-600 to-primary-800 px-8 pt-10 pb-8 text-center text-white">
        <div class="relative flex items-center justify-center mb-6 h-24">
          <div class="absolute w-24 h-24 rounded-full bg-white/10"></div>
          <div class="absolute w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h1 class="text-2xl font-bold mb-1">¡Estamos procesando tu pago!</h1>
        <p class="text-blue-100 text-sm">Mercado Pago está cobrando tu plan en este momento</p>
      </div>

      <div class="p-6 space-y-5">
        <p class="text-gray-700 text-sm leading-relaxed">
          El cobro puede tardar unos minutos en confirmarse.
          <span v-if="email">
            Te enviaremos un correo a <span class="font-semibold text-gray-900 break-all">{{ email }}</span> cuando esté listo:
          </span>
          <span v-else>
            Te enviaremos un correo cuando esté listo:
          </span>
        </p>

        <ul class="space-y-3">
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <p class="text-sm text-gray-700">
              <span class="font-semibold text-gray-900">Si el pago es aprobado:</span>
              recibirás los datos de tu plan, cobertura y cómo acceder a la plataforma.
            </p>
          </li>
          <li class="flex items-start gap-3">
            <span class="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mt-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 8v4m0 4h.01" />
              </svg>
            </span>
            <p class="text-sm text-gray-700">
              <span class="font-semibold text-gray-900">Si el pago es rechazado:</span>
              recibirás un enlace para intentar con otra tarjeta.
            </p>
          </li>
        </ul>

        <div class="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
          No es necesario que esperes en esta página. Puedes cerrarla con tranquilidad.
        </div>

        <button
          @click="$emit('volver')"
          class="w-full inline-flex items-center justify-center gap-2 bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm cursor-pointer"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  email?: string | null;
}>();

defineEmits<{
  (e: 'volver'): void;
}>();
</script>
