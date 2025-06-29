# TenangSite

A modern Nuxt.js frontend application built with Vue 3, TypeScript, and UnoCSS.

## Features

- ⚡ **Fast Performance** - Built with Nuxt.js for optimal performance and SEO
- 🎨 **Modern Design** - Beautiful UI with dark mode support and responsive design
- 🔧 **Developer Friendly** - TypeScript support and excellent developer experience
- 📱 **Responsive** - Mobile-first responsive layout
- 🌙 **Dark Mode** - Automatic dark/light theme switching
- 🎯 **Type Safe** - Full TypeScript support

## Technology Stack

- **Framework**: Nuxt.js 3
- **Language**: Vue 3 + TypeScript
- **Styling**: UnoCSS (Atomic CSS)
- **UI Components**: Headless UI
- **Utilities**: VueUse
- **Date Handling**: Day.js
- **Linting**: ESLint + @antfu/eslint-config

## Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or pnpm

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run generate` - Generate static site
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
TenangSite/
├── app.vue                 # Main app component
├── nuxt.config.ts         # Nuxt configuration
├── uno.config.ts          # UnoCSS configuration
├── tsconfig.json          # TypeScript configuration
├── eslint.config.js       # ESLint configuration
├── package.json           # Dependencies and scripts
├── README.md              # Project documentation
├── .gitignore             # Git ignore rules
├── app/                   # App directory (Nuxt 3)
├── pages/                 # Route pages
│   ├── index.vue          # Home page
│   └── about.vue          # About page
├── components/            # Vue components
│   └── Modal.vue          # Modal component
├── layouts/               # Layout components
│   └── default.vue        # Default layout
├── composables/           # Vue composables
│   └── useCounter.ts      # Counter composable
├── utils/                 # Utility functions
│   └── date.ts            # Date utilities
├── types/                 # TypeScript types
│   └── index.ts           # Common types
├── public/                # Static assets
│   └── favicon.ico        # Favicon
└── assets/                # Source assets
```

## Development

### Adding New Pages

Create new `.vue` files in the `pages/` directory. Nuxt.js will automatically create routes based on the file structure.

### Adding Components

Create reusable components in the `components/` directory. They will be auto-imported throughout your application.

### Styling

This project uses UnoCSS for styling. You can use utility classes directly in your templates or create custom styles in the `uno.config.ts` file.

### TypeScript

The project is fully configured with TypeScript. You can define types in the `types/` directory and they will be available throughout your application.

## Deployment

### Static Site Generation

```bash
npm run generate
```

This will create a `dist/` directory with static files that can be deployed to any static hosting service.

### Server-Side Rendering

```bash
npm run build
npm run preview
```

This will build the application for SSR deployment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
