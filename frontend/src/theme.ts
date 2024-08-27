// src/theme.ts
import { extendTheme } from "@chakra-ui/react";

const starWarsTheme = extendTheme({
  colors: {
    brand: {
      100: "#edf2f7", // Light gray for backgrounds
      200: "#e2e8f0", // Lighter gray for hover states
      300: "#cbd5e0", // Gray for borders
      400: "#a0aec0", // Mid gray for secondary text
      500: "#718096", // Dark gray for primary text
      600: "#4a5568", // Darker gray for headings
      700: "#2d3748", // Very dark gray for backgrounds
      800: "#1a202c", // Almost black for main background
      900: "#171923", // Black for text on light backgrounds
    },
    accent: {
      blue: "#0ff0fc", // Lightsaber blue
      red: "#ff0000", // Lightsaber red
      green: "#4fef1e", // Lightsaber green
      yellow: "#ffe81f", // Star Wars logo yellow
    },
  },
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
});

export default starWarsTheme;