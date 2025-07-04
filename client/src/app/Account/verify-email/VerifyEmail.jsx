"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { BACKEND_AUTH_URL } from "@/Utils/backendUrl";


function VerifyEmailPage() { // Renamed for clarity, but 'page' is fine too
    const [message, setMessage] = useState("Verifying your email...");
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
             setMessage("Verification token not found in URL.");
             // Optionally redirect or show a permanent error
             return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(`${BACKEND_AUTH_URL}/verify-email`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to verify email.");
                }

                setMessage(data.message || "Email verified successfully!");

                setTimeout(() => {
                    router.push("/");
                }, 2000); // 2-second delay
            } catch (error) {
                setMessage(error.message || "An error occurred while verifying the email.");
            }
        };


        verifyEmail();
    }, [token, router]); // Add router to dependency array as it's used inside

    return (
        <div className="h-screen flex flex-col gap-6 justify-center items-center">
            <p className="font-bold text-3xl">AasPass</p>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmailPage; // Use the updated name