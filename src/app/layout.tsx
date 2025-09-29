import { JourneyProvider } from '@/frontend/features/loan-journey/JourneyContext';
// --- FIX: Import and use the renamed AppThemeProvider ---
import { AppThemeProvider } from '@/components/common/ThemeProvider';
import type { Metadata } from 'next';
import '@/frontend/styles/globals.css';

export const metadata: Metadata = {
  title: 'MoneyView GenUI POC',
  description: 'A personalized loan journey experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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