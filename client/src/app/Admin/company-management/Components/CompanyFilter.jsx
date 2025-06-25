'use client';

import React, { useRef, useState } from 'react';

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




    const handleStatusChange = (e) => {
        const value = e.target.value;
        setStatus(value);
    };

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setType(value);
    };

    const handleLimitChange = (e) => {
        const value = Number(e.target.value);
        setLimit(value);
    };
    const handlePrev = () => {
        if (page > 1) {
            const newPage = page - 1;
            setPage(newPage);
            onFilter(newPage, limit, status, type);
        }
    };

    const handleNext = () => {
        const newPage = page + 1;
        setPage(newPage);
        onFilter(newPage, limit, status, type);
    };

    const handleApplyFilter = () => {
        setPage(1); // Go to first page on filter
        onFilter(1, limit, status, type);
    };

    return (
        <form
            className={`mb-6 text-black flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow-sm border border-gray-200 transition-opacity`}
            onSubmit={(e) => {
                e.preventDefault();
                handleApplyFilter();
            }}
            aria-labelledby="company-filter-title"
        >
            <h2 id="company-filter-title" className="sr-only">Company Filter</h2>

            {/* Status */}
            <div className="flex flex-col min-w-[150px]">
                <label htmlFor="status" className="text-sm font-medium text-gray-800 mb-1">Status</label>
                <select
                    id="status"
                    value={status}
                    onChange={handleStatusChange}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus-visible:ring-2"
                    aria-label="Status Filter"
                >
                    <option value="">All</option>
                    <option value="verified">Verified</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Type */}
            <div className="flex flex-col min-w-[150px]">
                <label htmlFor="type" className="text-sm font-medium text-gray-800 mb-1">Type</label>
                <select
                    id="type"
                    value={type}
                    onChange={handleTypeChange}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus-visible:ring-2"
                    aria-label="Business Type Filter"
                >
                    <option value="">All</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="shop">Shop</option>
                    <option value="service">Service</option>
                </select>
            </div>

            {/* Limit */}
            <div className="flex flex-col min-w-[100px]">
                <label htmlFor="limit" className="text-sm font-medium text-gray-800 mb-1">Limit</label>
                <input
                    id="limit"
                    type="number"
                    min="1"
                    value={limit}
                    onChange={handleLimitChange}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus-visible:ring-2"
                    aria-label="Limit per page"
                />
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 mt-2">
                <button
                    type="button"
                    onClick={handlePrev}
                    disabled={page === 1}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Previous Page"
                >
                    Prev
                </button>
                <span className="text-sm font-semibold text-gray-700">Page {page}</span>
                <button
                    type="button"
                    onClick={handleNext}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    aria-label="Next Page"
                >
                    Next
                </button>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="ml-auto bg-blue-600 text-white font-medium px-5 py-2 rounded-md hover:bg-blue-700 transition shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Apply Filter"
            >
                Apply Filter
            </button>
        </form>
    );
};

export default CompanyFilter;
