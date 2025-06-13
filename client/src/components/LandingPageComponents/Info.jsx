'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const companies = [
    '/logo1.png',
    '/logo2.png',
    '/logo3.png',
    '/logo4.png',
    '/logo5.png',
];

const Info = () => {
    const [logoStyles, setLogoStyles] = useState([]);

    useEffect(() => {
        const styles = companies.map(() => ({
            top: `${Math.random() * 85}%`,
            left: `${Math.random() * 85}%`,
            animationDelay: `${(Math.random() * 4).toFixed(2)}s`,
            animationDuration: `${(6 + Math.random() * 4).toFixed(2)}s`,
        }));
        setLogoStyles(styles);
    }, []);

    if (logoStyles.length !== companies.length) return null;

    return (
        <div className="relative h-[80vh] md:h-screen bg-black w-full flex items-center justify-center overflow-hidden">
            {/* Floating Logos */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {companies.map((logo, index) => (
                    <Image
                        key={index}
                        src={logo}
                        alt=""
                        aria-hidden="true"
                        width={48}
                        height={48}
                        className="absolute opacity-30 animate-float"
                        style={logoStyles[index]}
                        loading="lazy"
                    />
                ))}
            </div>

            {/* Text Reveal */}
            <div className="z-10 text-center space-y-4 text-white">
                <p className="text font-bold text-lg md:text-2xl">500+ users.</p>
                <p className="text font-bold text-lg md:text-2xl">100+ offers.</p>
                <p className="text font-bold text-lg md:text-2xl">100+ deals.</p>
            </div>

            <style jsx>{`
        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .text {
          opacity: 0;
          animation-name: appear;
          animation-duration: 1.5s;
          animation-timing-function: ease-out;
          animation-fill-mode: both;
          animation-timeline: view();
          animation-range: entry 0% cover 40%;
        }

        @keyframes floatRandom {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          25% {
            transform: translate(10px, -10px) scale(1.05);
          }
          50% {
            transform: translate(-10px, 5px) scale(1);
          }
          75% {
            transform: translate(5px, 10px) scale(1.05);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-float {
          animation-name: floatRandom;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default Info;
