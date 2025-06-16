// No 'use client' here

import Banner from '@/components/LandingPageComponents/Banner';
import HeroSection from '@/components/LandingPageComponents/HeroSection';
import Header from '@/components/LandingPageComponents/Header';
import MapSection from '@/components/LandingPageComponents/MapSection';
import Info from '@/components/LandingPageComponents/Info';
import { memo } from 'react';
import Faq from '@/components/LandingPageComponents/Faq';

function Home() {
  return (
    <div>
      <Banner />
      <main className="flex flex-col items-center">
        <Header />
        <HeroSection />
        <MapSection />
        <Info />
        <Faq />
      </main>
    </div>
  );
}

export default memo(Home);
