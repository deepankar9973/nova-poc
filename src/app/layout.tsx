import { JourneyProvider } from '@/frontend/features/loan-journey/JourneyContext';
import { AppThemeProvider } from '@/components/common/ThemeProvider';
import type { Metadata } from 'next';
import '@/frontend/styles/globals.css'; // For Tailwind
import '@/theme/styles.css'; // <-- IMPORTANT: Import the MV font styles here

export const metadata: Metadata = { /* ... */ };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppThemeProvider>
          <JourneyProvider>
            {children}
          </JourneyProvider>
        </AppThemeProvider>
      </body>
    </html>
  );
}