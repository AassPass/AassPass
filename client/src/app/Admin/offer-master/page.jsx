'use client'
import React, { useRef } from 'react';

export default function OfferMaster() {
    const offerTypeRef = useRef(null);
    const offerImageRef = useRef(null);
    const offerDescriptionRef = useRef(null);
    const offerValidityRef = useRef(null);
    const activeRef = useRef(null);
    const saveBtnRef = useRef(null);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your form submit logic here
        alert('Offer saved!');
    };

    return (
        <div className="max-w-5xl w-full mx-auto bg-white p-8 mt-8 rounded-xl shadow">
            <h2 className="text-3xl font-semibold text-gray-800 mb-8">Offer Master</h2>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Offer Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Type<span className="text-red-500">*</span>
                    </label>
                    <input
                        ref={offerTypeRef}
                        type="text"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, offerImageRef)}
                    />
                </div>

                {/* Offer Image */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Image<span className="text-red-500">*</span>
                    </label>
                    <input
                        ref={offerImageRef}
                        type="file"
                        accept="image/*"
                        className="w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, offerDescriptionRef)}
                    />
                </div>

                {/* Offer Description */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Description<span className="text-red-500">*</span>
                    </label>
                    <textarea
                        ref={offerDescriptionRef}
                        rows="4"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                offerValidityRef.current.focus();
                            }
                        }}
                    />
                </div>

                {/* Offer Validity */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Offer Validity<span className="text-red-500">*</span>
                    </label>
                    <input
                        ref={offerValidityRef}
                        type="date"
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                        onKeyDown={(e) => handleKeyDown(e, activeRef)}
                    />
                </div>

                {/* Active */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active</label>
                    <select
                        ref={activeRef}
                        className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyDown={(e) => handleKeyDown(e, saveBtnRef)}
                    >
                        <option value="YES">YES</option>
                        <option value="NO">NO</option>
                    </select>
                </div>

                {/* Save Button */}
                <div className="md:col-span-2 mt-8">
                    <button
                        ref={saveBtnRef}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow w-full"
                    >
                        Save Offer
                    </button>
                </div>
            </form>
        </div>
    );
}
