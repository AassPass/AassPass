import HeroSection from "./HeroSection";


const HeroSectionWrapper = () => {
  const hour = new Date().getHours();
  const isDayTime = hour >= 6 && hour < 18;

  return <HeroSection isDayTime={isDayTime} />;
};

export default HeroSectionWrapper;
