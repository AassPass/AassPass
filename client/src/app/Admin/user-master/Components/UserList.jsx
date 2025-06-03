import React from 'react';

const UserList = ({ users, setUsers, setEdit, setSelectedUser }) => {
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEdit(true);
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            setUsers((prevUsers) => prevUsers.filter(user => user.id !== id));
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white p-8 mt-8 rounded-xl shadow text-black">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">User List</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
                            <th className="py-3 px-4 border-b">#</th>
                            <th className="py-3 px-4 border-b">Name</th>
                            <th className="py-3 px-4 border-b">Email</th>
                            <th className="py-3 px-4 border-b">Mobile</th>
                            <th className="py-3 px-4 border-b">Joining Date</th>
                            <th className="py-3 px-4 border-b">Active</th>
                            <th className="py-3 px-4 border-b text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-50 text-sm">
                                    <td className="py-3 px-4 border-b">{index + 1}</td>
                                    <td className="py-3 px-4 border-b">{user.userName}</td>
                                    <td className="py-3 px-4 border-b">{user.email}</td>
                                    <td className="py-3 px-4 border-b">{user.mobile}</td>
                                    <td className="py-3 px-4 border-b">{user.joiningDate}</td>
                                    <td className="py-3 px-4 border-b">
                                        <span
                                            className={`inline-block px-2 py-1 text-xs rounded-full ${user.active === 'YES'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {user.active}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 border-b text-center space-x-2">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-600 hover:underline text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className="text-red-600 hover:underline text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="py-6 text-center text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserList;
