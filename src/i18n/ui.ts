import { spanish } from "./spanish";
import { english } from "./english";
export const  lenguages = {
 es: 'Spanish',
 en: 'English'
}

export const defaultLang = 'es'

export const ui = {
  es: spanish,
  en: english
} as const;