'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../Button';
import colors from '@/libs/colors';

// Dummy function (replace this with actual auth context or prop)
const useAuth = () => {
    // Replace with actual authentication logic
    const user = null; // or an object like { name: "Juned" } if logged in
    const logout = () => {
        console.log('User logged out'); // Replace with actual logout logic
        // Example: localStorage.clear(); router.push('/');
    };
    return { user, logout };
};

const HeaderClientActions = ({ navLinks }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { user, logout } = useAuth();

    const toggleMenu = () => setOpen(!open);

    const handleAuthAction = () => {
        if (user) {
            logout();
        } else {
            router.push('/Account/user-login');
        }
        setOpen(false);
    };

    return (
        <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Button */}
            <div className="hidden md:flex">
                <Button
                    text={user ? 'Logout' : 'Login'}
                    color={user ? '#e74c3c' : '#265049'}
                    aria-label={user ? 'Logout' : 'Login'}
                    onClick={handleAuthAction}
                />
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden"
                aria-label={open ? 'Close menu' : 'Open menu'}
                title={open ? 'Close menu' : 'Open menu'}
            >
                {open ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
            {open && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 md:hidden border-t"
                    style={{ backgroundColor: colors.background }}
                >
                    <nav className="flex flex-col p-4 gap-4" aria-label="Mobile navigation">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-base font-medium hover:underline"
                                aria-label={link.label}
                                title={link.label}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="mt-4">
                            <Button
                                text={user ? 'Logout' : 'Login'}
                                color={user ? '#e74c3c' : '#265049'}
                                onClick={handleAuthAction}
                            />
                        </div>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default HeaderClientActions;
