import React from "react";

/**
 * SubmissionError component displays an error message when there is an issue with form submission.
 * This could be due to validation errors, server issues, or other problems that prevent successful submission.
 */
export function SubmissionError({message}: { message: string }) {
    return (
        <div
            className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 mt-2 animate-fade-in"
            role="alert" aria-live="assertive">
            <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"/>
            </svg>
            <span>{message}</span>
        </div>
    );
}

