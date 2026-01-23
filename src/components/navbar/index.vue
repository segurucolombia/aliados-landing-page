<template>
    <div class="w-full p-2 flex justify-center border-b">
        
        <div class="w-10/12 flex justify-between items-center">
            <div>
                <a href="/">
                    <img src="/img/logo-seguru.png" class="w-32" alt="Logo Seguru" width="128" height="auto" loading="eager" decoding="async">
                </a>
            </div>
            <div class="flex">
                <div class="flex items-center">
                    <div class="flex">
                        <Select v-model="selectedLang" dropdownIcon="none" @change="changeLang($event)" :options="langs" optionLabel="name" 
                        :pt="{
                            root: {
                                style: {
                                    'border': 0,
                                    'box-shadow': 'none'
                                }
                            }
                        }"
                        >
                            <template #value="{value}">
                                <div class="flex justify-between items-center">
                                    <p class="w-8 font-medium ">{{ value.value  }}</p>
                                    <img src="/iconos/translation.jpg" class="w-4 h-4" alt="Traducción" width="16" height="16" loading="lazy" decoding="async">
                                </div>
                            </template>
                            <template #option="slotProps">
                                <div class="flex items-center">
                                    <div>{{ slotProps.option.name }}</div>
                                </div>
                            </template>
                            <template #dropdownicon></template>
                        </Select>
                    </div>
                </div>
                <Login v-if="!loggedUser" />
                <div v-else class="h-fill flex items-center">
                    <p class="font-medium">Hola, <span>{{ loggedUser }}</span></p>
                </div>
            </div>
            <!-- <div class="hidden md:flex items-center">
                <div class="p-1 bg-blue-600 text-white close-form flex">
                    <div class="close-form p-3 w-12 h-12 bg-white">
                        <img class="" src="/icons/online-shopping-icons-2024-10-17-21-31-50-utc/svg/013-calling.svg" alt="Icono de teléfono" loading="lazy" decoding="async">
                    </div>
                    <div class="px-2">
                        <p class="text-sm">{{ t('nav.contact') }}</p>
                        <p class="text-lg font-bold">301 2666565</p>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script lang="ts" setup>
import { Select } from 'primevue';
import { onMounted, ref } from 'vue';
import { lenguages } from '../../i18n/ui';
import { useTranslations } from '../../i18n/utils';
import Login from './components/login.vue';
import useLogin from '../../composables/login';
const {t, setLang} = useTranslations();
const {loggedUser} = useLogin()
const userLogged = localStorage.getItem('personName')
type TSelectLang = {
    name: string,
    value: string
}
const langs:TSelectLang[] = []
const selectedLang:TSelectLang = {name: 'Spanish', value: 'es'}

const changeLang = (event:any) => {
    setLang(event.value.value)
}

onMounted(() => {
    for(const [key, value] of Object.entries(lenguages)) {
        langs.push({
            name: value,
            value: key
        })
    }
})

</script>
<style>
.close-form {
    border-radius: 0rem 15rem 15rem 15rem;
}
</style>