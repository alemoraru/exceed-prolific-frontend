"use client";

import React from "react";
import {AlertTriangle, X} from "lucide-react";

interface ErrorPanelProps {
    /** The error message to display */
    message: string;
    /** Controls whether the panel is rendered */
    isVisible: boolean;
    /** Called when the user clicks the X‑button */
    onClose: () => void;
    /** Desired height in px (>= 128). Defaults to `200`. */
    height?: number;
}

/**
 * A bottom‑docked panel that *pushes* siblings upward (no absolute positioning).
 *
 * Place it directly under your scrolling editor container inside a parent flex‑column layout:
 *
 * ```tsx
 * <div className="flex flex-col min-h-0 flex-1">
 *   <div className="flex-1 overflow-auto">…editor…</div>
 *   <ErrorPanel … />
 * </div>
 * ```
 */
export const ErrorPanel: React.FC<ErrorPanelProps> = (
    {
        message,
        isVisible,
        onClose,
        height = 200,
    }) => {
    if (!isVisible) return null;

    const panelHeight = Math.max(height, 128);

    return (
        <div
            className="flex flex-col flex-shrink-0 bg-red-50 border-t border-red-400 text-red-900 shadow-inner"
            style={{height: panelHeight}}
        >
            <header className="flex items-center justify-between px-4 py-2">
                <div className="flex items-center gap-2 font-semibold">
                    <AlertTriangle size={18} className="text-red-600"/>
                    Error
                </div>
                <button
                    onClick={onClose}
                    aria-label="Close error panel"
                    className="p-1 rounded hover:bg-red-200 transition-colors"
                >
                    <X size={18}/>
                </button>
            </header>

            <pre className="px-4 py-2 text-xs overflow-auto whitespace-pre-wrap break-all flex-1 text-red-800">
                {message || "No error message."}
            </pre>
        </div>
    );
};
