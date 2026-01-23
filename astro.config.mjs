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
    },
  },
  // adapter: staticAdapter(),
});