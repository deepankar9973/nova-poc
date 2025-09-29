'use client';

import React, { ReactNode } from 'react';
// --- FIX #1: Import the real ThemeProvider from MUI ---
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { getTheme } from '@/theme/theme';
import '@/theme/styles.css';

// Create a default theme instance to provide to the application
const defaultTheme = getTheme('pothos'); // Or 'flipkart', 'jify'

interface ThemeProviderProps {
  children: ReactNode;
}

// Rename our component slightly to avoid confusion
export function AppThemeProvider({ children }: ThemeProviderProps) {
  return (
    // --- FIX #2: Wrap everything in the MUI ThemeProvider ---
    // This makes the `theme` object available to all child components,
    // including the ones from the mv-pbds library.
    <MuiThemeProvider theme={defaultTheme}>
      {/* Our custom div for data-theme can remain if needed */}
      <div className="mv-theme" data-theme={defaultTheme.themeName}>
        {children}
      </div>
    </MuiThemeProvider>
  );
}