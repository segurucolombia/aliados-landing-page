<template>
  <div class="min-h-screen bg-gray-50 overflow-x-hidden">
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-primary-700 to-primary-900 text-white pt-10 pb-24 lg:pt-16 lg:pb-44">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <nav class="mb-4 lg:mb-6">
            <ol class="flex items-center justify-center gap-2 text-xs lg:text-sm text-blue-200">
              <li><a href="/" class="hover:text-white transition-colors">Inicio</a></li>
              <li><span>/</span></li>
              <li class="text-white font-semibold">Contacto</li>
            </ol>
          </nav>
          <h1 class="text-4xl md:text-5xl font-bold mb-3 lg:mb-4">Contacto</h1>
          <p class="text-base lg:text-xl text-blue-100 max-w-md mx-auto">
            Estamos aquí para ayudarte. Elige el canal que prefieras.
          </p>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="#F9FAFB"/>
        </svg>
      </div>
    </section>

    <section class="py-8 lg:py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-5xl mx-auto grid lg:grid-cols-2 gap-6 lg:gap-8">
          <!-- Canales rápidos -->
          <div class="space-y-4">
            <!-- WhatsApp destacado -->
            <a
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="block bg-white hover:bg-green-50 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-all border-2 border-[#25D366]"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.51 5.26l-.999 3.648 3.978-1.607zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.71.307 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-[10px] lg:text-xs uppercase tracking-wide text-[#25D366] font-semibold">Respuesta inmediata</p>
                  <p class="text-base lg:text-lg font-bold text-gray-900">Escríbenos por WhatsApp</p>
                  <p class="text-xs lg:text-sm text-gray-500">+57 315 460 3134</p>
                </div>
                <svg class="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </a>

            <!-- Teléfono -->
            <a
              href="tel:+573154603134"
              class="block bg-white hover:bg-gray-50 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-primary-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs lg:text-sm text-gray-500">Línea de atención</p>
                  <p class="text-base lg:text-xl font-bold text-gray-900">+57 315 460 3134</p>
                  <p class="text-xs lg:text-sm text-gray-500">Lun a Vie 8:00 a.m. – 6:00 p.m.</p>
                </div>
              </div>
            </a>

            <!-- Correo -->
            <a
              href="mailto:contacto@segurucolombia.com"
              class="block bg-white hover:bg-gray-50 rounded-2xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-all border border-gray-200"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs lg:text-sm text-gray-500">Correo electrónico</p>
                  <p class="text-sm lg:text-xl font-bold text-gray-900 break-all">contacto@segurucolombia.com</p>
                  <p class="text-xs lg:text-sm text-gray-500">Te responderemos en menos de 24 horas</p>
                </div>
              </div>
            </a>

            <!-- Ubicación -->
            <div class="bg-white rounded-2xl p-5 lg:p-6 shadow-sm border border-gray-200">
              <div class="flex items-start gap-3 lg:gap-4">
                <div class="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <svg class="w-6 h-6 lg:w-7 lg:h-7 text-primary-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs lg:text-sm text-gray-500">Oficina</p>
                  <p class="text-base lg:text-lg font-bold text-gray-900">Bogotá, Colombia</p>
                  <p class="text-xs lg:text-sm text-gray-500">Atención presencial con cita previa</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario -->
          <div class="bg-white rounded-2xl shadow-md p-6 lg:p-8 border border-gray-100">
            <h2 class="text-2xl font-bold text-gray-900 mb-2">Envíanos un mensaje</h2>
            <p class="text-gray-600 mb-6">Cuéntanos qué necesitas y te contactaremos.</p>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label for="nombre" class="block text-sm font-semibold text-gray-700 mb-1">Nombre completo <span class="text-red-500">*</span></label>
                <input
                  id="nombre"
                  v-model="formData.nombre"
                  type="text"
                  required
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ej: Ana Pérez"
                />
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-sm font-semibold text-gray-700 mb-1">Correo <span class="text-red-500">*</span></label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    required
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label for="telefono" class="block text-sm font-semibold text-gray-700 mb-1">Teléfono</label>
                  <input
                    id="telefono"
                    v-model="formData.telefono"
                    type="tel"
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="3001234567"
                  />
                </div>
              </div>

              <div>
                <label for="asunto" class="block text-sm font-semibold text-gray-700 mb-1">Asunto</label>
                <select
                  id="asunto"
                  v-model="formData.asunto"
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
                >
                  <option value="cotizacion">Cotización de un seguro</option>
                  <option value="soporte">Soporte de un plan existente</option>
                  <option value="aliados">Programa de aliados</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label for="mensaje" class="block text-sm font-semibold text-gray-700 mb-1">Mensaje <span class="text-red-500">*</span></label>
                <textarea
                  id="mensaje"
                  v-model="formData.mensaje"
                  rows="4"
                  required
                  class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Cuéntanos cómo podemos ayudarte..."
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="enviando"
                class="w-full bg-primary-700 hover:bg-primary-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <svg v-if="enviando" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" class="opacity-25"></circle>
                  <path fill="currentColor" class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ enviando ? 'Enviando...' : 'Enviar mensaje' }}
              </button>

              <p class="text-xs text-gray-500 text-center">
                Al enviar aceptas nuestras
                <a href="https://www.segurucolombia.com/politica-privacidad.html" target="_blank" class="text-primary-600 hover:underline">políticas de privacidad</a>.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ContactosService } from '../services/contactos.service';

const phone = '573154603134';
const enviando = ref(false);

const formData = reactive({
  nombre: '',
  email: '',
  telefono: '',
  asunto: 'cotizacion',
  mensaje: '',
});

const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent('Hola, me gustaría más información sobre los seguros de Seguru.')}`;

const resetForm = () => {
  formData.nombre = '';
  formData.email = '';
  formData.telefono = '';
  formData.asunto = 'cotizacion';
  formData.mensaje = '';
};

const handleSubmit = async () => {
  enviando.value = true;
  const Swal = (await import('sweetalert2')).default;

  try {
    await ContactosService.enviar({
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono || undefined,
      asunto: formData.asunto,
      mensaje: formData.mensaje,
    });

    await Swal.fire({
      title: '¡Mensaje enviado!',
      text: 'Te contactaremos en menos de 24 horas.',
      icon: 'success',
      confirmButtonColor: '#1e40af',
    });

    resetForm();
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      'No pudimos enviar tu mensaje. Por favor inténtalo nuevamente o escríbenos por WhatsApp.';

    await Swal.fire({
      title: 'Error al enviar',
      text: errorMessage,
      icon: 'error',
      confirmButtonColor: '#1e40af',
    });
  } finally {
    enviando.value = false;
  }
};
</script>
