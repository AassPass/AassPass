"use client";

import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";
import colors from "@/libs/colors";
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
    <div className="flex justify-center items-center h-screen px-4 bg-gray-100">
      <div
        className="p-8 w-full max-w-md rounded shadow-md"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: colors.primaryText }}
        >
          Forgot Password
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}
        {success && (
          <p className="text-green-600 text-sm text-center mb-3">{success}</p>
        )}

        {step === 1 && (
          <>
            <label htmlFor="email" className="block mb-2 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2"
            />
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full py-2 font-semibold text-white rounded transition-colors disabled:opacity-60"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <label htmlFor="otp" className="block mb-2 font-medium">
              Enter OTP
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2"
            />

            <label htmlFor="newPassword" className="block mb-2 font-medium">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              required
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2"
            />

            <label htmlFor="confirmPassword" className="block mb-2 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2"
            />

            <button
              onClick={verifyOtpAndResetPassword}
              disabled={loading}
              className="w-full py-2 font-semibold text-white rounded transition-colors disabled:opacity-60"
              style={{ backgroundColor: colors.primary }}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}

        <p className="mt-4 text-center text-sm">
          Remember your password?
          <Link
            href="/Account/user-login"
            className="hover:underline ml-1"
            style={{ color: colors.link }}
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
