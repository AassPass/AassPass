'use client';
import { memo } from 'react';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';

const UserRow = ({ index, user, handleEdit, handleDelete, role, style }) => (
    <tr
        style={style}
        className="hover:bg-gray-50 focus-within:bg-gray-100 transition-colors duration-150"
        role="row"
        aria-rowindex={index + 2}
    >
        <td className="py-2 px-3 border-b text-sm" role="cell">{index + 1}</td>

        <td className="py-2 px-3 border-b text-sm truncate max-w-[150px]" role="cell" title={user.name}>
            {user.name}
        </td>

        <td className="py-2 px-3 border-b text-sm hidden md:table-cell truncate max-w-[200px]" role="cell" title={user.email}>
            {user.email}
        </td>

        <td className="py-2 px-3 border-b text-sm hidden md:table-cell" role="cell">{user.mobile}</td>

        <td className="py-2 px-3 border-b text-sm" role="cell">
            <span
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${user.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                    }`}
                aria-label={user.isActive ? 'User is active' : 'User is inactive'}
            >
                {user.isActive ? 'Active' : 'Inactive'}
            </span>
        </td>

        {(hasPermission(role, PERMISSIONS.EDIT_ADMIN) || hasPermission(role, PERMISSIONS.DELETE_ADMIN)) && (
            <td className="py-2 px-3 border-b text-center space-x-2" role="cell">
                {hasPermission(role, PERMISSIONS.EDIT_ADMIN) && (
                    <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label={`Edit user ${user.name}`}
                        title="Edit user"
                    >
                        Edit
                    </button>
                )}
                {hasPermission(role, PERMISSIONS.DELETE_ADMIN) && (
                    <button
                        onClick={() => handleDelete(user.adminId)}
                        className="text-red-600 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400"
                        aria-label={`Delete user ${user.name}`}
                        title="Delete user"
                    >
                        Delete
                    </button>
                )}
            </td>
        )}
    </tr>
);

export default memo(UserRow);
