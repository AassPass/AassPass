"use client";

import React, { useRef } from "react";

export default function AdMaster() {
    // Refs for inputs in tab order
    const adTypeRef = useRef(null);
    const imageRef = useRef(null);
    const descRef = useRef(null);
    const priceRef = useRef(null);
    const timeRef = useRef(null);

    const refs = [adTypeRef, imageRef, descRef, priceRef, timeRef];

    // Handle Enter to move focus to next input
    const handleKeyDown = (e, index) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextIndex = index + 1;
            if (nextIndex < refs.length) {
                refs[nextIndex].current.focus();
            } else {
                // If last input, optionally submit form or blur
                e.target.blur();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you can do form validation and API calls
        alert("Ad saved!");
    };

    return (
        <div className="w-full bg-white p-6 md:p-10 mt-6 rounded-xl shadow max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8 tracking-wide">
                Ad Master
            </h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                {/* Ad Type */}
                <div>
                    <label className="block font-medium mb-1">
                        Ad Type<span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                        ref={adTypeRef}
                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, 0)}
                    >
                        <option value="">Select Type</option>
                        <option value="food">Food and Beverages</option>
                        <option value="tech">Tech</option>
                        <option value="club">Club</option>
                    </select>
                </div>

                {/* Ad Image */}
                <div>
                    <label className="block font-medium mb-1">
                        Image<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        ref={imageRef}
                        type="file"
                        className="w-full border border-gray-300 px-3 py-2 rounded-md file:mr-4 file:py-1 file:px-3 file:border-0 file:bg-blue-100 file:text-blue-700 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, 1)}
                    />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="block font-medium mb-1">
                        Description<span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                        ref={descRef}
                        rows={3}
                        className="w-full border border-gray-300 px-4 py-2 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, 2)}
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block font-medium mb-1">Price</label>
                    <input
                        ref={priceRef}
                        type="number"
                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        onKeyDown={(e) => handleKeyDown(e, 3)}
                    />
                </div>

                {/* Time */}
                <div>
                    <label className="block font-medium mb-1">
                        Time<span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                        ref={timeRef}
                        type="time"
                        className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, 4)}
                    />
                </div>

                {/* Submit Button spans full width on md */}
                <div className="md:col-span-2 mt-6">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-6 py-2 rounded-md shadow w-full"
                    >
                        Save Ad
                    </button>
                </div>
            </form>
        </div>
    );
}
