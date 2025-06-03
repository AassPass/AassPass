"use client";

import React, { useState, useRef } from 'react';

export default function UserLog() {
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [logType, setLogType] = useState('');
    const [companyId, setCompanyId] = useState('');
    const [userId, setUserId] = useState('');

    const fromDateRef = useRef(null);
    const toDateRef = useRef(null);
    const logTypeRef = useRef(null);
    const companyIdRef = useRef(null);
    const userIdRef = useRef(null);
    const submitBtnRef = useRef(null);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Filter logs: From ${fromDate} To ${toDate} | Log Type: ${logType} | Company ID: ${companyId} | User ID: ${userId}`);
    };

    return (
        <div className="w-full bg-white p-6 md:p-10 mt-6 rounded-xl shadow max-w-5xl">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 tracking-wide">User Log</h2>

            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 text-gray-700">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">From Date</label>
                    <input
                        ref={fromDateRef}
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, toDateRef)}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">To Date</label>
                    <input
                        ref={toDateRef}
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, logTypeRef)}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Log Type</label>
                    <select
                        ref={logTypeRef}
                        value={logType}
                        onChange={(e) => setLogType(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, companyIdRef)}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Log Type</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="update">Update</option>
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">Company ID</label>
                    <input
                        ref={companyIdRef}
                        type="text"
                        placeholder="Enter Company ID"
                        value={companyId}
                        onChange={(e) => setCompanyId(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, userIdRef)}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">User ID</label>
                    <input
                        ref={userIdRef}
                        type="text"
                        placeholder="Enter User ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        onKeyDown={(e) => handleKeyDown(e, submitBtnRef)}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="md:col-span-3 lg:col-span-5 mt-4">
                    <button
                        ref={submitBtnRef}
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md shadow"
                    >
                        Search Logs
                    </button>
                </div>
            </form>

            <div className="mt-10">
                <p className="text-gray-500 italic">No logs to display. Use filters above to search.</p>
            </div>
        </div>
    );
}
