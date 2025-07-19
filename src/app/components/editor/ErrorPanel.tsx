"use client";

import React from "react";
import {AlertTriangle, X} from "lucide-react";

interface ErrorPanelProps {
    /** The error message to display */
    message: string;
    /** Controls whether the panel is rendered */
    isVisible: boolean;
    /** Called when the user clicks the X‑button */
    onCloseAction: () => void;
}

/**
 * ErrorPanel component displays an error message in a panel.
 */
export const ErrorPanel: React.FC<ErrorPanelProps> = ({message, isVisible, onCloseAction}) => {

    // If the panel is not visible, return null to avoid rendering
    if (!isVisible) return null;

    return (
        <div
            className="flex flex-col flex-shrink-0 bg-red-50 border-t border-red-400 text-red-700 shadow-inner"
            style={{height: 'auto', minHeight: 0}}
        >
            <header className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle size={18} className="text-red-600"/>
                    Error
                </div>
                <button
                    onClick={onCloseAction}
                    aria-label="Close error panel"
                    className="p-1 rounded hover:bg-red-100 transition-colors cursor-pointer"
                >
                    <X size={18}/>
                </button>
            </header>

            <pre className="px-4 py-2 text-xs whitespace-pre-wrap flex-1 text-red-800 break-words">
                {message || "No error message."}
            </pre>
        </div>
    );
};
