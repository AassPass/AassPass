// import Banner from "@/components/LandingPageComponents/Banner";
import HeroSection from "@/components/LandingPageComponents/HeroSection";
import Header from "@/components/LandingPageComponents/Header";
// import MapSection from "@/app/lokalymap/mapComponents/MapSection";
import BestPriceDeals from "@/components/LandingPageComponents/BestPriceDeals";
import EventListing from "@/components/LandingPageComponents/EventListing";
import Faq from "@/components/LandingPageComponents/Faq";

import { memo } from 'react';
import AnimatedSection from '@/components/common/AnimatedSection';
import AdsPage from '@/components/LandingPageComponents/AdsPage';
import Footer from '@/components/LandingPageComponents/Footer';
import ContactUs from '@/components/LandingPageComponents/ContactUs';

function Home() {
  return (
    <div>
      {/* <Banner /> */}
      <main className="flex flex-col items-center overflow-x-hidden  ">
        <Header />

        <AnimatedSection index={0}>
          <HeroSection />
        </AnimatedSection>
        <AdsPage />
        {/* <MapSection /> */}
        <AnimatedSection index={2}><BestPriceDeals /></AnimatedSection>
        <AnimatedSection index={3}><EventListing /></AnimatedSection>
        <AnimatedSection index={4}><Faq /></AnimatedSection>
<ContactUs/>
<Footer/>

      </main>
    </div>
  );
}

export default memo(Home);
