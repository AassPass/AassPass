'use client'
import { BACKEND_AUTH_URL, BACKEND_URL } from "@/app/Utils/backendUrl";
import { useRole } from "@/Context/RoleContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function Page() {
    const router = useRouter();
    const { setRole } = useRole();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const response = await axios.post(
                `${BACKEND_AUTH_URL}/admin/login`,
                { email, password },
                { withCredentials: true } // important for cookie
            );

            setRole(response.data.role)
            // await fetchUser(); // set user in context
            localStorage.setItem('token', response.data.token);
            toast.success("Logged in successfully!");
            router.push('/Admin/dashboard');
        } catch (err) {
            console.error(err);
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <>

            <form
                onSubmit={handleLogin}
                className="max-w-md mx-auto mt-20 p-8 bg-white rounded shadow-md text-black"
            >
                <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
                    Login to Your Account
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
        </>
    );
}
