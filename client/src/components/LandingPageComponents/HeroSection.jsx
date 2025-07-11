"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

import colors from "@/libs/colors";
import HeroClientEnhancements from "./Components/HeroClientEnhancements";

const headings = [
  {
    title: "Your City, Your Scene – Deals, Events & Everything In Between",
    sublines: [
      "Price, Deals, Offers, Events, and More Right Around You",
      "One Tap to Explore What’s Hot Near You!",
    ],
  },
  {
    title: "Apna Sheher, Apne Deals – Sab Kuch Yahin Milega!",
    sublines: [
      "Aasspass Hi Sab Kuch Hai – Offers, Events Aur Mazedaar Deals!",
      "Aasspass Ki Dunia Ab App Mein – Offers, Events, Prices, Sab Kuch",
    ],
  },
];

const wordAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

const HeroSection = ({ isDayTime }) => {
  const [headingIndex, setHeadingIndex] = useState(0);
  const [sublineIndex, setSublineIndex] = useState(0);

  useEffect(() => {
    const sublineInterval = setInterval(() => {
      setSublineIndex(
        (prev) => (prev + 1) % headings[headingIndex].sublines.length
      );
    }, 4000);

    return () => clearInterval(sublineInterval);
  }, [headingIndex]);

  useEffect(() => {
    const headingInterval = setInterval(() => {
      setHeadingIndex((prev) => (prev + 1) % headings.length);
      setSublineIndex(0);
    }, 9000);

    return () => clearInterval(headingInterval);
  }, []);

  const renderWords = (text) =>
    text.split(" ").map((word, i) => (
      <motion.span
        key={`${word}-${i}`}
        custom={i}
        variants={wordAnimation}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="inline-block mr-1"
      >
        {word}
      </motion.span>
    ));

  return (
    <section className="relative w-full flex flex-col items-center justify-between py-6">
      <div className="relative z-10 max-w-7xl w-full flex flex-col lg:flex-row items-center px-6 lg:px-10 gap-8">
        {/* LEFT SIDE */}
        <motion.div
          className="w-full lg:w-1/2 flex flex-col"
          initial={{ x: -100, opacity: 0, rotate: -5 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-4 min-h-[200px] lg:min-h-[240px]">
            <h2 className="text-2xl md:text-2xl lg:text-3xl font-bold leading-tight">
              <AnimatePresence mode="wait">
                <motion.span
                  key={headings[headingIndex].title}
                  className="block mt-2"
                  style={{ color: colors.primaryText }}
                >
                  {renderWords(headings[headingIndex].title)}
                </motion.span>
              </AnimatePresence>
            </h2>

            <div>
              <AnimatePresence mode="wait">
                <motion.span
                  key={headings[headingIndex].sublines[sublineIndex]}
                  className="block mt-2 text-base md:text-lg"
                  style={{ color: colors.secondaryText }}
                >
                  {renderWords(headings[headingIndex].sublines[sublineIndex])}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <HeroClientEnhancements />
        </motion.div>

        {/* RIGHT SIDE IMAGE */}
        <motion.div
          className="lg:flex lg:w-1/2 h-full items-center justify-center relative"
          initial={{ x: 100, opacity: 0, rotate: 5 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <Image
            src={isDayTime ? "/Home page Day.jpg" : "/Home Night.jpg"}
            alt="Hero Image"
            width={600}
            height={600}
            priority={true}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
