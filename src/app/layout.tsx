import { JourneyProvider } from '@/frontend/features/loan-journey/JourneyContext';
import { ThemeProvider } from '@/components/common/ThemeProvider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <JourneyProvider>
            {children}
          </JourneyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}