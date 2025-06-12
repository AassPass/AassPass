'use client';
import { memo } from 'react';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';

const UserRow = ({ index, user, handleEdit, handleDelete, role, style }) => (
    <tr style={style} className="hover:bg-gray-50">
        <td className="py-2 px-2 border-b">{index + 1}</td>
        <td className="py-2 px-2 border-b">{user.name}</td>
        <td className="py-2 px-2 border-b">{user.email}</td>
        <td className="py-2 px-2 border-b">{user.mobile}</td>
        <td className="py-2 px-2 border-b">
            <span className={`inline-block px-2 py-0.5 rounded-full ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {user.isActive ? "Active" : "Inactive"}
            </span>
        </td>
        {(hasPermission(role, PERMISSIONS.EDIT_ADMIN) || hasPermission(role, PERMISSIONS.DELETE_ADMIN)) && (
            <td className="py-2 px-2 border-b text-center space-x-1">
                {hasPermission(role, PERMISSIONS.EDIT_ADMIN) && (
                    <button onClick={() => handleEdit(user)} className="text-blue-600 hover:underline">
                        Edit
                    </button>
                )}
                {hasPermission(role, PERMISSIONS.DELETE_ADMIN) && (
                    <button onClick={() => handleDelete(user.adminId)} className="text-red-600 hover:underline">
                        Delete
                    </button>
                )}
            </td>
        )}
    </tr>
);

export default memo(UserRow);
