'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './Button';

const Header = () => {
    const router = useRouter();

    return (
        <div className="p-4 md:p-4 lg:px-8 flex justify-between items-center w-full">
            <div className="flex gap-4 md:gap-10 items-center justify-center">
                <div className="text-lg font-bold">Asspass</div>

                <nav>
                    <ul className="flex gap-4 text-sm md:text-md lg:text-lg font-semibold">
                        <li className="cursor-pointer">MAP</li>
                        <li className="cursor-pointer">Deals</li>
                        <li className="cursor-pointer">About us</li>
                        <li className="cursor-pointer">Contact us</li>
                    </ul>
                </nav>
            </div>

            <div className="md:gap-2 flex">
                <Button
                    text="Sign up"
                    color="#2ecc71"
                    onClick={() => router.push('/Account/user-login')}
                />
                <Button
                    text="Log in"
                    color="#265049"
                    onClick={() => router.push('/Account/user-login')}
                />
            </div>
        </div>
    );
};

export default Header;
