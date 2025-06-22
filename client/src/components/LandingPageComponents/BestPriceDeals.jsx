"use client";

import { FaMapMarkedAlt, FaTags, FaCheckCircle, FaMoneyBillWave } from "react-icons/fa";
import Image from "next/image";

export default function BestPriceDeals() {
    const features = [
        {
            icon: <FaCheckCircle className="text-green-400 text-2xl" />,
            title: "Compare Prices Instantly",
            description: "Quickly scan prices across local gyms, salons, and more.",
        },
        {
            icon: <FaMapMarkedAlt className="text-blue-400 text-2xl" />,
            title: "See Offers Nearby on the Map",
            description: "Find deals around you with a real-time map view.",
        },
        {
            icon: <FaTags className="text-yellow-400 text-2xl" />,
            title: "Verified Listings & Discounts",
            description: "Only trusted, verified listings shown with real savings.",
        },
        {
            icon: <FaMoneyBillWave className="text-purple-400 text-2xl" />,
            title: "Join Events & Services Smartly",
            description: "Book smarter by seeing true value before committing.",
        },
    ];

    return (
        <section className="w-full text-white bg-gradient-to-r from-[#0b161c] to-[#201446] px-4">
            <div className="max-w-7xl mx-auto py-14 space-y-20">

                {/* Section Title & Features */}
                <div>
                    <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 bg-gradient-to-r from-[#6aabf2] to-[#8989de] bg-clip-text text-transparent">
                        Find Nearby Deals Instantly
                    </h2>

                    <div className="flex flex-col md:flex-row items-center justify-evenly py-12 gap-12 bg-gradient-to-r from-[#2c3b44] to-[#3b2f5d] rounded-xl px-4">
                        {/* Map Image */}
                        <div className="w-full md:w-1/2 max-w-sm md:max-w-md">
                            <Image
                                src="/Deal 1.png" // Replace with your real image path
                                alt="Nearby Deals"
                                width={500}
                                height={400}
                                className="rounded-lg shadow-md"
                            />
                        </div>

                        {/* Features List */}
                        <div className="flex flex-col gap-8 max-w-md text-left">
                            {features.map((feature, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                    {feature.icon}
                                    <div>
                                        <h4 className="text-lg font-semibold">{feature.title}</h4>
                                        <p className="text-white/80 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA Section With Image */}
                {/* CTA Section With Image */}
                <div className="flex flex-col md:flex-row items-center gap-10 bg-[#1b2430] rounded-xl p-6 md:p-12">
                    {/* Text CTA */}
                    <div className="flex-1 space-y-5 text-left">
                        <h3 className="text-2xl md:text-3xl font-semibold">
                            Stop Guessing. Start Saving.
                        </h3>
                        <p className="text-white/80">
                            Whether it's a fitness center, salon, course, or weekend event—know what you’re paying for before you commit.
                        </p>
                        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 transition rounded-md text-white font-medium">
                            Explore Deals Around You
                        </button>
                    </div>

                    {/* CTA Image */}
                    <div className="w-full md:w-[560px] h-[360px]">
                        <Image
                            src="/Deal 2.png" // Make sure this path is correct
                            alt="Start Saving"
                            width={500}
                            height={360}
                            className="rounded-lg shadow-md object-cover h-full w-full"
                        />
                    </div>
                </div>


            </div>
        </section>
    );
}
