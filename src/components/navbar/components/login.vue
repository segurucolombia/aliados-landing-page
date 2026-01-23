<template>
    <Toast />
    <div>
        <a href="https://reservas.segurucolombia.com/login" target="_blank">
        <button  class="py-3 px-4 rounded-full border text-blue-600 border-2 border-blue-800 hover:bg-blue-600 hover:text-white font-medium">
            <p>
                {{ t('nav.login') }}
            </p>
        </button>
        </a>
        <Dialog v-model:visible="showLogin" :closable="false" modal :style="{ width: '30rem', margin: '1rem' }">
            <template #header>
                <div class="w-full text-center">
                    <div class="w-full flex justify-center">
                        <img class="w-12 justify-self-center" src="/img/logo-about-seguru.png" alt="">
                    </div>
                    <p class="font-bold text-lg">{{ t('nav.login') }}</p>
                </div>
            </template>
            <template #default>
                <div class="w-full grid-grid-cols-1 gap-2">
                    <div class="w-full">
                        <label for="user" class="italic text-sm text-gray-600">{{ t('login.user') }}</label>
                        <input class="border p-2 rounded-md w-full" v-model="userParams.user" type="text" id="user">
                    </div>
                    <div class="w-full">
                        <label for="user" class="italic text-sm text-gray-600">{{ t('login.password') }}</label>
                        <input class="border p-2 rounded-md w-full" v-model="userParams.password" type="text" id="user">
                    </div>
                </div>
                <div class="w-full text-center flex gap-4 justify-center my-4 text-sm text-blue-600">
                    <button class="text-sm text-blue-600">Olvide mi contraseña</button>
                    |
                    <button class="text-sm text-blue-600">Quiero afiliarme</button>
                </div>
                <div class="w-full grid grid-cols-1 lg:grid-cols-2 my-4 gap-2">
                    <div>
                        <button @click="closeLogin" class="w-full p-2 bg-gray-200 text-gray-600 rounded-md">Cancelar</button>
                    </div>
                    <div>
                        <button class="w-full p-2 bg-green-800 text-white rounded-md" @click="login">Ingresar</button>
                    </div>
                </div>
            </template>
        </Dialog>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { useTranslations } from '../../../i18n/utils';
import Toast from 'primevue/toast';
import { Dialog, useToast } from 'primevue';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';
import type { TError } from '../../../types/shared';
import useLogin from '../../../composables/login';

const _AuthService = new AuthService()

const toast = useToast();

const {initSesion, loggedUser} = useLogin()

const {t} = useTranslations();
const showLogin = ref(false)
const userParams = ref({
    user: '',
    password: ''
})
const closeLogin = () => {
    clearData()
    showLogin.value = false
}
const login = async () => {
    try {
        const  {data} = await _AuthService.login(userParams.value)
        localStorage.setItem('userName', data.user.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('userType', data.user.rol_id)
        localStorage.setItem('personName', data.user.person.name)
        loggedUser.value = data.user.person.name
        toast.add({ severity: 'success', summary: 'Sesión iniciada correctamente', detail: `Bienvenido de nuevo ${data.user.name}`, life: 3000 });
        closeLogin()
        initSesion(data.user.name)
        window.location.assign("/plataforma/planes/listado");
        // @ts-ignore
    } catch (error:TError) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response?.data?.message ||'Ocurrio al iniciar sesión, intenta de nuevo mas tarde',
        });
    }
}
const clearData = () => {
    userParams.value = {
    user: '',
    password: ''
}
}

</script>
<style>
.swal2-container {
  z-index: 999999;
}
</style>