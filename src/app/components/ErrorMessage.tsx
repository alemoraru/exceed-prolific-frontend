import React from "react";
import ReactMarkdown from "react-markdown";

interface ErrorMessageProps {
    /** The error message string to display */
    errorMessage: string;
    /** Whether to show an exclamation mark icon next to the error message */
    showExclamation?: boolean;
    /** Whether to render the error message as Markdown */
    renderMarkdown?: boolean;
}

// Common Tailwind classes for consistent styling
const textClasses = "whitespace-pre-wrap text-left m-0 font-mono text-base";
const codeClasses = "bg-gray-100 rounded px-1 py-0.5 text-sm font-mono";

/**
 * ErrorMessage component displays an error message with optional styling and Markdown rendering.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = (
    {
        errorMessage,
        showExclamation = false,
        renderMarkdown = false,
    }) => (
    <div
        className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 rounded text-left shadow-md relative animate-fade-in"
        role="alert"
        aria-live="assertive"
    >
        <div className="flex items-start gap-2">
            {/* Optional exclamation icon */}
            {showExclamation && (
                <div className="h-6 w-6 flex-shrink-0 mt-0.5 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-red-600 font-bold text-lg" aria-hidden="true">!</span>
                </div>
            )}

            {/* Message container */}
            <div className={textClasses}>
                {renderMarkdown ? (
                    <ReactMarkdown
                        components={{
                            // Render paragraph tags as spans with the same text styling
                            p: ({children, ...props}) => (
                                <span className={textClasses} {...props}>
                                    {children}
                                </span>
                            ),
                            // Render inline code with consistent styling
                            code: ({children, ...props}) => (
                                <code className={codeClasses} {...props}>
                                    {children}
                                </code>
                            ),
                        }}
                    >
                        {errorMessage}
                    </ReactMarkdown>
                ) : (
                    <span className={textClasses}>{errorMessage}</span>
                )}
            </div>
        </div>
    </div>
);
