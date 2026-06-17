# DEV_RUN_DOC — Run the app with login bypass (no backend, no Firebase)

This document explains how to boot the frontend straight to the profile page,
skipping the login screen and using canned mock data instead of a real backend.

Everything is driven by a single env var: `VITE_DEV_BYPASS_AUTH`.
Steps 1–4 are the one-time setup (already present in the repo). Steps 5–6 are
what you run each time.

---

## 1. Set the flag in `frontend/.env`

This single env var drives the whole bypass. Vite only exposes vars prefixed
with `VITE_`, and it reads them as **strings**.

```env
# LOCAL DEV ONLY — not committed (.gitignored).
# Point the frontend at the local backend (running on :3000).
VITE_API_BASE_URL=http://localhost:3000

# DEV-ONLY: skip the login screen and render the app directly.
VITE_DEV_BYPASS_AUTH=true

# Firebase Web config — PLACEHOLDERS. The app will load, but LOGIN will not work
# until you paste the real Firebase web app config (Firebase console > Project
# settings > Your apps, or pull from Infisical).
VITE_FIREBASE_API_KEY=REPLACE_ME
VITE_FIREBASE_AUTH_DOMAIN=local-dev-placeholder.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=local-dev-placeholder
VITE_FIREBASE_STORAGE_BUCKET=local-dev-placeholder.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000

# Optional analytics (safe to leave blank locally)
VITE_PUBLIC_POSTHOG_KEY=
VITE_PUBLIC_POSTHOG_HOST=
VITE_FEATURE_FLAG_ETHNICITY=false
VITE_FEATURE_FLAG_NATIONALITY=false
```

The `.env` must live in `frontend/` (Vite's root), not the repo root.

## 2. Gate the login screen on the flag — `frontend/src/AuthenticatedApp.jsx`

Short-circuit before the auth check so `<App/>` (profile) renders instead of
`<Login/>`:

```js
const bypassAuth = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true';

function AuthenticatedApp() {
  const { user, loading } = useAuth();
  if (bypassAuth) return <App />;   // skip login in dev
  if (loading) return <Spinner/>;
  if (!user) return <Login/>;
  return <App/>;
}
```

Compare against the **string** `'true'` — `import.meta.env` values are never
booleans.

## 3. Provide a mock data layer — `frontend/src/services/mockData.js`

Login alone isn't enough: `App.jsx` immediately calls `getProfile()`,
`getEnrollments()`, etc. Without a backend those throw, and a 401 would call
`logout()`. So this file exports:

- `MOCK_ENABLED = import.meta.env.VITE_DEV_BYPASS_AUTH === 'true'` (same flag), and
- resolver functions returning canned data keyed by endpoint path.

## 4. Short-circuit the API services on the flag

In both `frontend/src/services/api.js` and `frontend/src/services/loyaltyApi.js`,
return mock data before any `fetch`:

```js
if (MOCK_ENABLED) return resolveApiMock(endpoint, options);
```

This is why no backend and no real Firebase config are needed — every network
call is intercepted.

> Steps 1–4 are all gated on the **same** `VITE_DEV_BYPASS_AUTH` flag, so
> flipping that one value switches the entire app between "real" and "bypass"
> mode.

## 5. Install dependencies (first time only)

```powershell
cd frontend
npm install
```

## 6. Start the dev server

```powershell
npm run dev      # script pins --port 5174
```

Open **http://localhost:5174/** → lands directly on the profile.

---

## To switch back to real auth

Set `VITE_DEV_BYPASS_AUTH=false`, fill in the real Firebase keys (currently
`REPLACE_ME` placeholders) and point `VITE_API_BASE_URL` at a running backend,
then **restart** `npm run dev`.

## Two gotchas

- **Restart after any `.env` change** — Vite reads env vars only at startup, so
  toggling the flag mid-session has no effect until you stop (`Ctrl+C`) and
  re-run.
- **Never ship this** — `.env` is gitignored and the mock path is gated entirely
  on the dev flag, so it can't reach production.