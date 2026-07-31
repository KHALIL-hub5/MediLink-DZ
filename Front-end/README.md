# MediLink DZ Frontend

Production-oriented React frontend architecture for MediLink DZ.

## Folder Structure

- `src/assets`: static images, icons, and media assets.
- `src/components/ui`: reusable Shadcn/UI-style primitives.
- `src/components/common`: shared cross-feature components.
- `src/components/layout`: application shells such as navbar, sidebar, footer, public layout, and protected layout.
- `src/components/forms`: shared form controls and field wrappers.
- `src/pages`: route-level page folders reserved for future business screens.
- `src/hooks`: reusable React hooks.
- `src/context`: app providers and React contexts.
- `src/services`: domain service modules that orchestrate API calls and client logic.
- `src/api`: Axios client and TanStack Query configuration.
- `src/routes`: React Router setup.
- `src/store`: global client state modules.
- `src/utils`: shared utilities such as class merging and environment validation.
- `src/types`: shared TypeScript types.
- `src/constants`: app-wide constants such as route paths and navigation metadata.
- `src/styles`: TailwindCSS globals and design tokens.

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

Copy `.env.example` to `.env` when environment-specific values are needed.
