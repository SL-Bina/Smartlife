# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

SmartLife is a property/building management SPA built with React 18, Vite, Tailwind CSS, and Material Tailwind 2.x. The app serves two distinct user types with separate route sets:
- **Admin/Manager dashboard** (`/dashboard/*`) — building management, finance, notifications, KPI, permissions, etc.
- **Resident portal** (`/resident/*`) — personal properties, invoices, tickets, e-documents, notifications.

The backend API is at `http://api.smartlife.az/api/v1`. Auth uses cookie-based JWT tokens (`smartlife_token`).

## Build & Dev Commands

- `npm run dev` — Start Vite dev server on port 3157
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Preview production build
- `npm install --legacy-peer-deps` — Install dependencies (legacy peer deps required)

There is no test runner or linter configured in `package.json`. The `tests/` directory exists but is empty.

## Architecture

### Path Alias

`@/` maps to `src/` (configured in both `vite.config.js` and `jsconfig.json`).

### Routing

Routes are defined as a data structure in `src/routes.jsx` — an array of route groups with `layout` and `pages`. Admin routes use `layout: "dashboard"`, resident routes use `layout: "resident"`. Each page entry has an `icon`, `name` (i18n key), `path`, `element`, and optional `moduleName`/`moduleId` for permission gating. Some pages have `children` for submenu groups.

`src/App.jsx` renders top-level `<Routes>` mapping `/dashboard/*`, `/resident/*`, and `/auth/*` to layout components. The shared `Dashboard` layout (`src/layouts/dashboard.jsx`) detects `currentLayout` from the URL path, filters routes by layout, and wraps each in `ProtectedRoute` which enforces auth, role, and module-based access. If a resident user hits `/dashboard/*`, they are redirected to `/resident`, and vice versa.

### State Management

Redux Toolkit store in `src/store/index.js` with slices:
- `auth` — user session, login/logout, `is_resident` flag, module permissions
- `ui` — sidebar, navbar, dark mode, configurator state
- `mtk`, `complex`, `building`, `block`, `property`, `resident` — entity CRUD slices for management modules

Use `useAppDispatch` / `useAppSelector` from `src/store/hooks.js`. The `useAuth()` hook (`src/store/hooks/useAuth.js`) provides `login`, `logout`, `hasModuleAccess(moduleName)`, and `hasPermission(moduleName, permission)`.

`ReduxInitializer` component in `src/components/ReduxInitializer.jsx` bootstraps auth initialization and dark mode on app load.

### API Layer

Two HTTP clients exist in `src/services/`:
- `api.js` — main axios instance with hardcoded base URL, auth interceptor reading `smartlife_token` cookie, and `authAPI` object for login/logout/me/permissions.
- `http.js` — secondary axios instance using `VITE_API_BASE_URL` env var.

Each page module has its own `api/index.js` that imports the shared client and defines domain-specific methods (e.g., `mtkAPI.getAll()`, `myPropertiesAPI.getById(id)`).

### Management Modules Pattern

Management pages (`src/pages/dashboard/management/`) follow a consistent structure documented in `docs/MANAGEMENT_ARCHITECTURE.md`:

```
management/<module>/
├── api/index.js         — API calls (getAll, getById, create, update, delete)
├── hooks/               — useXList, useXDetail, useXForm
├── components/          — FilterBar, Table, Header, modals/
└── index.jsx            — Route entry point
```

Entity hierarchy: `MTK → Complex → Building → Block → Property → Resident`. Filters cascade downward (changing MTK resets complex/building/block). Relationship data uses `sub_data` as the source of truth, with fallback to direct fields and embedded objects.

### Resident Pages

Resident pages (`src/pages/resident/`) are simpler — each has an `api/` folder, a `components/` folder, and an `index.jsx` entry point. They consume the `resident` API endpoints (`/module/resident/config/*`).

### Internationalization

i18next with three locales: Azerbaijani (`az`, default/fallback), English (`en`), Russian (`ru`). Translation files are in `src/i18n/locales/`. All user-facing strings should use `t("key")` with an Azerbaijani fallback string: `t("some.key") || "Azərbaycanca fallback"`.

### UI Framework

- Material Tailwind 2.x components (Dialog, Button, Typography, etc.) — wrapped with `withMT()` in `tailwind.config.cjs`
- Heroicons for icons (`@heroicons/react/24/solid` and `/24/outline`)
- Dark mode via Tailwind `dark:` classes, toggled by `dark` class on `<html>` element
- Framer Motion for animations

### Permissions & Access Control

Routes can specify `moduleName` and `moduleId` for module-based access, or `allowedRoles` for role-based restrictions. The `root` role bypasses all permission checks. Module access is checked via `user.role_access_modules` (preferred) or `user.modules` (fallback). Resident users (`user.is_resident === true`) are restricted to `/resident/*` routes; non-resident users are restricted to `/dashboard/*` routes. Module/role permission checks only apply to dashboard routes — resident routes have no module gating.

### Deployment

Genezio deployment configured in `genezio.yaml` — deploys the `dist/` folder to `us-east-1`.
