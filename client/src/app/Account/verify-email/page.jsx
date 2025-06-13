"use client";

import { Suspense } from "react";
import VerifyEmailPage from "./VerifyEmail";

function VerifyEntry() { 
    return (
        <Suspense>
            <VerifyEmailPage/>
        </Suspense>
    );
};

export default VerifyEntry; 