🧩 Proyecto: Desarollo Movies v3

Este proyecto está estructurado como un monorepo utilizando Turborepo, e integra una aplicación principal en Next.js 16 con soporte para TypeScript, TailwindCSS v4 y shadcn/ui.
Está pensado para escalar fácilmente con múltiples apps y librerías compartidas.

📁 Estructura del Proyecto
my-turborepo/
│
├── apps/                       # Aplicaciones principales
│   ├── web/                    # App web principal (Next.js 16 + Tailwind + shadcn)
│   │   ├── src/
│   │   │   ├── app/            # Rutas, layout y páginas del App Router
│   │   │   └── lib/            # Utilidades internas (utils.ts, etc.)
│   │   ├── public/             # Archivos estáticos (íconos, imágenes, etc.)
│   │   ├── components.json     # Configuración de shadcn/ui
│   │   ├── postcss.config.mjs  # Configuración de PostCSS
│   │   ├── tailwind.config.ts  # Configuración de TailwindCSS
│   │   ├── next.config.ts      # Configuración de Next.js
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── docs/                   # App de documentación (por defecto en Turborepo)
│
├── packages/                   # Librerías compartidas
│   ├── eslint-config/          # Reglas ESLint compartidas
│   ├── typescript-config/      # Configuración TypeScript compartida
│   └── ui/                     # Componentes UI reutilizables (si se agregan)
│
├── .env.example                # Variables de entorno de ejemplo
├── .env.local                  # Variables locales (no subidas al repo)
├── pnpm-lock.yaml              # Lockfile del gestor de paquetes PNPM
├── turbo.json                  # Configuración del Turborepo
└── package.json

⚙️ Tecnologías principales
Herramienta / Framework	Versión	Propósito
Turborepo	2.5.8	Monorepo manager
Next.js	16.0.0	Framework React para la app web
React	19.x	Librería base de la UI
TailwindCSS	4.1.16	Estilos utilitarios
shadcn/ui (canary)	—	Componentes UI accesibles y tipados
TypeScript	5.9.x	Tipado estático
PNPM	—	Gestor de dependencias
ESLint + Prettier	—	Linting y formato del código
🚀 Scripts principales

Desde la raíz del proyecto:

# Instalar dependencias
pnpm install

# Correr todas las apps en modo desarrollo
pnpm run dev

# Compilar todas las apps
pnpm run build

# Linter global
pnpm run lint


Para correr solo la app web:

cd apps/web
pnpm run dev




# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
