import Banner from '@/components/LandingPageComponents/Banner';
import HeroSection from '@/components/LandingPageComponents/HeroSection';
import Header from '@/components/LandingPageComponents/Header';
import MapSection from '@/components/LandingPageComponents/MapSection';
import BestPriceDeals from '@/components/LandingPageComponents/BestPriceDeals';
import EventListing from '@/components/LandingPageComponents/EventListing';
import Faq from '@/components/LandingPageComponents/Faq';

import { memo } from 'react';
import AnimatedSection from '@/components/common/AnimatedSection';
import AdsPage from '@/components/LandingPageComponents/AdsPage';

function Home() {
  return (
    <div>
      {/* <Banner /> */}
      <main className="flex flex-col items-center overflow-x-hidden  ">
        <Header />

        <AnimatedSection index={0}><HeroSection /></AnimatedSection>
        <AdsPage/>
        <MapSection />
        <AnimatedSection index={2}><BestPriceDeals /></AnimatedSection>
        <AnimatedSection index={3}><EventListing /></AnimatedSection>
        <AnimatedSection index={4}><Faq /></AnimatedSection>


      </main>
    </div>
  );
}

export default memo(Home);
