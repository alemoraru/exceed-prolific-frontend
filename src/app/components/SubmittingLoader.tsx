import React from "react";

/**
 * SubmittingLoader component displays a loading spinner with a message indicating that the code is being submitted for verification.
 * @param text - Optional text to display alongside the spinner, defaults to "Submitting your code for verification...".
 */
export function SubmittingLoader({text = "Submitting your code for verification..."}: { text?: string }) {
    return (
        <div
            className="flex items-center gap-3 text-blue-700 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl shadow-sm w-full max-w-md mx-auto animate-fade-in"
            role="status" aria-live="polite">
            <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
            </svg>
            <span className="font-medium text-base tracking-tight">{text}</span>
        </div>
    );
}
