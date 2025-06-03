'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import AddUsers from './Components/AddUsers';
import UserList from './Components/UserList';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

export default function UserMaster() {
    const [edit, setEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const token = localStorage.getItem('token'); // 🔐 Fetch token from localStorage

            if (!token) {
                toast.error('No authentication token found.');
                return;
            }

            try {
                const response = await axios.get(`${BACKEND_URL}/admin`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // ✅ Send token in Authorization header
                    },
                });

                setUsers(response.data);
                toast.success('Users loaded successfully!');
            } catch (error) {
                console.error('Error fetching users:', error);
                toast.error('Failed to load users.');
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="p-6 space-y-8">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Add User Form */}
            <AddUsers
                edit={edit}
                setEdit={setEdit}
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
            />

            {/* User List */}
            <UserList
                users={users}
                setUsers={setUsers}
                edit={edit}
                setEdit={setEdit}
                setSelectedUser={setSelectedUser}
            />
        </div>
    );
}