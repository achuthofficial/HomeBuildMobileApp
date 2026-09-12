/**
 * `firebase/auth` resolves to its React Native build under Metro, which exports
 * `getReactNativePersistence`. The published type definitions only describe the
 * web build, so augment the module with the RN-only export.
 */
import type { Persistence } from 'firebase/auth';

declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    setItem(key: string, value: string): Promise<void>;
    getItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}

export {};
