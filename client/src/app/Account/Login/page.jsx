'use client'
import { BACKEND_AUTH_URL, BACKEND_URL } from "@/app/Utils/backendUrl";
import { useRole } from "@/Context/RoleContext";

import { useRouter } from "next/navigation";


export default function Page() {
    const router = useRouter();
    const { setRole } = useRole();

    const handleLogin = async (e) => {
        e.preventDefault();
        const adminId = e.target.adminId.value;
        const password = e.target.password.value;

        try {
            const res = await fetch(`${BACKEND_AUTH_URL}/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // for sending/receiving cookies
                body: JSON.stringify({ adminId, password }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Login failed');
            }

            const data = await res.json();

            setRole(data.role);
            localStorage.setItem('token', data.token); // Optional, remove if using only cookies

            router.push('/Admin');
        } catch (err) {
            console.error('Login error:', err.message);
            // Optionally display an error message to the user
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}
