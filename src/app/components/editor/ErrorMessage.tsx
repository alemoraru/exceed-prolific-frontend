import React from "react";
import ReactMarkdown from "react-markdown";

interface ErrorMessageProps {
    /** The error message string to display */
    errorMessage: string;
    /** Whether to render the error message as Markdown */
    renderMarkdown?: boolean;
}

// Common Tailwind classes for consistent styling
const textClasses = "whitespace-pre-wrap text-left m-0 font-mono text-xs";
const codeClasses = "bg-gray-100 rounded px-1 py-0.5 text-xs font-mono";

/**
 * ErrorMessage component displays an error message with optional styling and Markdown rendering.
 * @param errorMessage - The error message to display.
 * @param renderMarkdown - Whether to render the error message as Markdown (default is false).
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = (
    {
        errorMessage,
        renderMarkdown = false,
    }) => (
    <div
        className="px-4 py-2 rounded text-left shadow-xs relative animate-fade-in text-xs"
        role="alert"
        aria-live="assertive"
    >
        <div className="flex items-start gap-2">
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
