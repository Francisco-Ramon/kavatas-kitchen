'use client';

import React from 'react';
import Hero from '../components/Hero';
import { useUI } from '../lib/UIContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { setChatOpen } = useUI();
  const router = useRouter();

  return (
    <Hero
      onOrderNowClick={() => router.push('/menu')}
      onExploreMenuClick={() => router.push('/menu')}
      onOpenChat={() => setChatOpen(true)}
    />
  );
}
