// @ts-check
import { defineConfig } from 'astro/config';

import vue from '@astrojs/vue';

import tailwind from '@astrojs/tailwind';
import dotenv from 'dotenv';
import node from '@astrojs/node'
// import staticAdapter from '@astrojs/static-site';
// import node from "@astrojs/node";



// https://astro.build/config
dotenv.config();

export default defineConfig({
  devToolbar: {
    enabled: true,
  },
  // output: "server",
  server: {
    port: import.meta.env.PORT,
    host: true,
  },
  output: "server",
  // @ts-ignore
  adapter: node({ mode: "standalone" }),
  integrations: [vue({appEntrypoint: "/src/app.ts"}), tailwind()],
  vite:{
    resolve:{
      alias:{
        '@assets':'/src/assets'
      },
      // Forzar una única copia de Vue en el bundle. Sin esto, cuando Vite
      // descubre en caliente componentes de PrimeVue no pre-optimizados
      // (p. ej. los cargados vía defineAsyncComponent), puede quedar una
      // segunda instancia de Vue y romper resolveComponent ("can only be
      // used in render()" + "Cannot read properties of null (reading 'refs')").
      dedupe: ['vue'],
    },
    // Pre-optimizar los componentes de PrimeVue usados dentro del componente
    // asíncrono CamposAdicionales para evitar el re-optimize + full reload
    // (que provoca el remontaje/duplicado de Vue) al abrir un plan.
    optimizeDeps: {
      include: [
        'vue',
        'primevue/select',
        'primevue/multiselect',
        'primevue/autocomplete',
        'primevue/button',
      ],
    },
  },
  // adapter: staticAdapter(),
});