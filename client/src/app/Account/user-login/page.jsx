"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useRole } from "@/Context/RoleContext";
import colors from "@/libs/colors";
import { loginUser, signupUser } from "@/services/auth";

export default function Page() {
  const router = useRouter();
  const { setRole, setBusinessId } = useRole();

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) return;

    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      setBusinessId(data.businessId);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      console.log(data.role)
      router.push("/Admin");
    } catch (err) {
      // Check for email verification error
      if (err.message === "Verify your email first. Check your Inbox or spam folder.") {
        alert(err.message);
      } else {
        console.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };


  const handleSignup = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();
    const confirmPassword = e.target.confirmPassword.value.trim();

    if (!name || !email || !password || !confirmPassword) return;
    if (password !== confirmPassword) return;

    setLoading(true);
    try {
      await signupUser({ email, password, name });
      setIsSignup(false);
    } catch (err) {
      console.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex  h-screen justify-center px-4 items-center bg-gray-100 relative">
      <form
        onSubmit={isSignup ? handleSignup : handleLogin}
        className="w-full max-w-md p-8 rounded shadow-md"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{ color: colors.primary }}
        >
          {isSignup ? "Create an Account" : "Login"}
        </h2>

        {isSignup && (
          <>
            <label htmlFor="name" className="block mb-2 font-medium">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-2 mb-2 rounded border focus:outline-none focus:ring-2"

              placeholder="Enter your name"
            />
          </>
        )}

        <label htmlFor="email" className="block mb-2 font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-4 py-2 mb-2 rounded border focus:outline-none focus:ring-2"

          placeholder="you@example.com"
        />

        <label htmlFor="password" className="block mb-2 font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-4 py-2 mb-2 rounded border focus:outline-none focus:ring-2"

          placeholder="Enter your password"
        />

        {isSignup && (
          <>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="w-full px-4 py-2 mb-3 border rounded focus:outline-none focus:ring-2"

              placeholder="Re-enter your password"
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-semibold py-2 rounded transition-colors disabled:opacity-60"
          style={{
            backgroundColor: colors.primary,

          }}
        >
          {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
        </button>

        <p className="mt-4 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: colors.primaryText }}
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login here" : "Sign up here"}
          </span>
        </p>
        <p className="mt-4 text-center text-sm">
          <Link
            href="/Account/forget-password"
            className="hover:underline"
            style={{ color: colors.link }}
          >
            Forgot Password?
          </Link>
        </p>
      </form>
    </div>
  );
}
