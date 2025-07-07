'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Image from 'next/image';
import OfferBanner from './OfferBanner';
import colors from '@/libs/colors';
import { getCoordinatesFromQuery } from '@/lib/mapboxGeocode';
import { useRole } from '@/Context/RoleContext';

const headings = [
    {
        title: 'Your City, Your Scene – Deals, Events & Everything In Between',
        sublines: [
            'Price, Deals, Offers, Events, and More Right Around You',
            'One Tap to Explore What’s Hot Near You!',
        ],
    },
    {
        title: 'Apna Sheher, Apne Deals – Sab Kuch Yahin Milega!',
        sublines: [
            'Aasspass Hi Sab Kuch Hai – Offers, Events Aur Mazedaar Deals!',
            'Aasspass Ki Dunia Ab App Mein – Offers, Events, Prices, Sab Kuch',
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

const HeroSection = () => {
    const [headingIndex, setHeadingIndex] = useState(0);
    const [sublineIndex, setSublineIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const { setUserLocation } = useRole();
    const [isDayTime, setIsDayTime] = useState(true);

useEffect(() => {
    const hour = new Date().getHours();
    setIsDayTime(hour >= 6 && hour < 18);
}, []);

    useEffect(() => {
        const sublineTimer = setInterval(() => {
            setSublineIndex((prev) => (prev + 1) % headings[headingIndex].sublines.length);
        }, 4000);
        return () => clearInterval(sublineTimer);
    }, [headingIndex]);

    useEffect(() => {
        const headingTimer = setInterval(() => {
            setHeadingIndex((prev) => (prev + 1) % headings.length);
            setSublineIndex(0);
        }, 9000);
        return () => clearInterval(headingTimer);
    }, []);

    // Debounced fetchSuggestions
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchTerm.length >= 3) fetchSuggestions(searchTerm);
            else setSuggestions([]);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const fetchSuggestions = async (value) => {
        try {
            const res = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(value)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&autocomplete=true&limit=5`
            );
            const data = await res.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error('Mapbox error:', error);
        }
    };

    const handleSelect = (place) => {
        const [lng, lat] = place.center;
        setSearchTerm(place.place_name);
        setUserLocation({ latitude: lat, longitude: lng });
        setSuggestions([]);
    };

    const handleEnterSearch = async () => {
        const coords = await getCoordinatesFromQuery(searchTerm);
        if (coords) {
            setUserLocation(coords);
            setSuggestions([]);
        } else {
            alert('Location not found.');
        }
    };

    const renderWords = (text) =>
        text.split(' ').map((word, i) => (
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
        <section className="relative w-full  overflow-hidden flex flex-col items-center justify-between py-6">
            <div className="relative z-10 max-w-7xl w-full h-full flex flex-col lg:flex-row items-center px-6 lg:px-10 gap-8">
                {/* LEFT */}
                <motion.div
                    className="w-full lg:w-1/2 flex flex-col"
                    initial={{ x: -100, opacity: 0, rotate: -5 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <div className="flex flex-col gap-4 min-h-[200px] lg:min-h-[240px] ">
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


                    {/* Search Box */}
               {/* Search Box */}
<div className="relative w-full mt-4">
    <span
        onClick={handleEnterSearch}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-yellow-400 p-2 rounded-full z-10 cursor-pointer"
        title="Search"
    >
        <MapPin size={20} color="#fff" />
    </span>

    <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter') handleEnterSearch();
        }}
        onBlur={() => setTimeout(() => setSuggestions([]), 150)}
        placeholder="Search shops, locations..."
        className="w-full pl-4 pr-12 py-3 rounded-full focus:outline-none text-black placeholder-gray-500 shadow-md"
        style={{ border: '2px solid #facc15', backgroundColor: '#fff' }}
    />

    {suggestions.length > 0 && (
        <ul className="absolute z-20 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-md max-h-60 overflow-y-auto">
            {suggestions.map((place) => (
                <li
                    key={place.id}
                    onClick={() => handleSelect(place)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                >
                    {place.place_name}
                </li>
            ))}
        </ul>
    )}
</div>

                </motion.div>

                {/* RIGHT */}
                <motion.div
                    className=" lg:flex lg:w-1/2 h-full items-center justify-center relative"
                    initial={{ x: 100, opacity: 0, rotate: 5 }}
                    animate={{ x: 0, opacity: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                >
                  <Image
    src={isDayTime ? "/Home page Day.jpg" : "/Home Night.jpg"}
    alt="Hero Illustration"
    width={600}
    height={600}
    className="object-contain"
    priority={true}
    
/>
                </motion.div>
            </div>

            {/* <OfferBanner /> */}
        </section>
    );
};

export default HeroSection;
