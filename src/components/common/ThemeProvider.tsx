'use client';

import React, { ReactNode } from 'react';
// We MUST import the real ThemeProvider from MUI
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from '@/theme/theme';

// Create the default MoneyView theme instance
const moneyviewTheme = getTheme('pothos'); // Using 'pothos' as the default

interface AppThemeProviderProps {
  children: ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    // This provider is what makes the design system components work correctly.
    <MuiThemeProvider theme={moneyviewTheme}>
      {/* CssBaseline is a MUI component that resets browser styles for consistency */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}