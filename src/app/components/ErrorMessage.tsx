'use client';

import React from "react";

/**
 * ErrorMessage component displays an error message string in a styled alert box.
 * @param errorMessage - The error message string to display.
 * @param showExclamation - Whether to show an exclamation mark icon next to the error message.
 */
export const ErrorMessage = ({errorMessage, showExclamation = false}: {
    errorMessage: string,
    showExclamation?: boolean
}) => (
    <div
        className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded text-left shadow-md relative animate-fade-in"
        role="alert"
        aria-live="assertive"
    >
        <div className="flex items-start gap-2">
            {showExclamation && (
                <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg" aria-hidden="true">!</span>
                </div>
            )}
            <div>
                <pre className="whitespace-pre-wrap text-left m-0">{errorMessage}</pre>
            </div>
        </div>
    </div>
);
