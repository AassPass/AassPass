import React from 'react';

const page = () => {
    return (
        <div className="w-full max-w-[1200px] bg-gray-100 font-sans antialiased flex flex-col items-center ">


            <div className="w-full   overflow-hidden ">
                {/* Banner Section */}
                <div className="relative w-full h-16 sm:h-48 md:h-32 bg-gray-300">
                    <img
                        src="https://placehold.co/1200x400/808080/FFFFFF?text=Company+Banner"
                        alt="Company Banner"
                        className="w-full h-full object-cover "
                        // onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/1200x400/808080/FFFFFF?text=Error+Loading+Banner"; }}
                    />
                </div>

                {/* Profile Image and Info Section */}
                <div className="relative px-6 pb-6">
                    {/* Profile Image */}
                    <div className="absolute -top-16 left-6 md:left-8 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-blue-500 border-4 border-white shadow-md overflow-hidden">
                        <img
                            src="https://placehold.co/128x128/3B82F6/FFFFFF?text=BP" // BP for Business Profile
                            alt="Profile"
                            className="w-full h-full object-cover"
                            // onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/3B82F6/FFFFFF?text=Error"; }}
                        />
                    </div>

                    {/* Business Info and Verified Status */}
                    <div className="pt-16 sm:pt-12 md:pt-8 pl-0 sm:pl-36 md:pl-40 flex sm:flex-row justify-between items-start sm:items-end">
                        {/* Business Name and Email */}
                        <div className="mb-4 sm:mb-0 text-start sm:text-left">
                            <h1 className="text-xl font-extrabold text-gray-900 mb-1">
                                Ayaana Foods Corp.
                            </h1>
                            <p className="text-md sm:text-xl text-gray-600">
                                contact@ayaanfoods.com
                            </p>
                        </div>

                        {/* Verified Status */}
                        <div className="flex items-center gap-2 bg-green-100 text-green-700 px-1 md:px-4 md:py-2  font-semibold text-sm sm:text-base shadow-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            <span className="text-[8px] md:text-md " >Verified Business</span>
                        </div>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default page;
