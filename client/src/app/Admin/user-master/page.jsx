'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';


import { BACKEND_URL } from '@/app/Utils/backendUrl';

// Dynamically import components with loading fallbacks
const AddUsers = dynamic(() => import('./Components/AddUsers'), {
    loading: () => <p className="p-4">Loading Add User Form...</p>,
    ssr: false,
});

const UserList = dynamic(() => import('./Components/UserList'), {
    loading: () => <p className="p-4">Loading User List...</p>,
    ssr: false,
});

export default function UserMaster() {
    const [edit, setEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No authentication token found.');
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/admins`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const result = await response.json();
                setUsers(result.data);
            } catch (error) {
                console.error('Failed to load users.', error);
            }
        };

        fetchUsers();
    }, []);


    return (
        <div className="flex w-full min-h-screen flex-col lg:flex-row gap-4">
            {/* Add User Form (Left Side) */}
            <div className="w-full lg:w-1/3 bg-white">
                <AddUsers
                    edit={edit}
                    users={users}
                    setUsers={setUsers}
                    setEdit={setEdit}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </div>

            {/* User List (Right Side) */}
            <div className="w-full lg:w-2/3 bg-white">
                <UserList
                    users={users}
                    setUsers={setUsers}
                    edit={edit}
                    setEdit={setEdit}
                    setSelectedUser={setSelectedUser}
                />
            </div>
        </div>
    );
}
