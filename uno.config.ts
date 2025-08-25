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
      'tenang-accent': '#93c5fd',
      'tenang-primary': '#1e40af',
      'tenang-primary-dark': '#bfdbfe',
      'tenang': {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#1e40af',
        600: '#1d4ed8',
        700: '#1e3a8a',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
      'tenang-light': {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#bfdbfe',
        600: '#64748b',
        700: '#475569',
        800: '#334155',
        900: '#1e293b',
        950: '#0f172a',
      },
    },
  },
})
