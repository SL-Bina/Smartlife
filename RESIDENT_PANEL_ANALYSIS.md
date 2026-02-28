# SmartLife Resident Panel - Comprehensive Analysis

**Project Review Date:** February 28, 2026  
**Version:** 2.1.0  
**Technology Stack:** React 18, Vite, Redux Toolkit, Material Tailwind 2.x, Tailwind CSS, i18next

---

## 📋 Executive Summary

SmartLife is a sophisticated property/building management SPA with **dual-user support**:
- **Admin/Manager Dashboard** (`/dashboard/*`) — Complex building management with module-based access control
- **Resident Portal** (`/resident/*`) — Simplified resident-facing interface for personal property management

The resident panel serves as a focused, user-friendly interface for residents to manage their apartments, view invoices, submit tickets, access documents, and receive notifications.

---

## 🏗️ Architecture Overview

### 1. **Application Entry Point**

**File:** [src/main.jsx](src/main.jsx)

```
DOM Root ↓
BrowserRouter ↓
Redux Store Provider ↓
ThemeProvider (Material Tailwind) ↓
ReduxInitializer (bootstraps auth + dark mode) ↓
App ↓
Routes (/dashboard/*, /resident/*, /auth/*, /)
```

The `ReduxInitializer` component initializes user authentication and applies dark mode on app load.

### 2. **Top-Level Routing**

**File:** [src/App.jsx](src/App.jsx)

```jsx
/ → /dashboard (redirect)
/dashboard/* → Dashboard layout
/resident/* → Dashboard layout (same layout, different routes)
/auth/* → Auth layout
* → 404 NotFound
```

Both `/dashboard/*` and `/resident/*` use the **same `Dashboard` layout component**, which intelligently filters routes based on user type.

---

## 🛣️ Resident Routing System

### Routes Definition

**File:** [src/routes.jsx](src/routes.jsx) (Lines 295-351)

The resident route group contains **8 main pages**:

| Page | Path | Component | Purpose |
|------|------|-----------|---------|
| Dashboard | `/home` | `ResidentHomePage` | Overview stats (properties, invoices, services, tickets) |
| My Invoices | `/invoices` | `ResidentMyInvaoicesPage` | View & manage utility bills |
| My Properties | `/my-properties` | `ResidentMyPropertiesPage` | Select/manage owned properties |
| My Services | `/my-services` | `ResidentMyServicesPage` | View building services |
| Tickets (Applications) | `/tickets` | `ResidentTicketsPage` | Submit & track maintenance requests |
| E-Documents | `/e-documents` | `ResidentEDocumentsPage` | Download official documents |
| Notifications | `/notifications` | `ResidentNotificationsPage` | System notifications & alerts |
| Profile | `/profile` | `ResidentProfilePage` | User profile & settings |

**Key Difference from Admin Routes:** Resident pages have **NO module-based access control**. All authenticated residents can access all resident pages.

---

## 🔐 Authentication & Authorization Flow

### Authentication Architecture

**Auth Cookies:**
```javascript
smartlife_token       // JWT token (7-day expiry)
smartlife_is_resident // Boolean flag to optimize auth initialization
```

**Auth Endpoints:**
```
POST /auth/login              → Set cookies, return user data
GET /auth/me                  → Get admin/manager user
GET /module/resident/me       → Get resident user
POST /auth/logout             → Clear session
GET /auth/permissions         → Get module-based permissions
```

### User Type Detection

**File:** [src/store/slices/authSlice.js](src/store/slices/authSlice.js#L88-L150)

The `initializeUser` thunk determines user type:

```javascript
if (isResidentCookie === 'true') {
  // Call /module/resident/me → normalizeResidentData()
} else if (isResidentCookie === 'false') {
  // Call /auth/me → normalizeUserData(isResident=true/false)
}
```

**User Data Normalization:**
- **Admin/Manager:** Includes `role`, `modules`, `role_access_modules`, `devices`
- **Resident:** Simplified profile, `is_resident: true`, `role: { name: "resident" }`

### Authorization Check

**File:** [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx#L23-L72)

The `ProtectedRoute` component enforces:

1. **User Type Routing:**
   ```javascript
   if (isResident && !currentPath.includes("/resident/")) 
     → Redirect to /resident/home
   if (!isResident && currentPath.includes("/resident/")) 
     → Redirect to /dashboard/home
   ```

2. **Module Access (Dashboard only):** Residents skip this check
3. **Role-Based Access:** Checked if `allowedRoles` specified
4. **Property Selection:** Residents with multiple properties must select one

---

## 📁 Resident Panel File Structure

```
src/pages/resident/
├── index.js                           # Exports all resident pages
├── home/                              # Dashboard overview
│   ├── index.jsx                      # Stats cards, recent activity
│   ├── api/
│   │   └── index.js                   # GET /module/resident/config/me
│   └── components/
├── myproperties/                      # Property selector/viewer
│   ├── index.jsx                      # Grid of properties (with auto-select logic)
│   ├── api/
│   │   └── index.js                   # GET /module/resident/config/my/properties
│   └── components/
│       ├── PropertyCard.jsx
│       ├── PropertyDetailModal.jsx
│       └── index.js
├── myinvoices/                        # Utility bills
│   ├── index.jsx                      # List with status chips, payment modal
│   ├── api/
│   │   └── index.js                   # GET /module/resident/config/my/invoices
│   └── components/
│       ├── InvoiceDetailModal.jsx
│       └── invoicePayModal.jsx
├── myservices/                        # Building services
│   ├── index.jsx
│   ├── api/
│   │   └── index.js
│   ├── components/
│   │   ├── ServiceCard.jsx
│   │   ├── ServiceDetailModal.jsx
│   │   └── ServiceHeader.jsx
│   └── hooks/
├── tickets/                           # Maintenance requests
│   ├── index.jsx                      # List with status filtering
│   ├── api/
│   │   └── index.js
│   └── components/
│       ├── TicketDetailModal.jsx
│       └── modals/
├── e-documents/                       # E-signatures & documents
│   ├── index.jsx
│   ├── api/
│   │   └── index.js                   # GET /module/resident/config/my/documents
│   └── components/
│       ├── DocumentViewModal.jsx
│       └── modals/
├── notifications/                     # System alerts
│   ├── index.jsx
│   ├── api/
│   │   └── index.js
│   └── components/
│       └── modals/
└── profile/                           # User settings
    ├── index.jsx
    ├── api/
    │   └── index.js
    ├── components/
    │   ├── ProfileHeader.jsx
    │   ├── ProfileSidebar.jsx
    │   ├── ProfileTabs.jsx
    │   └── modals/
    └── hooks/
        ├── usePasswordForm.js
        ├── useProfileMessages.js
        └── useResidentProfileForm.js
```

**Consistent Pattern for Each Module:**
```
<module>/
├── index.jsx              # Main page component with useState + useEffect
├── api/index.js           # API calls (import from shared client)
└── components/            # UI components (modals, cards, tables)
```

---

## 🔄 Data Flow & State Management

### Redux State Structure

**File:** [src/store/index.js](src/store/index.js)

```javascript
store {
  auth: {
    user,
    isAuthenticated,
    isInitialized,
    loading,
    error,
    modules,
    role_access_modules
  },
  ui: {
    darkMode,
    sidenavCollapsed,
    sidenavSize,
    // ... other UI state
  },
  property: {
    selectedPropertyId,      // Current resident's apartment ID
    selectedProperty,         // Full apartment object
    properties: []           // For admin property management
  },
  resident: {
    selectedResidentId,      // For admin resident management
    selectedResident,
    residents: []
  },
  // ... other entity slices (mtk, complex, building, block)
}
```

### Property Selection: Resident-Specific Logic

**File:** [src/store/slices/propertySlice.js](src/store/slices/propertySlice.js)

```javascript
// Resident API loads properties differently
// Main point-of-truth: /module/resident/config/my/properties

// Auto-select logic:
// if (resident.properties.length === 1) {
//   dispatch(setSelectedProperty(...))
//   navigate('/resident/home')
// }
```

**Auto-Hide Sidebar Entry:**

**File:** [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx#L229-L240)

```javascript
// Hide "my-properties" sidebar entry when resident has exactly 1 apartment
const hideMyProps = user?.is_resident 
  && residentPropertyCount === 1 
  && !currentPath.startsWith("/resident/my-properties")

if (hideMyProps) {
  // Filter out /my-properties from sidebar
}
```

### Reactive Property Updates

**File:** [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx#L197-L225)

When a property is selected:
1. Fetch property details via `/module/resident/config/my/property/{id}`
2. Store in Redux `propertySlice`
3. Request interceptor auto-attaches `apartmentId` to subsequent resident API calls

---

## 🌐 API Layer & HTTP Clients

### Main API Client

**File:** [src/services/api.js](src/services/api.js)

```javascript
baseURL: "http://api.smartlife.az/api/v1"

// Request Interceptor:
if (url.includes("/module/resident")) {
  if (!skipPaths.includes(url)) {  // Skip /config/me
    config.params.apartmentId = store.state.property.selectedPropertyId
    config.params.property_id = store.state.property.selectedPropertyId
  }
}

// Auth Header:
config.headers.Authorization = `Bearer ${token}`  // From smartlife_token cookie
```

### API Methods by Resident Module

Each page's `api/index.js` follows this pattern:

```javascript
// Home Dashboard
/module/resident/config/me                        → GET

// Properties
/module/resident/config/my/properties              → GET (list)
/module/resident/config/my/property/:id            → GET (detail)

// Invoices
/module/resident/config/my/invoices                → GET (list)
/module/resident/config/my/invoice/:id             → GET (detail)

// Services
/module/resident/config/my/services                → GET (list)
/module/resident/config/my/service/:id             → GET (detail)

// Tickets
/module/resident/config/my/tickets                 → GET (list)    [or /applications]
/module/resident/config/my/ticket/:id              → GET (detail)

// E-Documents
/module/resident/config/my/documents               → GET (list)
/module/resident/config/my/document/:id            → GET (detail)
/module/resident/config/my/document/:id/download   → GET (blob)

// Notifications
/module/resident/config/my/notifications           → GET (list)

// Profile
/module/resident/config/my/profile                 → GET (detail)
POST /auth/change-password                         → POST (password update)
```

---

## 🎨 UI Framework & Styling

### Component Libraries

- **Material Tailwind 2.x:** Dialog, Button, Spinner, Card, Typography, Chip
- **Heroicons 2.0 (Solid & Outline):** 24x24 icons
- **Tailwind CSS 3.3.4:** Utility-first styling + dark mode
- **Framer Motion 12.x:** Animations & transitions

### Dark Mode

**File:** [src/constants/darkMode.js](src/constants/darkMode.js)

Dark mode is toggled via `dark:` Tailwind classes on `<html>` element:

```javascript
// ReduxInitializer.jsx
if (darkMode) {
  document.documentElement.classList.add('dark')
} else {
  document.documentElement.classList.remove('dark')
}
```

### Responsive Design

- **Mobile:** < 1280px (Sidenav drawer)
- **Desktop:** >= 1280px (Fixed Sidenav)
- **Sidebar Sizes:** small (240px), medium (320px), large (400px)

---

## 🔄 Request/Response Handling

### Standard Component Lifecycle

Each resident page follows this pattern:

```jsx
const [data, setData] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
  fetchData()
}, [])

const fetchData = async () => {
  try {
    setLoading(true)
    setError(null)
    const response = await api.getAll()
    setData(response.data?.data || response.data || [])
  } catch (err) {
    setError(err?.message || t('fallback'))
  } finally {
    setLoading(false)
  }
}
```

### Error Handling

- **Toast Notifications:** `useDynamicToast()` hook for user feedback
- **Translation Fallback:** `t("key.path") || "Azərbaycanca fallback"`
- **401 Unauthorized:** Handled by response interceptor (doesn't auto-logout, lets UI handle)
- **Failed Requests:** Displayed to user with retry option

---

## 🌍 Internationalization (i18n)

**File:** [src/i18n/i18n.js](src/i18n/i18n.js)

**Supported Languages:**
- **az** (Azerbaijani) — Default/Fallback
- **en** (English)
- **ru** (Russian)

**Translation Files:** [src/i18n/locales/](src/i18n/locales/)

**Usage Pattern:**
```jsx
const { t } = useTranslation()
<p>{t("resident.home.myProperties") || "Mənim Əmlaklarım"}</p>
```

All user-facing strings should include Azerbaijani fallback.

---

## 🔑 Key Features & Special Behavior

### 1. **Multi-Property Support**

```javascript
// Resident can own multiple properties
if (resident.properties.length === 1) {
  // Auto-select + hide selector from sidebar
  navigate('/resident/home')
} else {
  // Force selection before accessing other pages
  navigate('/resident/my-properties')
}
```

### 2. **Property Scope in API Requests**

```javascript
// Request interceptor automatically adds:
apartmentId=123
property_id=123

// To all resident API calls except /config/me
```

### 3. **Sidebar Branding**

**File:** [src/widgets/layout/sidenav/index.jsx](src/widgets/layout/sidenav/index.jsx#L11-L22)

```javascript
// For residents:
displayName = selectedProperty?.sub_data?.complex?.name
// OR company name for non-residents
```

### 4. **Auto-Refresh User Session**

**File:** [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx#L180-L190)

```javascript
// Every 10 minutes, call /auth/me or /module/resident/me to refresh
setInterval(() => refreshUser(), 10 * 60 * 1000)
```

### 5. **Context-Aware Routing**

- Residents always redirect to `/resident/*`
- Non-residents always redirect to `/dashboard/*`
- Dashboard routes checked for module permissions
- Resident routes have no permission barriers

---

## 📊 Redux Slices Overview

### authSlice

**Key Selectors:**
- `selectUser` — Current user object
- `selectIsAuthenticated` — Boolean
- `selectIsInitialized` — Auth bootstrap complete
- `selectAuthError` — Error message if any

**Thunks:**
- `initializeUser()` — Load from cookie on app start
- `loginUser(email, password)` — POST /auth/login
- `logoutUser()` — POST /auth/logout
- `refreshUser()` — Re-fetch user data

### propertySlice

**State:**
- `selectedPropertyId` — Current apartment ID (stored in Redux + cookie)
- `selectedProperty` — Full apartment object from API
- `properties` — Array of user's properties

**Used by:** All resident pages that need apartment context

### uiSlice

**State:**
- `darkMode` — Boolean
- `sidenavCollapsed` — Boolean
- `sidenavSize` — "small" | "medium" | "large"
- `configurator` — Settings panel state

---

## 🛣️ Route Filtering & Access Control

**File:** [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx#L75-L170)

The `filterRoutesByRole()` function:

```javascript
filterRoutesByRole(routes, user) {
  // 1. Filter layout: only "resident" routes for residents
  // 2. Filter pages by moduleName (dashboard only)
  // 3. Filter by allowedRoles (if specified)
  // 4. Return filtered routes for sidebar + rendering
}
```

**For Residents:**
- All resident pages shown in sidebar (no permission filtering)
- "my-properties" entry hidden if user has exactly 1 apartment

---

## 🚀 Performance Considerations

### 1. **Lazy Loading**
- Resident property fetched on-demand when selected
- Module imports use dynamic `import()` for code splitting

### 2. **Request Deduplication**
- Interceptor checks `skipPaths` before attaching `apartmentId`
- `/config/me` always called without scope

### 3. **Caching**
- `selectedProperty` stored in Redux to avoid refetch
- User auto-refreshes every 10 minutes

### 4. **Responsive Images**
- Logo PNG served from `public/Site_Logo/`
- Dark mode logo swapped in Sidenav component

---

## 🐛 Common Development Patterns

### Add a New Resident Page

1. **Create folder structure:**
   ```
   src/pages/resident/new-module/
   ├── index.jsx
   ├── api/
   │   └── index.js
   └── components/
   ```

2. **Add to routes.jsx:**
   ```jsx
   {
     icon: <IconName {...icon} />,
     name: "sidebar.newModule",
     path: "/new-module",
     element: <ResidentNewModulePage />,
   }
   ```

3. **Export from index.js:**
   ```javascript
   export { default as ResidentNewModulePage } from './new-module'
   ```

4. **API pattern:**
   ```javascript
   export const newModuleAPI = {
     getAll: async (params = {}) => {
       const response = await api.get("/module/resident/config/my/resources", { params })
       return response.data
     }
   }
   ```

5. **Component pattern:**
   ```jsx
   const [data, setData] = useState([])
   const [loading, setLoading] = useState(true)
   const [error, setError] = useState(null)
   
   useEffect(() => {
     fetchData()
   }, [])
   
   const fetchData = async () => {
     // Standard pattern...
   }
   ```

---

## 📝 Translation Best Practices

All strings should use i18n keys with **Azerbaijani fallback**:

```jsx
// ✅ Good
{t("resident.home.myProperties") || "Mənim Əmlaklarım"}

// ❌ Avoid
"My Properties"
t("resident.home.myProperties")  // Without fallback
```

**File in locales:**
```json
{
  "resident": {
    "home": {
      "myProperties": "Mənim Əmlaklarım",
      "myInvoices": "Mənim Hesablaşmalarım"
    }
  }
}
```

---

## 🔌 Integration Points

### Backend Endpoints Expected

All resident API calls expect:

1. **Auth:**
   - `POST /auth/login`
   - `GET /auth/me`
   - `GET /module/resident/me`
   - `POST /auth/logout`

2. **Resident Config Endpoints:**
   - `GET /module/resident/config/me` — User info
   - `GET /module/resident/config/my/properties` — Property list
   - `GET /module/resident/config/my/invoices` — Bill list
   - `GET /module/resident/config/my/documents` — Document list
   - `GET /module/resident/config/my/tickets` — Request list
   - `GET /module/resident/config/my/notifications` — Alert list
   - `GET /module/resident/config/my/services` — Service list
   - `GET /module/resident/config/my/profile` — Profile info

3. **Modify Endpoints:**
   - `POST /auth/change-password`
   - (Other POST/PUT/DELETE endpoints for invoices, tickets, etc.)

---

## ✅ Quality Checklist

- [x] Dual-user routing (admin vs resident) working
- [x] Property selection & auto-select logic implemented
- [x] Request interceptor auto-scoping to `apartmentId`
- [x] Dark mode toggle functional
- [x] i18n fallbacks implemented
- [x] Error handling with toast notifications
- [x] Redux state persistence (cookies)
- [x] User session refresh every 10 min
- [x] Responsive design (mobile/desktop)
- [x] Module-based access control (dashboard only)
- [x] Auth cookie management
- [x] Lazy loading & code splitting ready

---

## 📚 Key Files Reference

| File | Purpose |
|------|---------|
| [src/App.jsx](src/App.jsx) | Top-level route configuration |
| [src/routes.jsx](src/routes.jsx) | Route definitions (admin + resident) |
| [src/layouts/dashboard.jsx](src/layouts/dashboard.jsx) | Main dashboard layout + filtering |
| [src/store/slices/authSlice.js](src/store/slices/authSlice.js) | Authentication state |
| [src/store/hooks/useAuth.js](src/store/hooks/useAuth.js) | Auth hooks & utilities |
| [src/services/api.js](src/services/api.js) | HTTP client + interceptors |
| [src/pages/resident/index.js](src/pages/resident/index.js) | Resident page exports |
| [src/components/ReduxInitializer.jsx](src/components/ReduxInitializer.jsx) | App initialization |

---

## 🎯 Next Steps for Development

1. **Testing:** No test runner configured; consider adding Jest + React Testing Library
2. **Linting:** No ESLint configured; add for code quality
3. **Error Boundaries:** Consider adding React Error Boundary components
4. **Analytics:** Track resident user actions for improvement
5. **Accessibility:** Audit with axe DevTools for WCAG compliance
6. **Performance:** Profile with React DevTools Profiler
7. **Monitoring:** Add Sentry or similar for production error tracking

---

**Analysis Complete** ✓
