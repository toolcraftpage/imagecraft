import { createContext, useContext, useState, useEffect } from 'react';

interface AdContextType {
  adsEnabled: boolean;
  adsConfigured: boolean;
  setAdsEnabled: (v: boolean) => void;
}

const AdContext = createContext<AdContextType>({
  adsEnabled: false,
  adsConfigured: false,
  setAdsEnabled: () => {},
});

export const useAds = () => useContext(AdContext);

export function AdProvider({ children }: { children: React.ReactNode }) {
  const adsClient = import.meta.env.VITE_ADSENSE_CLIENT as string | undefined;
  const adsConfigured = Boolean(adsClient && adsClient.startsWith('ca-pub-'));
  const [adsEnabled, setAdsEnabled] = useState(adsConfigured);

  useEffect(() => {
    if (adsEnabled && adsConfigured && !document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsClient}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [adsClient, adsConfigured, adsEnabled]);

  return (
    <AdContext.Provider value={{ adsEnabled: adsEnabled && adsConfigured, adsConfigured, setAdsEnabled }}>
      {children}
    </AdContext.Provider>
  );
}