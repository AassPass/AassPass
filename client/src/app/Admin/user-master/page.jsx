'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { BACKEND_URL } from '@/app/Utils/backendUrl';


// Lazy loading
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

                
                const result = await response.json();
                console.log(result);
                setUsers(result.data);
            } catch (error) {
                console.error('Failed to load users.', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="flex flex-col gap-6 md:px-4 py-6 w-full max-w-7xl mx-auto">
            {/* Add User Form */}
            <div className="w-full bg-white rounded-lg shadow-md p-4">
                <AddUsers
                    edit={edit}
                    users={users}
                    setUsers={setUsers}
                    setEdit={setEdit}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                />
            </div>

            {/* User List */}
            <div className="w-full bg-white rounded-lg text-black shadow-lg md:p-4">
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
