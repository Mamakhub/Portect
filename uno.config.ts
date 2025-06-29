import { defineConfig, presetUno, presetWebFonts, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'Fira Code',
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    colors: {
      'primary': {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
      'tenang-accent': '#84e4a8',
      'tenang-primary': '#017359',
      'tenang-primary-dark': '#BED9D2',
      'tenang': {
        50: '#f0f9f6',
        100: '#dcf2eb',
        200: '#bce7d9',
        300: '#8dd4c2',
        400: '#56bca6',
        500: '#017359',
        600: '#015a47',
        700: '#014739',
        800: '#013a2f',
        900: '#003025',
        950: '#001a15',
      },
      'tenang-light': {
        50: '#f8fdfb',
        100: '#f0faf7',
        200: '#e0f5ed',
        300: '#c7ede0',
        400: '#a5e0cc',
        500: '#BED9D2',
        600: '#a8c9c0',
        700: '#8db3a8',
        800: '#72908a',
        900: '#5d7570',
        950: '#2f3b38',
      },
    },
  },
})
