'use client';

import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  cartOpen: boolean;
  favOpen: boolean;
  chatOpen: boolean;
  adminOpen: boolean;
  trackerOpen: boolean;
  checkoutOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setFavOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  setAdminOpen: (open: boolean) => void;
  setTrackerOpen: (open: boolean) => void;
  setCheckoutOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <UIContext.Provider
      value={{
        cartOpen,
        favOpen,
        chatOpen,
        adminOpen,
        trackerOpen,
        checkoutOpen,
        setCartOpen,
        setFavOpen,
        setChatOpen,
        setAdminOpen,
        setTrackerOpen,
        setCheckoutOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}
