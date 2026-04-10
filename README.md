# SmartLife Web

SmartLife Web, bina/kompleks idarəetməsi üçün dashboard və resident portalı təqdim edən React + Vite əsaslı frontend layihəsidir.

Bu README layihənin hazırkı vəziyyətinin başdan sona texniki analizini, local development addımlarını və deploy qaydasını əhatə edir.

## 1) Layihənin Qısa Analizi

- Arxitektura: Vite SPA, React Router, Redux Toolkit, lazy-loaded səhifələr.
- UI: TailwindCSS + Material Tailwind komponentləri, custom UI layer.
- Auth: cookie əsaslı token idarəsi (`smartlife_token`) və role/resident ayrımı.
- Routing: `/dashboard/*`, `/resident/*`, `/properties/*`, `/auth/*`.
- Data layer: əsasən mərkəzi Axios client (`src/services/api.js`), lakin bəzi modullarda mock/fetch pattern qalır.
- Real-time: notification üçün WebSocket kanal abunəliyi mövcuddur.
- i18n: AZ/EN/RU dilləri aktivdir.

## 2) Texnologiya Stack

- React 18
- Vite 4
- React Router DOM 6
- Redux Toolkit + React Redux
- TailwindCSS + Material Tailwind
- Axios
- i18next + react-i18next
- Framer Motion
- ApexCharts
- Leaflet / React-Leaflet

## 3) Layihə Strukturu (Praktik Xəritə)

```txt
src/
  App.jsx                 # Root routes
  main.jsx                # App bootstrap (Router + Store + ThemeProvider)
  routes.jsx              # Dashboard/Resident/Auth route konfiqi
  layouts/
    dashboard.jsx         # Protected layout + role/module filtering
    auth.jsx              # Auth layout
  services/
    api.js                # Main Axios client + auth interceptor
    http.js               # Alternativ Axios client
    management/           # MTK, complex, building, block, property API-ləri
    finance/              # invoice service
    users/                # users service
  store/
    index.js              # Redux store
    slices/               # auth, ui, management, notifications və s.
  hooks/                  # custom hooks (socket, filters, title və s.)
  components/             # reusable common/ui komponentlər
  pages/
    auth/
    dashboard/
    resident/
```

## 4) Routing və Access Modeli

### Route axını

- `/` -> avtomatik `/dashboard`-a redirect.
- `/dashboard/*` -> idarəetmə paneli (admin/manager/user).
- `/resident/*` -> resident paneli.
- `/properties/*` -> dashboard layout istifadə edir.
- `/auth/*` -> sign-in səhifələri.

### Access nə ilə idarə olunur

- `user.role.name === "root"` olduqda bütün modullara keçid açıqdır.
- Digər rollar üçün:
  - `role_access_modules` və ya `modules` üzərindən module check edilir.
  - `allowedRoles` olan route-larda əlavə rol filtrindən keçir.
- Resident və non-resident route-ları bir-birindən sərt ayrılıb.

## 5) Auth və Session Mexanikası

Əsas cookie-lər:

- `smartlife_token`: API üçün Bearer token.
- `smartlife_is_resident`: resident me endpoint seçimi üçün marker.
- `smartlife_property_id`: seçilmiş property konteksti.

Flow qısa olaraq:

1. `ReduxInitializer` daxilində `initializeUser` çağırılır.
2. Token varsa `auth/me` və ya `module/resident/config/me` ilə user hydrate edilir.
3. Dashboard daxilində resident üçün property siyahısı ayrıca yenilənir.
4. Logout zamanı cookie-lər və property selection təmizlənir.

## 6) API Layer Analizi

### Mərkəzi API client

- `src/services/api.js`:
  - `baseURL` dev-də `/api`, prod-da `VITE_API_BASE_URL || VITE_API_URL || /api`.
  - Token interceptor var.
  - Resident request-lərinə seçilmiş `apartmentId` avtomatik əlavə olunur (müəyyən endpointlər istisna).

### Diqqət tələb edən texniki borc

- Layihədə qarışıq API pattern var:
  - Bir hissə `src/services/api.js` ilə gedir.
  - Bir hissə səhifə daxilində ayrıca `fetch + mock data` kimi saxlanıb.
- Bəzi dashboard modullarında real API kodu comment-dədir, mock data aktivdir (məs: KPI, Applications, bəzi Finance modulları).

Bu səbəbdən production davranışı moduldan-modula fərqli ola bilər.

## 7) WebSocket və Bildirişlər

- Notification socket hook-u mövcuddur (`useNotificationsSocket`).
- Hazırkı endpoint-lər kod daxilində hardcoded verilib (`wss://api.smartlife.az/...`, auth URL də daxil).
- Reconnect strategiyası exponential backoff ilə implement olunub.

Tövsiyə: endpoint və key-ləri gələcəkdə `.env`-ə daşımaq.

## 8) Environment Variables

Layihədə istifadə olunan dəyişənlər:

- `VITE_API_BASE_URL` - production API base URL (əsas).
- `VITE_API_URL` - bəzi legacy/mock modul faylları tərəfindən də istifadə olunur.
- `VITE_GROQ_API_KEY` - AI chat widget üçün tələb olunur.

Nümunə `.env.local`:

```bash
VITE_API_BASE_URL=https://api.smartlife.az/api/v1
VITE_API_URL=https://api.smartlife.az/api/v1
VITE_GROQ_API_KEY=your_groq_api_key_here
```

## 9) Local Development

Tələblər:

- Node.js 20+ (CI da Node 20 istifadə edir)
- npm

Quraşdırma və işə salma:

```bash
npm ci
npm run dev
```

Default dev server:

- `http://localhost:3157`

Dev proxy davranışı:

- `/api/*` çağırışları `https://api.smartlife.az/api/v1/*` istiqamətinə yönləndirilir.

Build və preview:

```bash
npm run build
npm run preview
```

Qeyd: Build uğurludur, amma böyük chunk warning-ləri var (bundle optimizasiyası üçün manual chunking/code-splitting tövsiyə olunur).

## 10) Deploy

### Variant A: Genezio

`genezio.yaml` faylı frontend deploy üçün `dist` qovluğunu publish edir.

### Variant B: Nginx

- `nginx.conf.example` SPA üçün `try_files ... /index.html` qaydasını verir.
- `nginx-ws-proxy.conf` WebSocket proxy nümunəsi təqdim edir.

### Variant C: GitHub Actions

`.github/workflows/deploy.yml` build + rsync upload axınını ehtiva edir:

1. `npm ci`
2. `npm run build`
3. `dist/` qovluğunu serverə rsync ilə göndərir (`/home/frontend/dist/`)

## 11) Mövcud Risklər / Texniki Borc

- API inteqrasiyası tam unifikasiya olunmayıb (service layer + page-level mock qarışıqdır).
- WebSocket URL və APP key hardcoded-dir.
- Test/lint script-ləri `package.json` daxilində yoxdur.
- Bundle ölçüsü böyükdür (warning mövcuddur).
- CI workflow faylı deploy sonrası service reload/health-check etmir.

## 12) Tövsiyə Olunan Növbəti Addımlar

1. Bütün page-level mock API-ləri `src/services/*` altında mərkəzləşdir.
2. `VITE_API_URL` və `VITE_API_BASE_URL` istifadəsini bir standartda birləşdir.
3. WebSocket konfiqurasiyasını `.env` ilə idarə et.
4. `lint`, `test`, `typecheck` script-lərini əlavə et və CI-ya daxil et.
5. `manualChunks` + route-level split ilə bundle ölçüsünü azalt.

## 13) Tez Problemlər və Həll

### Problem: AI chat açılır, amma cavab gəlmir

- `VITE_GROQ_API_KEY` təyin edilməyib və ya yanlışdır.

### Problem: Auth redirect loop

- Köhnə/yarımçıq cookie-lər qala bilər (`smartlife_token`, `smartlife_is_resident`).
- Cookie-ləri təmizləyib yenidən login edin.

### Problem: Dev-də API işləmir

- `/api` proxy konfiqi `vite.config.js` üzərindən işləyir.
- Birbaşa tam URL ilə çağıran legacy modullar üçün `VITE_API_URL` doğru olmalıdır.

---

Bu sənəd SmartLife-web layihəsinin cari kod bazasına əsasən hazırlanıb və koddakı real vəziyyəti (mərkəzi servis qatları + qismən mock modullar + hazır deploy nümunələri) əks etdirir.
