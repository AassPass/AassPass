import { FaMapMarkedAlt, FaTags, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import Image from "next/image";
import FeatureImageSwitcher from "./Components/FeatureImageSwitcher";
// Adjust path if needed

export default function BestPriceDeals() {
  const features = [
    {
      id: "compare",
      icon: <FaCheckCircle className="text-green-400 text-2xl" />,
      title: "Compare Prices Instantly",
      description:
        "Quickly scan and compare prices across local gyms, salons, spas, restaurants, and more — no more overpaying!",
      image: "/compareprice.jpeg",
    },
    {
      id: "map",
      icon: <FaMapMarkedAlt className="text-blue-400 text-2xl" />,
      title: "See Offers Nearby on the Map",
      description:
        "Discover what’s happening around you using our live Lokaly Map. Find real-time deals and promotions near your current location.",
      image: "/Near by Price 2.jpg",
    },
    {
      id: "verified",
      icon: <FaTags className="text-yellow-400 text-2xl" />,
      title: "Verified Listings & Discounts",
      description:
        "Only genuine, verified local businesses are featured. Enjoy exclusive deals with complete peace of mind.",
      image: "/Deal 2.png",
    },
    {
      id: "smart",
      icon: <FaMoneyBillWave className="text-purple-400 text-2xl" />,
      title: "Join Events & Book Services Easily",
      description:
        "See who’s hosting what nearby and book in seconds — no calls, no confusion.",
      image: "/Deal 2.png",
    },
  ];

  return (
    <section id="feature-section" className="w-full text-white">
      {/* Top Feature Section */}
      <div className="w-full flex flex-col bg-[#1c1f2b] md:flex-row items-center justify-evenly gap-0 px-4">
        {/* Interactive Image Switcher */}
        <div className="w-full  ">
          <FeatureImageSwitcher features={features} />
        </div>

    
      </div>

      {/* CTA Section */}
      <div className="w-full flex flex-col md:flex-row items-center gap-4 px-4 py-6 bg-white text-black">
        <div className="flex-1 px-4">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Stop Guessing. Start Saving.
          </h3>
          <p className="mt-2 mb-4">
            Whether it's a fitness center, salon, course, or weekend event—know
            what you’re paying for before you commit.
          </p>
          <button className="px-6 py-3 hover:bg-blue-400 border-blue-400 border-2 transition rounded-md hover:text-white text-blue-400 font-medium">
            Explore Deals Around You
          </button>
        </div>
        <div className="w-full md:w-[560px] h-[360px]">
          <Image
            src="/Deal 2.png"
            alt="Start Saving"
            width={650}
            height={460}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Business Register Section */}
      <div className="w-full flex flex-col md:flex-row items-center gap-4 px-4 py-6 bg-[#1c1f2b]" id="register-business">
        {/* Text Content */}
        <div className="flex-1 px-4">
          <h3 className="text-2xl md:text-3xl font-semibold">
            Register Your Business Now
          </h3>
          <p className="text-white/80 mt-2">
            No setup cost. Easy dashboard. Local visibility guaranteed.
          </p>
          <p className="text-white/80 mt-2">
            <strong>Let Your Business Stand Out in the Crowd</strong>
            <br />
            Register your shop, salon, gym, or service with{" "}
            <span className="text-blue-400 font-semibold">AassPass</span> and
            connect with local customers instantly.
          </p>
          <button href="/Account/user-login" className="mt-4 px-6 py-3 hover:bg-green-400 border-green-400 border-2 transition rounded-md hover:text-white text-green-400 font-medium">
            Get Started for Free
          </button>
        </div>

        {/* Image */}
        <div className="w-full md:w-[560px] h-[360px]">
          <Image
            src="/Check near by deals and offer.jpg"
            alt="Register Business with AassPass"
            width={500}
            height={360}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
