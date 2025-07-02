'use client';

import type {Snippet} from "../data/snippets";

/**
 * ErrorMessage component displays an error message based on the provided message style and snippet.
 * @param messageStyle - The style of the error message to display (e.g., "standard", "pragmatic", "contingent").
 * @param snippet - The code snippet containing the error messages.
 */
export const ErrorMessage = (
    {
        messageStyle,
        snippet,
    }: {
        messageStyle: keyof Snippet["errorMessages"];
        snippet: Snippet;
    }) => (
    <div
        className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mt-4 rounded text-left shadow-md relative animate-fade-in"
        role="alert"
        aria-live="assertive"
    >
        <div className="flex items-start gap-2">
            <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-red-200 flex items-center justify-center">
                <span className="text-red-600 font-bold text-lg" aria-hidden="true">!</span>
            </div>
            <div>
                <span className="font-bold block mb-1">Error</span>
                <pre className="whitespace-pre-wrap text-left m-0">{snippet.errorMessages[messageStyle]}</pre>
            </div>
        </div>
    </div>
);
