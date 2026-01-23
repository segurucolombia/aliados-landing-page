<template>
    <div class="w-full p-2 flex justify-center background-about">
        <div class="w-full lg:w-10/12">
            <div class="w-full mb-8 text-center">
                <div class="w-full flex justify-center">
                    <img class="w-12 lg:w-28 justify-self-center" src="/img/logo-about-seguru.png" alt="">
                </div>
                <p class="text-2xl lg:text-6xl text-blue-800 font-medium">¿Por qué comprar con nosotros?</p>
            </div>
            <div class="w-full lg:flex items-center">
                <div class="w-full lg:w-6/12 hidden lg:flex justify-center">
                    <div class="container-image-about bg-blue-600 overflow-hidden items-center justify-center border border-blue-600 border-4">
                        <img class="object-cover" src="img/about1.jpg" alt="">
                    </div>
                </div>
                <div class="w-full lg:w-6/12 px-4 lg:px-0 mx-auto">
                    <div class="mt-4 w-full text-center bg-gray-300 p-4 lg:p-12 rounded-lg lg:rounded-full text-gray-600">
                        
                        <div class="space-y-2 sm:space-y-3">
                            <div class="flex items-start md:items-center justify-center text-center max-w-sm mx-auto sm:max-w-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(30 64 175)" class="w-4 h-4 mt-1 md:mt-0 mr-1.5 sm:mr-2 flex-shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="text-sm sm:text-base">Evita sanciones mayores a $75 millones y protege tu negocio de demandas.</p>
                            </div>
                            
                            <div class="flex items-start md:items-center justify-center text-center max-w-sm mx-auto sm:max-w-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(30 64 175)" class="w-4 h-4 mt-1 md:mt-0 mr-1.5 sm:mr-2 flex-shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="text-sm sm:text-base">Ahorra tiempo con procesos 100% automáticos.</p>
                            </div>
                            
                            <div class="flex items-start md:items-center justify-center text-center max-w-sm mx-auto sm:max-w-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(30 64 175)" class="w-4 h-4 mt-1 md:mt-0 mr-1.5 sm:mr-2 flex-shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="text-sm sm:text-base">Soporte legal y gastos de defensa jurídica incluidos.</p>
                            </div>
                            
                            <div class="flex items-start md:items-center justify-center text-center max-w-sm mx-auto sm:max-w-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(30 64 175)" class="w-4 h-4 mt-1 md:mt-0 mr-1.5 sm:mr-2 flex-shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="text-sm sm:text-base">Garantía "Cumplimos por ti o pagamos".</p>
                            </div>
                            
                            <div class="flex items-start md:items-center justify-center text-center max-w-sm mx-auto sm:max-w-none">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="rgb(30 64 175)" class="w-4 h-4 mt-1 md:mt-0 mr-1.5 sm:mr-2 flex-shrink-0">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <p class="text-sm sm:text-base">
                                    <span class="font-bold">Garantía de compra:</span> devolución total en 10 días si no te gusta nuestro servicio.
                                </p>
                            </div>
                        </div>
                        
                        <p class="text-sm lg:text-lg font-medium mt-6">
                            <span class="italic">Fácil de usar: Interfaz amigable, rápida y accesible desde cualquier dispositivo. Ideal para hoteles de cualquier tamaño.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useTranslations } from '../i18n/utils';
const {t} = useTranslations();
</script>

<style>
.container-image-about {
    width: 30rem;
    height: 30rem;
    border-radius: 20em 20rem 20em 0em;
}

@media only screen and (min-width: 600px) {
    .background-about {
        /* background: url("/public/iconos/abo"); */
        background-repeat: no-repeat;
        background-position: right;
        
    }
}
.color-image-background-about {
    filter: invert(50%) sepia(100%) saturate(500%) hue-rotate(200deg);
    /* filter: grayscale(100%); */
}
</style>