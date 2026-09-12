import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  type Auth,
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { Platform } from 'react-native';

import { firebaseEnv } from './env';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseEnv);
  }
  return app;
}

/**
 * Auth has to be initialised with AsyncStorage persistence on native, otherwise
 * the session is dropped every time the app restarts. On web the SDK picks its
 * own (IndexedDB) persistence, so plain `getAuth` is correct there.
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    const instance = getFirebaseApp();
    auth =
      Platform.OS === 'web'
        ? getAuth(instance)
        : initializeAuth(instance, {
            persistence: getReactNativePersistence(AsyncStorage),
          });
  }
  return auth;
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}

/** ID token for the signed-in user, used to authenticate calls to the backend. */
export async function getIdToken(): Promise<string | null> {
  const user = getFirebaseAuth().currentUser;
  return user ? user.getIdToken() : null;
}
