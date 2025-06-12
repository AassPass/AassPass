'use client';

import dynamic from 'next/dynamic';
import { memo } from 'react';

// Lazy-load non-critical components to reduce initial load
const Banner = dynamic(() => import('@/components/LandingPageComponents/Banner'), {
  ssr: false,
});
const FeatureSection = dynamic(() => import('@/components/LandingPageComponents/HeroSection'), {
  ssr: false,
});
const Header = dynamic(() => import('@/components/LandingPageComponents/Header'), {
  ssr: false,
});
const MapSection = dynamic(() => import('@/components/LandingPageComponents/MapSection'), {
  ssr: false,
});
const Info = dynamic(() => import('@/components/LandingPageComponents/Info'), {
  ssr: false,
});

function Home() {
  return (
    <div>
      <Banner />
      <main className="flex flex-col items-center">
        <Header />
        <FeatureSection />
        <MapSection />
        <Info />
      </main>
    </div>
  );
}

export default memo(Home);
