import React from 'react';

export const Button = ({ text = "Click Me", color = "#3498db", textColor = "#ffffff", onClick }) => {
    return (
        <button
            onClick={onClick}
            className="
                px-4 py-2              /* base padding */
                sm:px-5 sm:py-2.5      /* small screens */
                md:px-5 md:py-2       /* medium and up */
                text-xs sm:text-sm md:text-base
                rounded-full 
                font-semibold 
                transition-transform duration-200 
                hover:scale-105
                shadow-md
            "
            style={{
                backgroundColor: color,
                color: textColor,
                cursor: "pointer",
            }}
        >
            {text}
        </button>
    );
};
