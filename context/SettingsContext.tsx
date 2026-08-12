'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getSettingsApi } from '@/lib/api/settingsApi';
import type { SiteSettings } from '@/lib/api/types';

interface SettingsContextType {
  settings: SiteSettings | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getSettingsApi();
        if (!cancelled) setSettings(data);
      } catch {
        if (!cancelled) setSettings(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function whatsappLink(whatsapp?: string, message?: string) {
  const digits = String(whatsapp || '').replace(/\D/g, '');
  if (!digits) return null;
  const text = encodeURIComponent(message || "Hi Vrateez! I'd like to know more about your products.");
  return `https://wa.me/${digits}?text=${text}`;
}
