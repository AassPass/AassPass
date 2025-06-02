import Banner from "@/components/LandingPageComponents/Banner";
import FeatureSection from "@/components/LandingPageComponents/HeroSection";
import Header from "@/components/LandingPageComponents/Header";
import MapSection from "@/components/LandingPageComponents/MapSection";
import Info from "@/components/LandingPageComponents/Info";

export default function Home() {
  return (
    <div>
      <Banner />
      <div className=" flex items-center flex-col">
        <Header />
        <FeatureSection />
        <MapSection />
        <Info />
      </div>
    </div>
  );
}
