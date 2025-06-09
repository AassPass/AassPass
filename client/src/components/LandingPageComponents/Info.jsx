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
        const styles = companies.map(() => {
            return {
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 90}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${4 + Math.random() * 10}s`,
            };
        });
        setLogoStyles(styles);
    }, []);

    if (logoStyles.length === 0) return null; // Wait for client

    return (
        <div className="relative min-h-screen bg-black w-full flex items-center justify-center">
            {/* Floating Logos */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                {companies.map((logo, index) => (
                    <Image
                        key={index}
                        src={logo}
                        alt={`Company ${index}`}
                        width={48}
                        height={48}
                        className="absolute opacity-30 animate-float"
                        style={{
                            ...logoStyles[index],
                        }}
                    />
                ))}
            </div>

            {/* Text Reveal */}
            <div className="view absolute text-center flex flex-col items-center justify-center space-y-4 text-white">
                <div className="text font-bold">500+ users.</div>
                <div className="text font-bold">100+ offers.</div>
                <div className="text font-bold">100+ Deals.</div>
            </div>

            <style jsx>{`
                @keyframes appear {
                    from {
                        opacity: 0;
                        transform: translateY(500px) scale(0.8);
                        font-size: 0rem;
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                        font-size: 3rem;
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
                        transform: translate(10px, -10px) scale(1.1);
                    }
                    50% {
                        transform: translate(-15px, 5px) scale(1);
                    }
                    75% {
                        transform: translate(5px, 15px) scale(1.05);
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
