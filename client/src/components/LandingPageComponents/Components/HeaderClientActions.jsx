'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../Button';
import colors from '@/libs/colors';
import { useRole } from '@/Context/RoleContext';
import { FaUser } from 'react-icons/fa'; // Import Profile Icon

const HeaderClientActions = ({ navLinks }) => {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const { role, logout } = useRole();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

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
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

   const handleAuthAction = () => {
  if (isLoggedIn) {
    logout(); // Clears token and other values
    setIsLoggedIn(false);         // ✅ manually update state
    setDropdownOpen(false);       // ✅ close dropdown
    setOpen(false);               // ✅ close mobile menu if open
    router.push('/');             // ✅ redirect
  } else {
    setDropdownOpen(false);
    router.push('/Account/user-login');
  }
};

    return (
        <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop Button or Profile Icon */}
            <div className="hidden md:flex items-center gap-4">
                {/* If logged in, show Profile Icon and Dropdown */}
                {isLoggedIn ? (
                    <div className="relative">
                        {/* Profile Icon */}
                        <button onClick={toggleDropdown} className=" cursor-pointer text-2xl">
                            <FaUser />
                        </button>

                        {/* Dropdown Menu for Login/Logout */}
                        {dropdownOpen && (
                            <div
                                className="absolute top-10 right-0 bg-white shadow-md rounded-md w-40 border z-50"
                                style={{ backgroundColor: colors.background }}
                            >
                                <Link
                                    href="/Admin"
                                    className="block cursor-pointer px-4 py-2 text-sm text-primary hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleAuthAction}
                                    className="block px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                     <div className="relative">
                        {/* Profile Icon */}
                        <button onClick={toggleDropdown} className=" cursor-pointer text-2xl">
                            <FaUser />
                        </button>

                        {/* Dropdown Menu for Login/Logout */}
                        {dropdownOpen && (
                            <div
                                className="absolute top-10 right-0 bg-white shadow-md rounded-md w-40 border z-50"
                                style={{ backgroundColor: colors.background }}
                            >
                              
                                <button
                                    onClick={handleAuthAction}
                                    className="block px-4 py-2 cursor-pointer text-sm text-red-500 hover:bg-gray-100 w-full text-left"
                                >
                                    Login
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Mobile Toggle Button */}
            <button
                onClick={toggleMenu}
                className="md:hidden cursor-pointer"
                aria-label={open ? 'Close menu' : 'Open menu'}
                title={open ? 'Close menu' : 'Open menu'}
            >
                {open ? <X size={28} /> : <Menu size={28} />}
            </button>

            {/* Mobile Menu */}
             {open && (
                <div
                    className="absolute  top-full left-0 w-full bg-white shadow-lg z-50 md:hidden border-t"
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

                        {/* Conditionally render Admin link if logged in and user is an admin */}
                        {isLoggedIn && (
                            <Link
                                href="/Account/admin"
                                className="text-base font-medium hover:underline"
                                aria-label="Profile"
                                onClick={() => setOpen(false)}
                            >
                                Profile
                            </Link>
                        )}

                        <div className="mt-4">
                            {/* Mobile Login or Logout Button */}
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
