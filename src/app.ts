import { type App } from "vue";
import Primevue from "primevue/config";
import CustomPreset from "./assets/customPreset";
import ToastService from "primevue/toastservice";

// import '/node_modules/primevue/resources/themes/aura/theme.css';
// import '/node_modules/primevue/resources/primevue.min.css';
// import '/node_modules/primeicons/primeicons.css';

export default (app: App) => { 
  app.use(Primevue, {
    theme: {
      preset: CustomPreset,
      options: {
        darkModeSelector: "light",
      },
    },
  });
  app.use(ToastService);
};