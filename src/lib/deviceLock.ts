'use client';

// =========================================================================
// PawOS Device Lock State Manager
// =========================================================================
// Rules:
// 1. Initialized to `true` so the iPad starts LOCKED on newly opened website
//    or upon browser refresh (F5 / reload).
// 2. Unlocked when the user taps unlock, presses Space/Enter, or taps a notification.
// 3. Stays UNLOCKED during client-side navigation (closing apps, returning to Home).
// 4. Locks when the user manually clicks the Lock / Sleep button in the HUD.
// =========================================================================

let isDeviceLocked = true;
const listeners = new Set<(locked: boolean) => void>();

export function isPadLocked(): boolean {
  return isDeviceLocked;
}

export function setPadLocked(locked: boolean): void {
  if (isDeviceLocked === locked) return;
  isDeviceLocked = locked;
  listeners.forEach((listener) => {
    try {
      listener(locked);
    } catch {
      // Ignore listener errors
    }
  });
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('pawpad_lock_change', { detail: locked }));
  }
}

export function subscribePadLock(listener: (locked: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
