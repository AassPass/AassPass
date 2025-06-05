'use client';

import React from 'react';

const CompanyFilter = ({
    status,
    type,
    page,
    limit,
    setStatus,
    setType,
    setPage,
    setLimit,
    onFilter,
}) => {
    const handlePrev = () => {
        if (page > 1) {
            setPage(prev => {
                const newPage = prev - 1;
                setTimeout(() => onFilter(newPage, limit, status, type), 0); // Ensure updated state is used
                return newPage;
            });
        }
    };

    const handleNext = () => {
        setPage(prev => {
            const newPage = prev + 1;
            setTimeout(() => onFilter(newPage, limit, status, type), 0); // Ensure updated state is used
            return newPage;
        });
    };

    const handleApplyFilter = () => {
        onFilter(page, limit, status, type);
    };

    return (
        <div className="mb-6 text-black flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-800 mb-1">Status</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-800 mb-1">Type</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                    <option value="restaurant">Restaurant</option>
                    <option value="shop">Shop</option>
                    <option value="service">Service</option>
                </select>
            </div>

            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-800 mb-1">Limit</label>
                <input
                    type="number"
                    min="1"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="border border-gray-300 px-3 py-2 rounded-md w-24 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                    Prev
                </button>
                <span className="text-sm font-semibold text-gray-700">Page {page}</span>
                <button
                    onClick={handleNext}
                    className="px-3 py-2 bg-gray-200 rounded-md text-sm font-medium hover:bg-gray-300"
                >
                    Next
                </button>
            </div>

            <button
                onClick={handleApplyFilter}
                className="ml-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 shadow-sm transition"
            >
                Apply Filter
            </button>
        </div>
    );
};

export default CompanyFilter;
