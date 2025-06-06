'use client'
import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { toast } from 'react-toastify';

export default function AddUsers({ edit, setEdit, selectedUser, setSelectedUser, setUsers, users }) {
    const [formData, setFormData] = useState({
        name: '',
        joiningDate: '',
        password: '',
        mobile: '',
        email: '',
        active: 'YES',
    });
    useEffect(() => {
        if (edit && selectedUser) {
            setFormData(selectedUser);
        }
    }, [edit, selectedUser]);
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Validate form inputs
    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'User Name is required';
        // if (!formData.joiningDate) newErrors.joiningDate = 'Joining Date is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile No. is required';
        else if (!/^\d{10}$/.test(formData.mobile))
            newErrors.mobile = 'Mobile No. must be 10 digits';
        if (!formData.email) newErrors.email = 'Email Address is required';
        else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
        )
            newErrors.email = 'Invalid email address';

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formErrors = validate();

        if (Object.keys(formErrors).length === 0) {
            setErrors({});

            try {
                const token = localStorage.getItem('token');
                let response;

                if (edit) {
                    // Update user
                    response = await axios.put(
                        `${BACKEND_URL}/admin/update/${selectedUser.adminId}`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                } else {
                    // Add new user
                    response = await axios.post(
                        `${BACKEND_URL}/admin`,
                        formData,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                }

                if (response.status === 200) {
                    toast.success(edit ? 'User updated successfully!' : 'User saved successfully!');

                    const returnedUser = response.data.data || formData;

                    if (edit) {
                        setUsers((prev) =>
                            prev.map((u) =>
                                u.adminId === selectedUser.adminId ? returnedUser : u
                            )
                        );
                    } else {
                        setUsers((prev) => [returnedUser, ...prev]);
                    }

                    // Reset form
                    setFormData({
                        name: '',
                        joiningDate: '',
                        password: '',
                        mobile: '',
                        email: '',
                        active: 'YES',
                    });
                    setSelectedUser(null);
                    setEdit(false);
                } else {
                    toast.error('Something went wrong. Please try again.');
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
                console.error('Error saving user:', error);
            }
        } else {
            setErrors(formErrors);
        }
    };




    // Handle Enter key to move focus or submit
    const handleKeyDown = (e) => {
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
    };

    return (
        <div className="max-w-5xl w-full mx-auto bg-white p-8 mt-8 rounded-xl shadow">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">User Master</h2>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleSubmit}>
                {/* User Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        User Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } text-black`}
                        required
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby="name-error"
                    />
                    {errors.name && (
                        <p id="name-error" className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Joining Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Joining Date<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="joiningDate"
                        type="date"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.joiningDate ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } text-black`}
                        required
                        aria-invalid={errors.joiningDate ? 'true' : 'false'}
                        aria-describedby="joiningDate-error"
                    />
                    {errors.joiningDate && (
                        <p id="joiningDate-error" className="text-red-500 text-xs mt-1">
                            {errors.joiningDate}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="password"
                        type="password"
                        value={formData.password || ''}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } text-black`}
                        required
                        aria-invalid={errors.password ? 'true' : 'false'}
                        aria-describedby="password-error"
                    />
                    {errors.password && (
                        <p id="password-error" className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Mobile No. */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile No.<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="mobile"
                        type="tel"
                        value={formData.mobile}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.mobile ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } text-black`}
                        required
                        aria-invalid={errors.mobile ? 'true' : 'false'}
                        aria-describedby="mobile-error"
                        pattern="\d{10}"
                        maxLength={10}
                    />
                    {errors.mobile && (
                        <p id="mobile-error" className="text-red-500 text-xs mt-1">
                            {errors.mobile}
                        </p>
                    )}
                </div>

                {/* Email Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className={`w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                            } text-black`}
                        required
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby="email-error"
                    />
                    {errors.email && (
                        <p id="email-error" className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Active */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                    <select
                        name="active"
                        value={formData.active}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>

                {/* Empty div to fill the grid layout */}
                <div></div>
            </form>

            {/* Submit Button */}
            <div className="mt-8">
                <button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
                >
                    {edit ? 'Update User' : 'Save User'}
                </button>
            </div>
        </div>
    );
}
