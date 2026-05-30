'use client';

import React from 'react';
import { AppProvider } from '../lib/AppContext';
import { UIProvider } from '../lib/UIContext';
import AppShell from '../components/AppShell';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <UIProvider>
        <AppShell>
          {children}
        </AppShell>
      </UIProvider>
    </AppProvider>
  );
}
