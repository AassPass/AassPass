"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useRole } from "@/Context/RoleContext";
import colors from "@/libs/colors";
import { loginUser, signupUser } from "@/services/auth";
import { showToast } from "@/Utils/toastUtil";

export default function Page() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const { setRole, setBusinessId } = useRole();
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Add this helper function above validateSignup:
const validateStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  return strongPasswordRegex.test(password);
};
 const validateSignup = ({ name, email, password, confirmPassword }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!validateEmail(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  } else if (!validateStrongPassword(password)) {
    errors.password =
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character";
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

  const validateLogin = ({ email, password }) => {
    const errors = {};

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(email)) {
      errors.email = "Invalid email format";
    }

    if (!password.trim()) {
      errors.password = "Password is required";
    }

    return errors;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    const validationErrors = validateLogin({ email, password });

    // Mark fields touched on submit
    setTouched({ email: true, password: true });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const data = await loginUser({ email, password });

      setBusinessId(data.businessId);
      setRole(data.role);
      localStorage.setItem("token", data.token);
      showToast("Login successful!", "success");
      router.push("/");
    } catch (err) {
      if (
        err.message ===
        "Verify your email first. Check your Inbox or spam folder."
      ) {
        showToast(err.message, "warning");
      } else {
        showToast("Login failed. Please check your credentials.", "error");
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

    const validationErrors = validateSignup({ name, email, password, confirmPassword });

    // Mark all signup fields touched on submit
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      await signupUser({ email, password, name });
      showToast("Signup successful. Please verify your email.", "success");
      setShowVerificationMessage(true);
      setIsSignup(false);
    } catch (err) {
      showToast(err.message || "Signup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex h-screen justify-center px-4 shadow-lg items-center bg-gray-100 relative"
      style={{
        backgroundImage: `url('/Registration Page.jpeg')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      {showVerificationMessage && (
        <div className="absolute top-8 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-md max-w-md w-full text-center">
          Signup successful! Please check your email to verify your account before
          logging in.
        </div>
      )}
      <form
        noValidate
        key={isSignup ? "signup" : "login"} // This forces React to remount the form when mode changes
        onSubmit={isSignup ? handleSignup : handleLogin}
        className="w-full max-w-md p-4 rounded shadow-md"
        style={{ backgroundColor: colors.background, color: colors.text }}
      >
        <h2
          className="text-2xl font-semibold mb-3 text-center"
          style={{ color: colors.primary }}
        >
          {isSignup ? "Create an Account" : "Login"}
        </h2>

        {isSignup && (
          <>
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              onBlur={handleBlur}
              className="w-full px-4 py-2 mb-1 rounded border focus:outline-none"
              placeholder="Enter your name"
            />
            <p
  className="text-red-500 text-sm "
  style={{ visibility: errors.name && touched.name ? "visible" : "hidden" }}
>
  {errors.name || "\u00A0"}
</p>
          </>
        )}

        <label htmlFor="email" className="block mb-1 font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          onBlur={handleBlur}
          className="w-full px-4 py-2 mb-1 rounded border focus:outline-none"
          placeholder="you@example.com"
        />
     <p
  className="text-red-500 text-sm"
  style={{ visibility: errors.email && touched.email ? "visible" : "hidden" }}
>
  {errors.email || "\u00A0"}
</p>

        <label htmlFor="password" className="block mb-1 font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          onBlur={handleBlur}
          className="w-full px-4 py-2 mb-1 rounded border focus:outline-none"
          placeholder="Enter your password"
        />
       <p
  className="text-red-500 text-sm "
  style={{ visibility: errors.password && touched.password ? "visible" : "hidden" }}
>
  {errors.password || "\u00A0"}
</p>

        {isSignup && (
          <>
            <label htmlFor="confirmPassword" className="block mb-1 font-medium">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              onBlur={handleBlur}
              className="w-full px-4 py-2 mb-1 rounded border focus:outline-none"
              placeholder="Re-enter your password"
            />
           <p
  className="text-red-500 text-sm "
  style={{ visibility: errors.confirmPassword && touched.confirmPassword ? "visible" : "hidden" }}
>
  {errors.confirmPassword || "\u00A0"}
</p>
          </>
        )}

       <button
  type="submit"
  disabled={loading}
  className="w-full font-semibold py-2 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
  style={{
    backgroundColor: colors.primary,
  }}
>
  {loading && (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
  )}
  {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
</button>


        <p className="mt-4 text-center text-sm">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <span
            className="cursor-pointer hover:underline"
            style={{ color: colors.primaryText }}
            onClick={() => {
              setIsSignup(!isSignup);
              setErrors({});
              setShowVerificationMessage(false);
              setTouched({});
            }}
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
