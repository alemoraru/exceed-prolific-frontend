import React from 'react';

export function PrimaryButton({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            {...props}
        >
            {children}
        </button>
    );
}

export function SecondaryButton({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            {...props}
        >
            {children}
        </button>
    );
}

export function DisabledButton({children, ...props}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className="bg-gray-200 text-gray-400 font-semibold py-2 px-4 rounded cursor-not-allowed opacity-60"
            disabled
            {...props}
        >
            {children}
        </button>
    );
}
