import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/shared/hooks/useTheme';
import { AdProvider } from '@/shared/components/ads/AdProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AdProvider>
          {children}
        </AdProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}