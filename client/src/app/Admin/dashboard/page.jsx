"use client"
import React, { useState, useEffect } from "react";

export default function Dashboard() {
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [summary, setSummary] = useState({
        totalUsers: 145,
        totalAds: 58,
        activeOffers: 12,
    });

    useEffect(() => {
        if (!fromDate || !toDate) {
            setSummary({ totalUsers: 145, totalAds: 58, activeOffers: 12 });
            return;
        }
        const from = new Date(fromDate);
        const to = new Date(toDate);
        const diffDays = Math.max(0, Math.ceil((to - from) / (1000 * 60 * 60 * 24)));
        setSummary({
            totalUsers: 100 + diffDays * 2,
            totalAds: 30 + diffDays,
            activeOffers: Math.min(20, 5 + Math.floor(diffDays / 3)),
        });
    }, [fromDate, toDate]);

    const handleFromDateChange = (e) => {
        const value = e.target.value;
        if (toDate && value > toDate) {
            setToDate(value);
        }
        setFromDate(value);
    };

    const handleToDateChange = (e) => {
        const value = e.target.value;
        if (fromDate && value < fromDate) {
            setFromDate(value);
        }
        setToDate(value);
    };

    const clearFilters = () => {
        setFromDate("");
        setToDate("");
    };

    return (
        <div className="w-full bg-white p-6 md:p-10 mt-6 rounded-xl shadow text-black">
            <h2 className="text-3xl font-semibold mb-6 tracking-wide">Dashboard</h2>

            <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">From Date</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={handleFromDateChange}
                        max={toDate || undefined}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium mb-1">To Date</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={handleToDateChange}
                        min={fromDate || undefined}
                        className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={clearFilters}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded shadow"
                    type="button"
                >
                    Clear Filters
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium">Total Users</h3>
                    <p className="text-2xl font-bold text-blue-600 mt-2">{summary.totalUsers}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium">Total Ads</h3>
                    <p className="text-2xl font-bold text-green-600 mt-2">{summary.totalAds}</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium">Active Offers</h3>
                    <p className="text-2xl font-bold text-yellow-600 mt-2">{summary.activeOffers}</p>
                </div>
            </div>
        </div>
    );
}
