"use client";

import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";
import { useRouter } from 'next/navigation';
import { useState } from "react";

export default function ForgetPassword(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState(1);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async () => {
        setLoading(true);
        setError("");
        try {
        const response = await fetch(`${BACKEND_AUTH_URL}/user/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        console.log(response);
        if (response.ok) {
            setSuccess("OTP sent successfully!");
            setStep(2);
        } else {
            setError("Failed to send OTP. Try again.");
        }
        } catch (error) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtpAndResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await fetch(`${BACKEND_AUTH_URL}/user/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            if (response.ok) {
                setSuccess("Password changed successfully!");
                router.push("/")
                // setTimeout(() => router.push("/"), 2000);
            } else {
                setError("Failed to reset password. Try again.");
            }
        } catch (error) {
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
    <div className="flex flex-col" style={{ height: "100dvh" }}>
      {/* <Navbar /> */}
      <div
        className="flex-1 flex flex-col items-center justify-center overflow-auto px-4"
      >
       <div
                 className="flex gap-5 items-center text-3xl font-bold mb-6"
               >
               {/* <Image src={shortLogo} alt="RestroGram" height={50}></Image> */}
                 AasPass
               </div>

        {/* Card */}
        <div
          className="p-6 rounded-lg shadow-lg w-full max-w-[320px]"
        >
            <div
            className="text-3xl font-bold mb-6 text-center"
            >
            Forgot Password
            </div>
          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}
          {success && <p className="text-sm text-center mb-3">{success}</p>}

          {step === 1 && (
            <>
              <label
                className="block mb-2"
              >
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded-md focus:outline-none"
                required
              />
              <button
                onClick={sendOtp}
                className="w-full font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  ></div>
                ) : (
                  "Send OTP"
                )}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label
                className="block mb-2"
              >
                Enter OTP
              </label>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded-md focus:outline-none"
                required
              />

              <label
                className="block mb-2"
              >
                New Password
              </label>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded-md focus:outline-none"
                required
              />

              <label
                className="block mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 mb-4 rounded-md focus:outline-none"
                required
              />

              <button
                onClick={verifyOtpAndResetPassword}
                className="w-full font-bold py-2 rounded-md transition disabled:opacity-50 flex justify-center items-center"
                disabled={loading}
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                  ></div>
                ) : (
                  "Reset Password"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}