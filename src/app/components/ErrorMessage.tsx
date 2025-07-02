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
    <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mt-4 rounded text-left">
        <pre className="whitespace-pre-wrap mt-2 text-left">{snippet.errorMessages[messageStyle]}</pre>
    </div>
);
