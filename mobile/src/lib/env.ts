/**
 * Runtime configuration.
 *
 * Values come from `EXPO_PUBLIC_*` variables, which Expo inlines into the
 * bundle at build time. Anything in here ships to the device, so only put
 * publishable keys here — never a Firebase service account or a Supabase
 * service-role key.
 */

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing environment variable ${name}. Copy .env.example to .env and fill it in.`
    );
  }
  return value;
}

export const firebaseEnv = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const supabaseEnv = {
  get url() {
    return required('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL);
  },
  get anonKey() {
    return required('EXPO_PUBLIC_SUPABASE_ANON_KEY', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
  },
};

export const apiEnv = {
  /** Base URL of the Python (FastAPI) backend. */
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000',
};

export function isFirebaseConfigured(): boolean {
  return Boolean(firebaseEnv.apiKey && firebaseEnv.projectId && firebaseEnv.appId);
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.EXPO_PUBLIC_SUPABASE_URL && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  );
}
