// src/theme.ts
import { extendTheme } from "@chakra-ui/react";
import starWarsBackground from './assets/star-wars.webp';
import starShipsBackground from './assets/star-ships.jpg';

const starWarsTheme = extendTheme({
  styles: {
    global: {
      body: {
        bg: "brand.800",
        color: "brand.100",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "accent.yellow",
          color: "brand.900",
          _hover: {
            bg: "accent.blue",
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: "brand.600",
            _hover: {
              borderColor: "accent.blue",
            },
            _focus: {
              borderColor: "accent.blue",
              boxShadow: "0 0 0 1px #0ff0fc",
            },
          },
        },
      },
    },
  },
  colors: {
    brand: {
      100: "#edf2f7",
      200: "#e2e8f0",
      300: "#cbd5e0",
      400: "#a0aec0",
      500: "#718096",
      600: "#4a5568",
      700: "#2d3748",
      800: "#1a202c",
      900: "#171923",
    },
    accent: {
      blue: "#0ff0fc",
      red: "#ff0000",
      green: "#4fef1e",
      yellow: "#ffe81f",
    },
  },
  layerStyles: {
    base: {
      bg: "brand.800",
      color: "brand.100",
    },
    starWarsBackground: {
      bg: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${starWarsBackground})`,
      bgSize: "cover",
      bgPosition: "center",
      bgRepeat: "no-repeat",
    },
    dashboardBackground: {
        bg: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${starShipsBackground})`,
        bgSize: "cover",
        bgPosition: "center",
        bgRepeat: "no-repeat",
      },
  },
});

export default starWarsTheme;