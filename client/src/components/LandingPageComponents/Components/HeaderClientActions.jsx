'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../Button';
import colors from '@/libs/colors';
import { useRole } from '@/Context/RoleContext';

const HeaderClientActions = ({ navLinks }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { role, logout } = useRole();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Detect login state
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            setIsLoggedIn(!!token);
        };

        handleStorageChange(); // run once on mount
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);


    const toggleMenu = () => setOpen(!open);

    const handleAuthAction = () => {
        if (isLoggedIn) {
            logout();
            router.push('/Account/user-login'); // redirect to login after logout
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
                    text={isLoggedIn ? 'Logout' : 'Login'}
                    color={isLoggedIn ? '#e74c3c' : '#265049'}
                    aria-label={isLoggedIn ? 'Logout' : 'Login'}
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
                <div
                    className="absolute top-full left-0 w-full bg-white shadow-lg z-50 md:hidden border-t"
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
                                text={isLoggedIn ? 'Logout' : 'Login'}
                                color={isLoggedIn ? '#e74c3c' : '#265049'}
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