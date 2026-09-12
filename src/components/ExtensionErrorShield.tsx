'use client';

import { useEffect } from 'react';

/**
 * ExtensionErrorShield
 *
 * Suppresses unhandled promise rejections and errors originating from
 * buggy third-party browser extensions (such as 1ClickVPN Chrome Extension,
 * ID: pphgdbgldlmicfdkhondlafkiomnelnk, which crashes with Cannot read properties of undefined reading 'M_ID')
 * so that Next.js development error overlay does not intercept them and crash the app.
 */
export function ExtensionErrorShield() {
  useEffect(() => {
    const isExtensionError = (err: unknown) => {
      const errorObj = err as { message?: string; stack?: string } | null;
      const msg = errorObj?.message || String(err || '');
      const stack = errorObj?.stack || '';
      return (
        msg.includes('M_ID') ||
        msg.includes('pphgdbgldlmicfdkhondlafkiomnelnk') ||
        stack.includes('chrome-extension://') ||
        stack.includes('pphgdbgldlmicfdkhondlafkiomnelnk')
      );
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isExtensionError(event.reason)) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    const handleError = (event: ErrorEvent) => {
      if (
        isExtensionError(event.error) ||
        (event.filename && event.filename.includes('chrome-extension://'))
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
    };

    window.addEventListener('unhandledrejection', handleRejection, true);
    window.addEventListener('error', handleError, true);

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection, true);
      window.removeEventListener('error', handleError, true);
    };
  }, []);

  return null;
}
