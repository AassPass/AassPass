"use client";

import { useState, useEffect } from "react";
import { BACKEND_USER_URL } from "../../Utils/backendUrl";

const page = () => {
    const [userData, setUserData] = useState({
        id: '00',
        name: "dkfd",
        email: "sdfh@mail.com",
        password: 'dkfjbaiudfhaiudgfgsdf',
        mobile: "2039559334"
    });
    const [loading, setLoading] = useState(true);
    
    async function fetchUserData(){
        const token = localStorage.getItem('token');
        // console.log("token:", token);
        try{
            const response = await fetch(`${BACKEND_USER_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await response.json();
            // console.log(data.user);
            if(response.ok){
                setUserData(data.user);
                setLoading(false);
            } else{
                console.error(`Error fetching user data: ${response.status}`);
            }
        } catch (error){
            console.error("Error fetching user data:", error);
        }
    }
    useEffect(()=> {
        fetchUserData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white shadow-lg text-black rounded-2xl p-6 border border-gray-200">
                {loading? "loading...":
                <>

                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {userData.name} 👋</h1>
                    <p className="text-sm text-gray-500 mb-6">Here’s your profile information</p>

                    <div className="space-y-4">
                    <div>
                        <label className="text-gray-500 text-sm">User ID</label>
                        <p className="text-gray-800 font-medium break-words">{userData.id}</p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">Email</label>
                        <p className="text-gray-800 font-medium">{userData.email}</p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">Mobile</label>
                        <p className="text-gray-800 font-medium">{userData.mobile}</p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">Email Verified</label>
                        <p className={`font-medium ${userData.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                        {userData.emailVerified ? 'Yes ✅' : 'No ❌'}
                        </p>
                    </div>

                    <div>
                        <label className="text-gray-500 text-sm">Role</label>
                        <p className="text-indigo-600 font-semibold">{userData.role}</p>
                    </div>
                    </div>

                    <hr className="my-6 text-gray-400" />
                    <p className="text-xs text-gray-400 text-center">Hello</p>
                </>
                }
            </div>
        </div>
    )
}

export default page;