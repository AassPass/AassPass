'use client';

import React, { useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { Pencil, Trash2 } from 'lucide-react'; // Optional: icons for buttons


const ROW_HEIGHT = 56;

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

            if (response.status === "201" || response.status === "200") {
                setUsers(prev => prev.filter(user => user.adminId !== id));
            } else {
                console.error('Failed to delete user.');
            }
        } catch (err) {
            console.error(err);
        }
    }, [setUsers]);

    const Row = ({ index, style }) => {
        const user = users[index];
        const isEven = index % 2 === 0;

        return (
            <div
                role="row"
                aria-rowindex={index + 2}
                style={style}
                className={`grid grid-cols-6 sm:grid-cols-6 md:grid-cols-6 text-sm items-center px-4 border-b ${isEven ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                tabIndex={0}
            >
                <div className="py-3 truncate">{index + 1}</div>
                <div className="py-3 truncate">{user.name}</div>
                <div className="py-3 truncate">{user.email}</div>
                <div className="py-3 truncate">{user.mobile}</div>
                <div className="py-3 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {user.isActive ? 'Yes' : 'No'}
                </div>
                {(hasPermission(role, PERMISSIONS.EDIT_ADMIN) || hasPermission(role, PERMISSIONS.DELETE_ADMIN)) && (
                    <div className="py-3 flex gap-2 justify-center">
                        {hasPermission(role, PERMISSIONS.EDIT_ADMIN) && (
                            <button
                                onClick={() => handleEdit(user)}
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                aria-label={`Edit ${user.name}`}
                            >
                                <Pencil size={16} /> <span className="hidden sm:inline">Edit</span>
                            </button>
                        )}
                        {hasPermission(role, PERMISSIONS.DELETE_ADMIN) && (
                            <button
                                onClick={() => handleDelete(user.adminId)}
                                className="flex items-center gap-1 text-red-600 hover:text-red-800"
                                aria-label={`Delete ${user.name}`}
                            >
                                <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-6 "
        >


            {/* Responsive Scroll Wrapper */}
            <div className="overflow-x-auto rounded-lg border border-gray-200"
            >
                <div className="min-w-[700px]"> {/* Minimum width for table layout */}
                    {/* Table Header */}
                    <div
                        role="row"
                        aria-rowindex={1}
                        className="grid grid-cols-[40px_1fr_2fr_1.5fr_100px_110px] items-center bg-gray-100 text-gray-800 text-sm font-semibold px-4 py-3 sticky top-0 z-10"
                    >
                        <div>#</div>
                        <div>Name</div>
                        <div>Email</div>
                        <div>Mobile</div>
                        <div>Status</div>
                        {(hasPermission(role, PERMISSIONS.EDIT_ADMIN) || hasPermission(role, PERMISSIONS.DELETE_ADMIN)) && (
                            <div className="text-center">Actions</div>
                        )}
                    </div>

                    {/* Table Rows */}
                    {users.length > 0 ? (
                        <div
                            style={{ height: Math.min(users.length, 10) * ROW_HEIGHT, maxHeight: 500 }}
                            role="rowgroup"
                        >
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
                        <p className="text-center py-6 text-gray-500">No users found.</p>
                    )}
                </div>
            </div>
        </div>


    );
};

export default UserList;
