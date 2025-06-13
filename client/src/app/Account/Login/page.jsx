'use client'

import { BACKEND_AUTH_URL } from "@/app/Utils/backendUrl";
import { useRole } from "@/Context/RoleContext";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Page() {
    const router = useRouter();
    const { setRole } = useRole();
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        const adminId = e.target.adminId.value;
        const password = e.target.password.value;

        try {
            const res = await fetch(`${BACKEND_AUTH_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ adminId, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();
            setRole(data.role);
            localStorage.setItem('token', data.token);

            router.push('/Admin');
        } catch (err) {
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen justify-center items-center">
            <form
                onSubmit={handleLogin}
                className="p-8 bg-white rounded shadow-md text-black"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Admin Login
                </h2>

                <label htmlFor="adminId" className="block mb-2 font-medium text-gray-700">
                    Admin ID
                </label>
                <input
                    id="adminId"
                    name="adminId"
                    type="text"
                    required
                    className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="ADM-000AAA"
                />

                <label htmlFor="password" className="block mb-2 font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors flex items-center justify-center"
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
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
                                d="M4 12a8 8 0 018-8v8z"
                            ></path>
                        </svg>
                    ) : (
                        'Login'
                    )}
                </button>
            </form>
        </div>
    );
}
