import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

/**
 * Preset de PrimeVue con la paleta SEGURU (ver tailwind.config.mjs):
 * índigo de marca #3232B3 como primario y grises con tinte lavanda.
 */
const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#EEEEFB",
      100: "#DEDEF7",
      200: "#C0C0F0",
      300: "#9A9AE5",
      400: "#6E6ED6",
      500: "#3232B3",
      600: "#28289A",
      700: "#1E1E78",
      800: "#141450",
      900: "#0B0B24",
      950: "#06061A",
    },
    focusRing: {
      width: "3px",
      style: "solid",
      color: "#FD8701",
      offset: "2px",
    },
    formField: {
      borderRadius: "12px",
    },
    colorScheme: {
      light: {
        surface: {
          0: "#FFFFFF",
          50: "#F4F4FB",
          100: "#ECECFA",
          200: "#DCDCF0",
          300: "#C4C4DE",
          400: "#8E8EAE",
          500: "#6B6B8E",
          600: "#58587A",
          700: "#3E3E62",
          800: "#26264A",
          900: "#16163A",
          950: "#0E0E28",
        },
        primary: {
          color: "#3232B3",
          contrastColor: "#FFFFFF",
          hoverColor: "#28289A",
          activeColor: "#1E1E78",
        },
        formField: {
          borderColor: "#DCDCF0",
          hoverBorderColor: "#9A9AE5",
          color: "#16163A",
          placeholderColor: "#8E8EAE",
        },
        text: {
          color: "#16163A",
          mutedColor: "#58587A",
        },
      },
    },
  },
  components: {
    rating: {
      colorScheme: {
        light: {
          root: {
            iconColor: "#FD8701",
            iconActiveColor: "#FD8701",
            iconHoverColor: "#FD8701",
          },
        },
      },
    },
    button: {
      root: {
        borderRadius: "14px",
      },
    },
    card: {
      root: {
        borderRadius: "16px",
      },
    },
    dialog: {
      root: {
        borderRadius: "22px",
      },
    },
  },
});

export default customPreset;
