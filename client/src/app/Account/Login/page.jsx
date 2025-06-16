'use client'


import { useRole } from "@/Context/RoleContext";
import colors from "@/libs/colors";
import { loginAdmin } from "@/services/auth";
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
            const data = await loginAdmin({ adminId, password }); // ✅ Reuse logic
            setRole(data.role);
            localStorage.setItem("token", data.token);
            router.push("/Admin");
        } catch (err) {
            alert(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex h-screen justify-center items-center"
            style={{ backgroundColor: colors.background }}
        >
            <form
                onSubmit={handleLogin}
                className="p-8 rounded shadow-md w-[350px]"
                style={{ backgroundColor: colors.background, color: colors.text }}
            >
                <h2
                    className="text-2xl font-semibold mb-6 text-center"
                    style={{ color: colors.text }}
                >
                    Admin Login
                </h2>

                <label
                    htmlFor="adminId"
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                >
                    Admin ID
                </label>
                <input
                    id="adminId"
                    name="adminId"
                    type="text"
                    required
                    className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2"
                    style={{
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                    }}
                    placeholder="ADM-000AAA"
                />

                <label
                    htmlFor="password"
                    className="block mb-2 font-medium"
                    style={{ color: colors.text }}
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2"
                    style={{
                        backgroundColor: colors.inputBackground,
                        color: colors.text,
                    }}
                    placeholder="Enter your password"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-semibold py-2 rounded transition-colors flex items-center justify-center"
                    style={{
                        backgroundColor: colors.primary,
                        color: colors.buttonText,
                    }}
                >
                    {loading ? (
                        <svg
                            className="animate-spin h-5 w-5"
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
                        "Login"
                    )}
                </button>
            </form>
        </div>

    );
}
