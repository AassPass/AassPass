import { FaMapMarkedAlt, FaTags, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import Image from "next/image";

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
                {/* Image */}
              <div className="w-full md:w-1/2 max-w-full">
  <img
    id="feature-image"
    data-img={features[0].image}
    data-alt={features[0].title}
    className="w-full h-full object-cover"
  />
</div>


                {/* Feature List */}
                <div className="w-full md:w-1/2 flex flex-col gap-2 px-4 py-6" id="feature-list">
                    {features.map((feature) => (
                        <div
                            key={feature.id}
                            className="feature-item flex gap-4 items-start cursor-pointer p-4 transition hover:bg-white/10"
                            data-img={feature.image}
                            data-theme={feature.theme}
                        >
                            {feature.icon}
                            <div>
                                <h4 className="text-lg font-semibold">{feature.title}</h4>
                                <p className="text-white/80 text-sm">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="w-full flex flex-col md:flex-row items-center gap-0 px-4 py-6 bg-white text-black">
                <div className="flex-1 px-4">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                        Stop Guessing. Start Saving.
                    </h3>
                    <p className=" mt-2 mb-4">
                        Whether it's a fitness center, salon, course, or weekend event—know what you’re paying for before you commit.
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
            <div className="w-full flex flex-col md:flex-row items-center gap-0 px-4 py-6 bg-[#1c1f2b]">
                {/* Text Content */}
                <div className="flex-1 px-4">
                    <h3 className="text-2xl md:text-3xl font-semibold">
                        Register Your Business Now
                    </h3>
                    <p className="text-white/80 mt-2">No setup cost. Easy dashboard. Local visibility guaranteed.</p>
                    <p className="text-white/80 mt-2">
                        <strong>Let Your Business Stand Out in the Crowd</strong><br />
                        Register your shop, salon, gym, or service with <span className="text-blue-400 font-semibold">AassPass</span> and connect with local customers instantly.
                    </p>
                    <button className="mt-4 px-6 py-3 hover:bg-green-400 border-green-400 border-2 transition rounded-md hover:text-white text-green-400 font-medium">
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

            {/* JavaScript for Image Switch (no React hooks) */}
           <script
  dangerouslySetInnerHTML={{
    __html: `
      document.addEventListener("DOMContentLoaded", function () {
        const items = document.querySelectorAll(".feature-item");
        const img = document.getElementById("feature-image");

        if (img) {
          // Set default image
          img.src = img.getAttribute("data-img");
          img.alt = img.getAttribute("data-alt");

          // Click handler to switch image
          items.forEach(item => {
            item.addEventListener("click", () => {
              const newImg = item.getAttribute("data-img");
              const newAlt = item.querySelector("h4")?.textContent || "";

              if (newImg) {
                img.setAttribute("src", newImg);
                img.setAttribute("alt", newAlt);
              }

              // Highlight selected item (optional)
              items.forEach(i => i.classList.remove("bg-white/10"));
              item.classList.add("bg-white/10");
            });
          });
        }
      });
    `,
  }}
/>


        </section>
    );
}
