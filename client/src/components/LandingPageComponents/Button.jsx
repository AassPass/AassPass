'use client';

import colors from '@/libs/colors';
import React from 'react';

export const Button = ({
    text = 'Click Me',
    textColor = 'white',
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`
        px-4 py-2
        sm:px-5 sm:py-2.5
        md:px-5 md:py-2
        text-xs sm:text-sm md:text-base
        rounded-sm
        font-semibold
        transition-transform duration-200
        hover:scale-105
        shadow-md
        focus:outline-none focus:ring-2 focus:ring-offset-2
      `}
            style={{
                backgroundColor: colors.primaryText,
                color: textColor,
            }}
        >
            {text}
        </button>
    );
};
