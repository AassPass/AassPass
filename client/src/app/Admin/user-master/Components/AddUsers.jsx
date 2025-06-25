'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

const inputBaseClass =
    'w-full border px-2 py-1 rounded-sm focus:outline-none focus:ring-1 text-sm text-black';
const inputValidClass = 'border-gray-300 focus:ring-blue-500';
const inputInvalidClass = 'border-red-500 focus:ring-red-500';

const InputField = ({ id, name, type, label, value, onChange, onKeyDown, error, maxLength }) => (
    <label htmlFor={id} className="block text-xs font-medium text-gray-700">
        {label}
        <span className="text-red-500">*</span>
        <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            className={`${inputBaseClass} ${error ? inputInvalidClass : inputValidClass}`}
            required
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
        />
        {error && (
            <p id={`${id}-error`} className="text-red-500 text-xs mt-1" role="alert" aria-live="polite">
                {error}
            </p>
        )}
    </label>
);

function AddUsers({ edit, setEdit, selectedUser, setSelectedUser, setUsers }) {

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        isActive: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (edit && selectedUser) {
            const updated = {
                ...selectedUser,
                isActive: selectedUser.isActive === true || selectedUser.isActive === 'true',
            };
            setFormData((prev) => {
                return JSON.stringify(prev) !== JSON.stringify(updated) ? updated : prev;
            });
        }
    }, [edit, selectedUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'isActive' ? value === 'true' : value,
        }));
    };
    const handleCancel = () => {
        setFormData({ name: '', mobile: '', email: '', isActive: false });
        setSelectedUser(null);
        setEdit(false);
        setErrors({});
    };

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const formElements = Array.from(
                e.currentTarget.form.elements
            ).filter((el) => el.tagName !== 'FIELDSET' && !el.disabled && el.type !== 'hidden');

            const index = formElements.indexOf(e.target);
            if (index > -1 && index < formElements.length - 1) {
                formElements[index + 1].focus();
            } else {
                e.currentTarget.form.requestSubmit();
            }
        }
    }, []);

    const validate = useCallback(() => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'User Name is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile No. is required';
        else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile No. must be 10 digits';
        if (!formData.email) newErrors.email = 'Email Address is required';
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email))
            newErrors.email = 'Invalid email address';
        return newErrors;
    }, [formData]);

    const saveNewUser = async (token) => {
        const res = await fetch(`${BACKEND_URL}/admin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Failed to save user');
        return res.json();
    };

    const updateUser = async (token) => {
        // console.log(selectedUser.adminId);
        const res = await fetch(`${BACKEND_URL}/admin/update/${selectedUser.adminId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
        });

        if (!res.ok) throw new Error('Failed to update user');
        return res.json();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setErrors({});
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const data = edit ? await updateUser(token) : await saveNewUser(token);
            const returnedUser = data.admin || formData;

            setUsers((prev) =>
                edit
                    ? prev.map((u) => (u.adminId === selectedUser.adminId ? returnedUser : u))
                    : [returnedUser, ...prev]
            );

            setFormData({ name: '', mobile: '', email: '', isActive: false });
            setSelectedUser(null);
            setEdit(false);
        } catch (err) {
            console.error('Error saving user:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <fieldset className="bg-white p-3 rounded shadow space-y-3 w-full max-w-2xl mx-auto text-xs">
                <h2 className="text-sm font-semibold text-black">{edit ? 'Edit Admin' : 'Add Admin'}</h2>

                <InputField
                    id="name"
                    name="name"
                    type="text"
                    label="User Name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    error={errors.name}
                />

                <InputField
                    id="mobile"
                    name="mobile"
                    type="tel"
                    label="Mobile No."
                    value={formData.mobile}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    error={errors.mobile}
                    maxLength={10}
                />

                <InputField
                    id="email"
                    name="email"
                    type="email"
                    label="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    error={errors.email}
                />

                {/* isActive */}
                <label htmlFor="isActive" className="block text-xs font-medium text-gray-700">
                    Active
                    <select
                        id="isActive"
                        name="isActive"
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 px-2 py-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm text-black"
                        aria-label="Active status"
                    >
                        <option value="true">YES</option>
                        <option value="false">NO</option>
                    </select>
                </label>
            </fieldset>

            <div className="mt-4 flex gap-2">
                <button
                    type="submit"
                    disabled={loading}
                    className={`px-4 py-2 text-sm font-medium rounded-md ${loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                >
                    {loading ? 'Saving...' : edit ? 'Update User' : 'Add User'}
                </button>

                {edit && (
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="px-4 py-2 text-sm font-medium rounded-md bg-gray-500 text-white hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                )}
            </div>

        </form>
    );
}

export default AddUsers;
