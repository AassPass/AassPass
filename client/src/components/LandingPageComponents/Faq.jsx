'use client';

import React, { useState } from 'react';

const Faq = () => {
    const userFaqs = [
        {
            q: "What is Lokaly Map?",
            a: "Lokaly Map is a real-time, hyperlocal discovery tool by AassPass. It helps you find nearby deals, offers, and verified local businesses — from cafés and salons to gyms and retail stores — all mapped for your convenience.",
        },
        {
            q: "How does Lokaly Map work?",
            a: "Just open Lokaly Map on the AassPass platform. You’ll see pins for nearby verified businesses offering real-time deals and services based on your location.",
        },
        {
            q: "Do I need to sign up to use Lokaly Map?",
            a: "No sign-up is needed to browse. But creating an account unlocks features like saved locations, personalized offers, and faster support.",
        },
        {
            q: "Are deals shown in real-time?",
            a: "Yes. Lokaly Map shows live hyperlocal deals and updates from businesses in your area, including flash discounts and limited-time services.",
        },
        {
            q: "How do I contact or book a service?",
            a: "Each business profile has quick actions like call, WhatsApp, or online booking if available.",
        },
    ];

    const businessFaqs = [
        {
            q: "What is AassPass for Businesses?",
            a: "AassPass for Businesses is a smart platform for local business owners to register, verify, and promote their services on the Lokaly Map — reaching real users in real time.",
        },
        {
            q: "How do I register my business on AassPass?",
            a: "Go to the “Register Your Business” section on the AassPass platform. Fill in your details, and our team will verify and activate your listing.",
        },
        {
            q: "What do I get as a listed business?",
            a: "• A verified spot on Lokaly Map\n• Ability to post real-time offers\n• Increased visibility in your area\n• Direct customer contacts (calls/WhatsApp/bookings)",
        },
        {
            q: "Is there a cost to list my business?",
            a: "Listing is free in the early access phase. Premium features (like featured pins, analytics, or priority placement) will be introduced soon.",
        },
        {
            q: "How can I update my business details or offers?",
            a: "Once registered, you’ll get access to your business dashboard to update your profile, deals, working hours, and contact options anytime.",
        },
    ];

    const FaqBlock = (title, faqs, color, indexOffset = 0) => {
        const [openIndex, setOpenIndex] = useState(null);

        const toggleIndex = (index) => {
            setOpenIndex(openIndex === index ? null : index);
        };

        return (
            <div className="w-full md:w-1/2 px-2">
                <h2 className={`text-lg font-semibold mb-4 ${color}`}>{title}</h2>
                {faqs.map((item, i) => {
                    const isOpen = openIndex === i;
                    return (
                        <div key={i} className="border rounded-lg bg-white shadow mb-3 overflow-hidden transition-all">
                            <button
                                onClick={() => toggleIndex(i)}
                                className="w-full flex justify-between items-center px-5 py-3 font-medium text-left text-gray-800 hover:bg-gray-100 transition-colors"
                            >
                                <span>{i + 1 + indexOffset}. {item.q}</span>
                                <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                            </button>
                            <div
                                className={`px-5 pt-0 pb-3 text-sm text-gray-700 whitespace-pre-line leading-relaxed transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                                    } overflow-hidden`}
                            >
                                {item.a}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div id="faq" className="w-full px-4 py-10 flex justify-center bg-gray-50 min-h-screen">
            <div className="w-full max-w-6xl">
                <h1 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h1>
                <div className="flex flex-col md:flex-row gap-6">
                    {FaqBlock("For Users – Lokaly Map", userFaqs, "text-blue-700", 0)}
                    {FaqBlock("For Business Owners – AassPass for Businesses", businessFaqs, "text-green-700", userFaqs.length)}
                </div>
            </div>
        </div>
    );
};

export default Faq;
