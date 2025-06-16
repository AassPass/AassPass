"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/services/auth";
import colors from "@/libs/colors";

export default function VerifyEmailPage() {
    const [message, setMessage] = useState("Verifying your email...");
    const [isError, setIsError] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setMessage("Verification token not found in URL.");
            setIsError(true);
            return;
        }

        const verify = async () => {
            try {
                const msg = await verifyEmail(token);
                setMessage(msg);
                setIsError(false);
                setTimeout(() => {
                    router.push("/");
                }, 2000);
            } catch (err) {
                setMessage(err.message);
                setIsError(true);
            }
        };

        verify();
    }, [token, router]);

    return (
        <div
            className="h-screen flex flex-col gap-6 justify-center items-center"
            style={{ backgroundColor: colors.background }}
        >
            <p className="font-bold text-3xl" style={{ color: colors.primary }}>
                AasPass
            </p>
            <h2
                className="text-center text-lg font-medium"
                style={{ color: isError ? colors.error : colors.success }}
            >
                {message}
            </h2>
        </div>
    );
}
