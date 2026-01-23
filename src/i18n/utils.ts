import { ref } from 'vue';
import { ui, defaultLang } from './ui';
export type TLang = 'es' | 'en'

export const lang = ref<TLang>('es')
export function useTranslations() {
  const t = (key: keyof typeof ui[typeof defaultLang]) => {
    return ui[lang.value][key] || ui[defaultLang][key];
  }
  const setLang = (someLang:TLang) => {
    lang.value = someLang
  }
  return {
    t,
    setLang
  }
}