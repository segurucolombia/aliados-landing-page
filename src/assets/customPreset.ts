import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";
const customPreset = definePreset(Aura, {
  components: {
    rating: {
      colorScheme: {
        light: {
          root: {
            iconColor: "{yellow.500}",
            iconActiveColor: "{yellow.500}",
            iconHoverColor: "{yellow.500}",
          },
        },
      
      },
      
    },
    
  }

},);

export default customPreset;
