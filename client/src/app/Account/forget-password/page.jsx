"use client";

import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgetPassword() {
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
        router.push("/");
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
    <div
      className="flex justify-center items-center text-black"
      style={{ height: "100dvh" }}
    >
      {/* Card */}
      <div className="p-8 rounded-lg shadow-lg w-full max-w-[320px] bg-white">
        {/* <div className="text-3xl font-semibold mb-6 text-center text-gray-800">
          AasPass
        </div> */}
        <div className="text-2xl font-semibold mb-6 text-center text-gray-800">
          Forgot Password
        </div>
        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}
        {success && <p className="text-sm text-center mb-3">{success}</p>}

        {step === 1 && (
          <>
            <label className="block mb-2 font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-200"
              required
            />
            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Send OTP"
              )}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label className="block mb-2 font-medium text-gray-700">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-200"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">New Password</label>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-200"
              required
            />

            <label className="block mb-2 font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-200"
              required
            />

            <button
              onClick={verifyOtpAndResetPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Reset Password"
              )}
            </button>
          </>
        )}
            <p className="mt-4 text-center text-sm text-gray-600">
              Remember Password.
              <Link
                href={"/Account/user-login"}
                className="text-blue-600 cursor-pointer hover:underline"
              >
              {" Login"}
              </Link>
              ?
            </p>
      </div>
    </div>
  );
}
