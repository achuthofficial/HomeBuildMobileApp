# HomeBuildMobileApp

React Native (Expo) mobile app with Firebase, Supabase and a Python (FastAPI)
backend.

```
mobile/    Expo SDK 57 app (expo-router, TypeScript)
backend/   FastAPI service (Firebase Admin + Supabase service-role)
```

## How the three services fit together

| Service  | Where it runs | Used for |
| -------- | ------------- | -------- |
| Firebase | app + backend | Authentication (the app signs in, the backend verifies the ID token), Firestore, Storage |
| Supabase | app + backend | Postgres data. The app uses the anon key under row level security; the backend uses the service-role key for privileged work |
| FastAPI  | backend       | Business logic the app shouldn't hold keys for, and anything that needs the service-role key |

The app sends its Firebase ID token as `Authorization: Bearer <token>`; the
backend verifies it with the Admin SDK and resolves the caller's `uid`.

## Mobile app

```bash
cd mobile
npm install
cp .env.example .env      # fill in Firebase + Supabase publishable keys
npm start                 # then press a / i / w, or scan the QR code
```

Scripts: `npm run typecheck`, `npm run lint`, `npm run android|ios|web`.

App screens (`src/hb/`) follow the HomeBuild design prototype. Sign in with
`98111 25521` (Homeowner) or `98765 43210` (Site Supervisor); the OTP step is a
demo (tap a box to autofill). Auth, data and sync are in-memory for now, not yet
wired to Firebase or Supabase.

- `App.tsx` — router over the screen map; `store.tsx` — app state and actions
- `auth.tsx` — splash, sign in / register, OTP, role pick
- `customer.tsx` — Home, Design, Build, Finance, Schedule, milestones, notifications, profile
- `supervisor.tsx` — Home, Tasks, Updates, Profile, 3-step daily update wizard, offline queue
- `shell.tsx` / `ui.tsx` / `theme.ts` — header and tab bar, shared components, light/dark palettes

Key modules:

- `src/lib/env.ts` — reads `EXPO_PUBLIC_*` config, with `isFirebaseConfigured()` / `isSupabaseConfigured()` helpers
- `src/lib/firebase.ts` — app, auth (AsyncStorage-persisted on native), Firestore, Storage
- `src/lib/supabase.ts` — lazily created Supabase client with session persistence and foreground token refresh
- `src/lib/api.ts` — typed `api.get/post/patch/delete` against the FastAPI backend, attaching the bearer token

Only `EXPO_PUBLIC_*` values reach the device, and everything prefixed that way
is readable by anyone with the app — keep service accounts and service-role
keys on the server.

For a physical device, set `EXPO_PUBLIC_API_URL` to your machine's LAN IP
(e.g. `http://192.168.1.20:8000`); `localhost` resolves to the phone itself.

## Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env       # service-account path + Supabase service-role key
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docs at http://localhost:8000/docs, health at `/health`.

Checks: `pytest`, `ruff check .`, `ruff format .`.

Layout:

- `app/config.py` — settings from environment / `.env`
- `app/services/firebase.py` — Admin SDK init and ID-token verification
- `app/services/supabase.py` — service-role client
- `app/deps.py` — `CurrentUserDep`, the authenticated-caller dependency
- `app/routers/` — `health` plus an example `projects` resource

`app/routers/projects.py` documents the `projects` table it expects; create it
in the Supabase SQL editor before calling those endpoints.

## Credentials checklist

1. **Firebase** — create a project, add a Web app, copy its config into
   `mobile/.env`. Generate a service-account key (Project settings > Service
   accounts) and point `FIREBASE_CREDENTIALS_FILE` at it in `backend/.env`.
2. **Supabase** — create a project; copy the URL and anon key into
   `mobile/.env`, the URL and service-role key into `backend/.env`.
3. Never commit either `.env` or the service-account JSON — both are gitignored.
