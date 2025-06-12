'use client';
import React, { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

import UserRow from './UserRow';

const ROW_HEIGHT = 48;

const UserList = ({ users, setUsers, setEdit, setSelectedUser }) => {
    const { role } = useRole();

    const handleEdit = useCallback((user) => {
        setSelectedUser(user);
        setEdit(true);
    }, [setSelectedUser, setEdit]);

    const handleDelete = useCallback(async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                setUsers(prev => prev.filter(user => user.adminId !== id));
            } else {
                console.error('Failed to delete user.');
            }
        } catch (err) {
            console.error(err);
        }
    }, [setUsers]);


    const Row = ({ index, style }) => (
        <UserRow
            index={index}
            user={users[index]}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            role={role}
            style={style}
        />
    );

    return (
        <div className="max-w-6xl mx-auto bg-white p-4 mt-4 rounded-lg shadow text-black">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">User List</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse text-xs">
                    <thead>
                        <tr className="bg-gray-100 text-left font-medium text-gray-700">
                            <th className="py-2 px-2 border-b">#</th>
                            <th className="py-2 px-2 border-b">Name</th>
                            <th className="py-2 px-2 border-b">Email</th>
                            <th className="py-2 px-2 border-b">Mobile</th>
                            <th className="py-2 px-2 border-b">Active</th>
                            {(hasPermission(role, PERMISSIONS.EDIT_ADMIN) || hasPermission(role, PERMISSIONS.DELETE_ADMIN)) && (
                                <th className="py-2 px-2 border-b text-center">Actions</th>
                            )}
                        </tr>
                    </thead>
                </table>

                {users.length > 0 ? (
                    <div style={{ height: Math.min(users.length, 10) * ROW_HEIGHT, maxHeight: 500 }}>
                        <List
                            height={Math.min(users.length, 10) * ROW_HEIGHT}
                            itemCount={users.length}
                            itemSize={ROW_HEIGHT}
                            width="100%"
                        >
                            {Row}
                        </List>
                    </div>
                ) : (
                    <p className="py-4 text-center text-gray-500">No users found.</p>
                )}
            </div>
        </div>
    );
};

export default UserList;
