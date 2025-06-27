'use client';

import Link from 'next/link';
import Image from 'next/image';
import HeaderClientActions from './Components/HeaderClientActions';
import colors from '@/libs/colors';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/#lokaly-map', label: 'Lokaly Map' },
    { href: '/Account/user-login', label: 'Register Your Business' },
    { href: '/ads-plan', label: 'Ads Plan' },
    { href: '/about-us', label: 'About Us' },
    { href: '/#faq', label: 'FAQ' },
];

export default function Header() {
    return (
        <header
            className="sticky top-0 left-0 w-full z-50 shadow"
            role="banner"
            style={{ backgroundColor: colors.background, color: colors.text }}
        >
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 flex justify-between items-center py-4">
                {/* Left: Logo + Brand */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        aria-label="Aasspass Home"
                        className="block w-[60px] h-[60px] relative"
                    >
                        <Image
                            src="/logo.png"
                            alt="Aasspass Logo"
                            fill
                            style={{ objectFit: 'contain' }}
                            priority
                            sizes="(max-width: 768px) 300px, 240px"
                        />
                    </Link>
                    <div className="flex flex-col">
                        <h1 className="text-xl font-extrabold" style={{ color: colors.primary }}>
                            AassPass
                        </h1>
                        <p className="text-sm -mt-2" style={{ color: colors.secondaryText }}>
                            search kra kiya
                        </p>
                    </div>
                </div>

                {/* Right: Navigation + Login */}
                <div className="flex items-center gap-6">
                    <nav
                        className="hidden md:flex gap-6 text-sm lg:text-base font-light relative"
                        aria-label="Main navigation"
                    >
                        {/* Home */}
                        <Link
                            href="/"
                            className="group relative"
                            style={{ color: colors.primary }}
                        >
                            Home
                            <span
                                className="absolute left-0 -bottom-1 h-[3px] w-0 bg-current transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: colors.secondaryText }}
                            ></span>
                        </Link>

                        {/* Lokaly Map */}
                        <Link
                            href="/#lokaly-map"
                            className="group relative"
                            style={{ color: colors.primary }}
                        >
                            Lokaly Map
                            <span
                                className="absolute left-0 -bottom-1 h-[3px] w-0 bg-current transition-all duration-300 group-hover:w-full"
                                style={{ backgroundColor: colors.secondaryText }}
                            ></span>
                        </Link>

                        {/* For Business Dropdown */}
                        <div className="group relative">
                            <span className="cursor-pointer" style={{ color: colors.primary }}>
                                For Business
                            </span>
                            <div
                                className="absolute hidden group-hover:block top-full mt-2 bg-white shadow-lg rounded-md min-w-[180px] border"
                                style={{ zIndex: 1000 }}
                            >
                                <Link
                                    href="/Account/user-login"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    style={{ color: colors.primary }}
                                >
                                    Register Your Business
                                </Link>
                                <Link
                                    href="/ads-plan"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    style={{ color: colors.primary }}
                                >
                                    Ads Plan
                                </Link>
                            </div>
                        </div>

                        {/* About Dropdown */}
                        <div className="group relative">
                            <span className="cursor-pointer" style={{ color: colors.primary }}>
                                About
                            </span>
                            <div
                                className="absolute hidden group-hover:block top-full mt-2 bg-white shadow-lg rounded-md min-w-[150px] border"
                                style={{ zIndex: 1000 }}
                            >
                                <Link
                                    href="/about-us"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    style={{ color: colors.primary }}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/#faq"
                                    className="block px-4 py-2 text-sm hover:bg-gray-100"
                                    style={{ color: colors.primary }}
                                >
                                    FAQ
                                </Link>
                            </div>
                        </div>
                    </nav>

                    {/* ✅ Pass navLinks to client actions */}
                    <HeaderClientActions navLinks={navLinks} />
                </div>
            </div>
        </header>
    );
}
