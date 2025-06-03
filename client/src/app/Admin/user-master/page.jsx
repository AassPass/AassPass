'use client'
import React, { useState } from 'react';
import AddUsers from './Components/AddUsers';
import UserList from './Components/UserList';

export default function UserMaster() {
    const [edit, setEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // ✅ Fixed: added this state
    const [users, setUsers] = useState([
        {
            id: 1,
            userName: 'John Doe',
            email: 'john@example.com',
            mobile: '1234567890',
            joiningDate: '2025-05-20',
            active: 'YES',
        },
        {
            id: 2,
            userName: 'Jane Smith',
            email: 'jane@example.com',
            mobile: '9876543210',
            joiningDate: '2025-06-01',
            active: 'NO',
        },
    ]);
    return (
        <div className="p-6 space-y-8">


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
