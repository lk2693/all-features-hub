import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CookieConsent {
  necessary: boolean;
  statistics: boolean;
  marketing: boolean;
  timestamp: string;
}

interface CookieConsentContextType {
  consent: CookieConsent;
  hasConsented: boolean;
  acceptAll: () => void;
  acceptNecessary: () => void;
  updateConsent: (category: keyof Omit<CookieConsent, "timestamp">, value: boolean) => void;
  saveConsent: () => void;
  resetConsent: () => void;
}

const STORAGE_KEY = "cookie-consent";

const defaultConsent: CookieConsent = {
  necessary: true,
  statistics: false,
  marketing: false,
  timestamp: "",
};

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [hasConsented, setHasConsented] = useState<boolean>(true); // Start with true to avoid flash

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CookieConsent;
        setConsent(parsed);
        setHasConsented(true);
      } catch {
        setHasConsented(false);
      }
    } else {
      setHasConsented(false);
    }
  }, []);

  const saveConsentToStorage = (newConsent: CookieConsent) => {
    const consentWithTimestamp = {
      ...newConsent,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consentWithTimestamp));
    setConsent(consentWithTimestamp);
    setHasConsented(true);
  };

  const acceptAll = () => {
    saveConsentToStorage({
      necessary: true,
      statistics: true,
      marketing: true,
      timestamp: "",
    });
  };

  const acceptNecessary = () => {
    saveConsentToStorage({
      necessary: true,
      statistics: false,
      marketing: false,
      timestamp: "",
    });
  };

  const updateConsent = (category: keyof Omit<CookieConsent, "timestamp">, value: boolean) => {
    if (category === "necessary") return; // Necessary cookies cannot be disabled
    setConsent((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const saveConsent = () => {
    saveConsentToStorage(consent);
  };

  const resetConsent = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConsent(defaultConsent);
    setHasConsented(false);
  };

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasConsented,
        acceptAll,
        acceptNecessary,
        updateConsent,
        saveConsent,
        resetConsent,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider");
  }
  return context;
}
