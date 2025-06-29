'use client'
import React, { useRef } from 'react';

export default function CompanyMaster() {
    const companyNameRef = useRef(null);
    const ownerNameRef = useRef(null);
    const companyAddressRef = useRef(null);
    const companyLatRef = useRef(null);
    const companyLongRef = useRef(null);
    const gstNoRef = useRef(null);
    const websiteLinkRef = useRef(null);
    const saveBtnRef = useRef(null);

    const handleKeyDown = (e, nextRef) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (nextRef && nextRef.current) {
                nextRef.current.focus();
            }
        }
    };

    return (
        <div className="max-w-5xl w-full mx-auto bg-white p-8 mt-8 rounded-xl shadow h-[80vh] overflow-y-auto">
            <h2 className="text-3xl font-semibold text-black mb-8">Company Master</h2>

            <div className="space-y-8">
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Company Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={companyNameRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            required
                            onKeyDown={(e) => handleKeyDown(e, ownerNameRef)}
                        />
                    </div>

                    {/* Owner Name */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Owner Name
                        </label>
                        <input
                            ref={ownerNameRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            onKeyDown={(e) => handleKeyDown(e, companyAddressRef)}
                        />
                    </div>

                    {/* Company Address */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Company Address
                        </label>
                        <input
                            ref={companyAddressRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            onKeyDown={(e) => handleKeyDown(e, companyLatRef)}
                        />
                    </div>

                    {/* Company Latitude */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Company Latitude<span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={companyLatRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            required
                            onKeyDown={(e) => handleKeyDown(e, companyLongRef)}
                        />
                    </div>

                    {/* Company Longitude */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Company Longitude<span className="text-red-500">*</span>
                        </label>
                        <input
                            ref={companyLongRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            required
                            onKeyDown={(e) => handleKeyDown(e, gstNoRef)}
                        />
                    </div>

                    {/* GST No. */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            GST No.
                        </label>
                        <input
                            ref={gstNoRef}
                            type="text"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            onKeyDown={(e) => handleKeyDown(e, websiteLinkRef)}
                        />
                    </div>

                    {/* Website Link */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Website Link
                        </label>
                        <input
                            ref={websiteLinkRef}
                            type="url"
                            className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder-black"
                            onKeyDown={(e) => handleKeyDown(e, saveBtnRef)}
                        />
                    </div>
                </form>

                {/* Save Button */}
                <div className="mt-8">
                    <button
                        ref={saveBtnRef}
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded shadow"
                    >
                        Save Company
                    </button>
                </div>
            </div>
        </div>
    );
}
