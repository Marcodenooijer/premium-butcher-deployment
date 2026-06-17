# DEV_RUN_DOCS — Run the app locally with mocked data (no backend, no login)

This guide explains how to boot the **frontend** straight to the profile page —
skipping the login screen and serving **canned mock data** instead of calling a
real backend or Firebase.

The whole thing is driven by a **single env var**: `VITE_DEV_BYPASS_AUTH`.
When it is `true`:

1. The login screen is skipped and `<App/>` (the profile) renders immediately.
2. Every API/network call is intercepted and returns mock data from
   `frontend/src/services/mockData.js`.

So no backend, no Firebase credentials, and no real user are required.

```
VITE_DEV_BYPASS_AUTH=true
        │
        ├─► AuthenticatedApp.jsx  → render <App/> directly (skip <Login/>)
        │
        ├─► mockData.js           → MOCK_ENABLED = true, exports canned data
        │
        ├─► api.js                → if (MOCK_ENABLED) return resolveApiMock(...)
        │
        └─► loyaltyApi.js         → if (MOCK_ENABLED) return resolveLoyaltyMock(...)
```

> All the code changes below (Steps 2–5) are **already present in the repo**.
> They are documented here so anyone can understand and reproduce the setup from
> scratch. If you just want to *run* the app, jump to **Quick start**.

---

## Quick start (TL;DR)

```powershell
cd frontend

# 1. Make sure frontend/.env contains:
#    VITE_DEV_BYPASS_AUTH=true

# 2. Install deps (first time only)
npm install

# 3. Start the dev server (pinned to port 5174)
npm run dev
```

Open **http://localhost:5174/** → you land directly on the profile page,
populated with mock data. No login, no backend needed.

---

## Step 1 — Set the flag in `frontend/.env`

Vite only exposes env vars prefixed with `VITE_`, and it reads them as
**strings** (never booleans). The `.env` file **must** live in `frontend/`
(Vite's project root), **not** the repo root.

`frontend/.env`:

```env
# Point the frontend at a local backend (ignored while bypass is on)
VITE_API_BASE_URL=http://localhost:3000

# DEV-ONLY: skip login + serve mock data
VITE_DEV_BYPASS_AUTH=true

# Firebase Web config — PLACEHOLDERS are fine while bypass is on.
# Real login will NOT work until these hold real values.
VITE_FIREBASE_API_KEY=REPLACE_ME
VITE_FIREBASE_AUTH_DOMAIN=local-dev-placeholder.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=local-dev-placeholder
VITE_FIREBASE_STORAGE_BUCKET=local-dev-placeholder.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000

# Optional analytics — safe to leave blank locally
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
VITE_FEATURE_FLAG_ETHNICITY=false
VITE_FEATURE_FLAG_NATIONALITY=false
```

> `.env` is gitignored, so it is never committed. With placeholder Firebase keys
> the app still loads — because every network call is mocked away (Steps 4–5).

---

## Step 2 — Bypass the login screen — `frontend/src/AuthenticatedApp.jsx`

Short-circuit **before** the auth check so the profile renders instead of the
login page:

```jsx
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import App from './App';

// DEV-ONLY: when VITE_DEV_BYPASS_AUTH=true, skip the login screen and render
// the app directly. Vite exposes env vars as strings, so compare against 'true'.
const bypassAuth = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

function AuthenticatedApp() {
  const { user, loading } = useAuth();

  // Render the app immediately when auth is bypassed in local dev.
  if (bypassAuth) {
    return <App />;
  }

  // Normal flow:
  if (loading) return <Spinner />;   // spinner while checking auth
  if (!user)   return <Login />;     // not logged in → login page
  return <App />;                    // logged in → profile
}

export default AuthenticatedApp;
```

Key point: compare against the **string** `'true'` — `import.meta.env` values are
never booleans.

---

## Step 3 — Provide a mock data layer — `frontend/src/services/mockData.js`

Bypassing login alone is not enough: `App.jsx` immediately calls `getProfile()`,
`getEnrollments()`, `getOrders()`, etc. Without a backend those calls throw, and
a `401` would trigger `logout()`. So this file exists purely to feed canned data.

It exports:

- `MOCK_ENABLED` — gated on the **same** flag, and
- **resolver functions** that map an endpoint path → canned data.

```js
// frontend/src/services/mockData.js
export const MOCK_ENABLED = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

// ... canned objects: customer, enrollments, family, orders, orderItems,
//     recommendedOrder, languages, countries, cities, loyaltyProducts, etc.

// Maps a REST path (query string stripped) to mock data:
export function resolveApiMock(endpoint, options = {}) {
  const path = endpoint.split('?')[0];
  const method = (options.method || 'GET').toUpperCase();

  if (path === '/customer/profile') {
    if (method === 'PUT') return { ...customer, ...JSON.parse(options.body || '{}') };
    return customer;
  }
  if (path === '/customer/family-members') {
    if (method === 'POST') return { id: Date.now(), ...JSON.parse(options.body || '{}') };
    return family;
  }
  if (/^\/customer\/\d+\/recent-orders$/.test(path)) return orders;
  if (/^\/customer\/recommendation\//.test(path))    return recommendedOrder;
  if (path === '/localization/languages')            return languages;
  if (path === '/localization/countries')            return countries;
  if (path === '/localization/cities')               return cities;
  // ... etc.

  console.warn('[mock] no api mock for', path, '— returning []');
  return [];
}

// Same idea for the loyalty endpoints:
export function resolveLoyaltyMock(endpoint, options = {}) {
  const path = endpoint.split('?')[0];
  if (path === '/enrollments')              return enrollments;
  if (/\/product-variants$/.test(path))     return loyaltyProducts;
  if (/\/transactions$/.test(path))         return { results: [] };
  // ... etc.
  return [];
}

export function resolveRecommendedOrderMock() { return recommendedOrder; }
export function resolveBarcodeMock()          { return '/no-photo.png'; }
```

**To change what you see locally** (different customer name, more orders,
extra loyalty products…), edit the canned objects at the top of this file —
nothing else needs to change.

> Any endpoint the app calls that is **not** matched logs
> `[mock] no api mock for <path>` and returns `[]`. If a section renders empty,
> check the browser console for that warning and add a matching branch.

---

## Step 4 — Short-circuit `frontend/src/services/api.js`

Return mock data **before** any `fetch` / auth-header logic. Three entry points
need the guard (the generic `apiCall`, plus two that build their own `fetch`):

```js
// at the top
import { MOCK_ENABLED, resolveApiMock, resolveRecommendedOrderMock, resolveBarcodeMock } from './mockData';

const apiCall = async (endpoint, options = {}) => {
  // DEV-ONLY: return canned data instead of hitting the network.
  if (MOCK_ENABLED) {
    return resolveApiMock(endpoint, options);
  }
  // ...normal fetch with auth headers...
};

// Barcode endpoint builds its own fetch — guard it too:
getBarcode: async (enrollmentId) => {
  if (MOCK_ENABLED) return resolveBarcodeMock();
  // ...normal fetch...
},

// Recommended order also builds its own fetch — guard it too:
export const getRecommendedOrder = async (customerId) => {
  if (MOCK_ENABLED) return resolveRecommendedOrderMock();
  // ...normal fetch...
};
```

Because `apiCall` is the single choke point for almost every request, one guard
there covers `getProfile`, `updateProfile`, family members, orders, localization,
carts, etc.

---

## Step 5 — Short-circuit `frontend/src/services/loyaltyApi.js`

Same pattern for the loyalty proxy. `loyaltyFetch` is the single choke point:

```js
import { MOCK_ENABLED, resolveLoyaltyMock } from "@/services/mockData.js";

async function loyaltyFetch(endpoint, options = {}) {
  // DEV-ONLY: return canned data instead of hitting the network.
  if (MOCK_ENABLED) {
    return resolveLoyaltyMock(endpoint, options);
  }
  // ...normal fetch with Firebase token...
}
```

This covers `getEnrollments`, `getProducts`, redemptions, transactions, etc.

---

## Step 6 — Defensive null-guards in `frontend/src/App.jsx`

The mock enrollment is intentionally minimal, so the Loyalty tab reads
enrollment fields with optional chaining / nullish fallbacks to avoid crashes
when a field is missing:

```jsx
// Points Balance
{((enrollmentData?.points ?? 0) + (enrollmentData?.bonus_points ?? 0) + (enrollmentData?.reserved_points ?? 0)).toLocaleString()}

// Member Since
{enrollmentData?.member_since ? new Date(enrollmentData.member_since).getFullYear() : '—'}
```

Keep this style for any new field you read off mock objects — mock data can be
sparser than real API responses.

---

## Step 7 — Install & run

```powershell
cd frontend
npm install        # first time only
npm run dev        # script pins --port 5174  ("dev": "vite --port 5174")
```

Open **http://localhost:5174/** → the profile page loads directly with mock data.

---

## Switching back to real auth + real backend

1. In `frontend/.env`, set:
   ```env
   VITE_DEV_BYPASS_AUTH=false
   ```
2. Replace the `REPLACE_ME` Firebase web keys with real values
   (Firebase console → Project settings → Your apps, or pull from Infisical).
3. Point `VITE_API_BASE_URL` at a running backend.
4. **Restart** `npm run dev`.

The same flag flips everything back: login screen returns and all `MOCK_ENABLED`
guards fall through to real `fetch` calls.

---

## Gotchas

- **Restart after any `.env` change.** Vite reads env vars only at startup.
  Toggling the flag mid-session does nothing until you stop (`Ctrl+C`) and re-run.
- **Empty section?** Check the browser console for
  `[mock] no api mock for <path>` and add a matching branch in `mockData.js`.
- **Never ship the bypass.** `.env` is gitignored and every mock path is gated on
  `VITE_DEV_BYPASS_AUTH`, so it can't reach production — but don't set the flag
  `true` in any deployed environment.
- **`.env` lives in `frontend/`**, not the repo root, or Vite won't read it.

---

## File reference

| File | Role in the mock/no-login setup |
| --- | --- |
| `frontend/.env` | Holds `VITE_DEV_BYPASS_AUTH=true` (the master switch) |
| `frontend/src/AuthenticatedApp.jsx` | Skips `<Login/>`, renders `<App/>` directly |
| `frontend/src/services/mockData.js` | `MOCK_ENABLED` + all canned data & resolvers |
| `frontend/src/services/api.js` | `if (MOCK_ENABLED) return resolveApiMock(...)` guards |
| `frontend/src/services/loyaltyApi.js` | `if (MOCK_ENABLED) return resolveLoyaltyMock(...)` guard |
| `frontend/src/App.jsx` | Null-safe reads of mock enrollment fields |