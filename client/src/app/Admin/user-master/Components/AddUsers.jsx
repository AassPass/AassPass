'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { BACKEND_URL } from '@/Utils/backendUrl';
import { useRole } from '@/Context/RoleContext';

const inputClass = 'w-full px-2 py-1 text-xs rounded border border-gray-300 text-black h-8';
const labelClass = 'block font-medium text-gray-700 text-xs';

const AddUsers = ({ edit, setEdit, selectedUser, setSelectedUser, setUsers }) => {
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
      setFormData({
        ...selectedUser,
        isActive: selectedUser.isActive === true || selectedUser.isActive === 'true',
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

      handleCancel();
    } catch (err) {
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-md shadow-md w-full  mx-auto text-sm border overflow-hidden"
    >
      {/* Form Heading */}
      <div className="bg-blue-500 text-white px-4 py-2">
        <h2 className="text-sm font-semibold">{edit ? 'Edit Admin' : 'Add Admin'}</h2>
      </div>

      {/* Form Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className={labelClass}>
              User Name *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="mobile" className={labelClass}>
              Mobile No. *
            </label>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              maxLength={10}
              value={formData.mobile}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email Address *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              required
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="isActive" className={labelClass}>
              Active *
            </label>
            <select
              id="isActive"
              name="isActive"
              value={formData.isActive ? 'true' : 'false'}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="true">YES</option>
              <option value="false">NO</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded hover:bg-blue-400 cursor-pointer border-2 border-blue-400 text-blue-400 hover:text-white text-sm font-bold w-full transition-colors duration-200"
          >
            {loading ? 'Saving...' : edit ? 'Update User' : 'Add User'}
          </button>

          {edit && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 rounded border-2 text-sm font-bold text-gray-600 border-gray-400 hover:bg-gray-400 hover:text-white transition-colors duration-200"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddUsers;
