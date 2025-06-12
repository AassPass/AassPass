'use client'
import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";
import { useRole } from "@/Context/RoleContext";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Page() {
    const router = useRouter();
    const { setRole, setBusinessId } = useRole();
    const [isSignup, setIsSignup] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        

        try {
            const res = await fetch(`${BACKEND_AUTH_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await res.json();

            setBusinessId(data.buisnessId);
            setRole(data.role);
            localStorage.setItem('token', data.token);

            router.push('/Admin/dashboard');
        } catch (err) {
            console.error(err);

        }
    };


    const handleSignup = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const name = e.target.name.value;

        if (password !== confirmPassword) {
            console.error("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_AUTH_URL}/user/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password, name }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message || 'Signup failed');
            }


            setIsSignup(false);
        } catch (err) {
            console.error(err);

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
            <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                Name
            </label>
            <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
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
