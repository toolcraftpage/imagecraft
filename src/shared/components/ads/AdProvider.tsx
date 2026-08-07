import { createContext, useContext, useState, useEffect } from 'react';

interface AdContextType {
  adsEnabled: boolean;
  setAdsEnabled: (v: boolean) => void;
}

const AdContext = createContext<AdContextType>({
  adsEnabled: false,
  setAdsEnabled: () => {},
});

export const useAds = () => useContext(AdContext);

export function AdProvider({ children }: { children: React.ReactNode }) {
  const [adsEnabled, setAdsEnabled] = useState(false); // ← change to true when you have an AdSense account

  useEffect(() => {
    if (adsEnabled && !document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX';
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  }, [adsEnabled]);

  return (
    <AdContext.Provider value={{ adsEnabled, setAdsEnabled }}>
      {children}
    </AdContext.Provider>
  );
}