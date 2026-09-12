import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { supabaseEnv } from './env';

let client: SupabaseClient | undefined;

/**
 * The client is created lazily so that a missing key surfaces where Supabase is
 * actually used, rather than crashing the bundle on import.
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(supabaseEnv.url, supabaseEnv.anonKey, {
      auth: {
        storage: Platform.OS === 'web' ? undefined : AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        // There is no URL to read the session back from in a native app.
        detectSessionInUrl: Platform.OS === 'web',
      },
    });

    // Supabase refreshes tokens on a timer, which the OS suspends in the
    // background. Tie the timer to foreground state so tokens stay fresh.
    if (Platform.OS !== 'web') {
      const instance = client;
      AppState.addEventListener('change', (state) => {
        if (state === 'active') {
          instance.auth.startAutoRefresh();
        } else {
          instance.auth.stopAutoRefresh();
        }
      });
    }
  }
  return client;
}

/** Access token for the current Supabase session, if any. */
export async function getSupabaseAccessToken(): Promise<string | null> {
  const { data } = await getSupabase().auth.getSession();
  return data.session?.access_token ?? null;
}
