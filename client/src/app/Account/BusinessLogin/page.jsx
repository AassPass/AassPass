'use client'
import { BACKEND_AUTH_URL, BACKEND_URL } from "@/app/Utils/backendUrl";
import { useRole } from "@/Context/RoleContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();
    const { setRole, setBusinessId } = useRole();
    const [isSignup, setIsSignup] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(
                `${BACKEND_AUTH_URL}/business/login`,
                { email, password },
                { withCredentials: true }
            );

            setBusinessId(response.data.buisnessId);
            setRole(response.data.role);
            localStorage.setItem('token', response.data.token);
            toast.success("Logged in successfully!");
            router.push('/Admin/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                `${BACKEND_AUTH_URL}/business/register`,
                { email, password },
                { withCredentials: true }
            );

            toast.success("Signup successful! You can now log in.");
            setIsSignup(false);
        } catch (err) {
            console.error(err);
            toast.error("Signup failed. Try a different email.");
        }
    };

    return (
        <form
            onSubmit={isSignup ? handleSignup : handleLogin}
            className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow-md text-black"
        >
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                {isSignup ? "Create an Account" : "Login to Your Account"}
            </h2>

            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
                Email
            </label>
            <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
            />

            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your password"
            />

            {isSignup && (
                <>
                    <label htmlFor="confirmPassword" className="block mb-2 font-medium text-gray-700">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Re-enter your password"
                    />
                </>
            )}

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
            >
                {isSignup ? "Sign Up" : "Login"}
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => setIsSignup(!isSignup)}
                >
                    {isSignup ? "Login here" : "Sign up here"}
                </span>
            </p>
        </form>
    );
}
