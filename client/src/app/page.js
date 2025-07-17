// app/page.jsx or pages/index.jsx (NO 'use client' here)

import dynamic from 'next/dynamic';
import Header from "@/components/LandingPageComponents/Header";
import AnimatedSection from '@/components/common/AnimatedSection';
import HeroSectionWrapper from "@/components/LandingPageComponents/HeroSectionWrapper";
import WhatsAppButton from '@/components/WhatsAppButton';

// Dynamically import client-only components with SSR disabled
const BestPriceDeals = dynamic(
  () => import('@/components/LandingPageComponents/BestPriceDeals'),
 
);

const EventListing = dynamic(
  () => import('@/components/LandingPageComponents/EventListing'),
  
);

const Faq = dynamic(
  () => import('@/components/LandingPageComponents/Faq'),
 
);

const AdsPage = dynamic(
  () => import('@/components/LandingPageComponents/AdsPage'),

);

const Footer = dynamic(
  () => import('@/components/LandingPageComponents/Footer'),

);

export default function Home() {
  return (
    <div>
      <main className="flex flex-col items-center overflow-x-hidden">
        {/* Static server-rendered components */}
        <Header />

        <AnimatedSection index={0}>
          <HeroSectionWrapper />
        </AnimatedSection>

        {/* Dynamically loaded client-only components */}
        <AnimatedSection index={1}>
          <AdsPage />
        </AnimatedSection>

        <AnimatedSection index={2}>
          <BestPriceDeals />
        </AnimatedSection>

        <AnimatedSection index={3}>
          <EventListing />
        </AnimatedSection>

        <AnimatedSection index={4}>
          <Faq />
        </AnimatedSection>

        <Footer />
        <WhatsAppButton/>
      </main>
    </div>
  );
}
