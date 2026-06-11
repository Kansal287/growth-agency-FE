'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Wraps the app with next-themes ThemeProvider.
 * Must be a client component because it uses context internally.
 * Usage: wrap root layout body with this component.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
    </NextThemesProvider>
  );
}
