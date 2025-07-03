import React, {useState} from "react";
import {RotateCcw} from "lucide-react";

/**
 * Functional component for a revert to the original code button.
 * @param onClick - Function to call when the button is clicked.
 * @param label - Optional label for the button, defaults to "Revert to original snippet".
 */
export function RevertButton({onClick, label}: { onClick: () => void; label?: string }) {
    const [open, setOpen] = useState(false); // for hover/focus effect
    return (
        <button
            type="button"
            className={`w-full cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl border border-blue-400 bg-white text-blue-700 font-semibold text-base shadow-sm focus:outline-none transition-all duration-200 group ${open ? 'ring-2 ring-blue-300' : ''}`}
            style={{
                borderColor: open ? '#2563eb' : '#60a5fa', // Tailwind blue-600 or blue-400
                color: open ? '#1d4ed8' : '#2563eb', // Tailwind blue-700 or blue-600
                background: open ? '#eff6ff' : '#fff', // Tailwind blue-50 or white
                boxShadow: open ? '0 2px 8px 0 rgba(37,99,235,0.08)' : undefined,
                transition: 'all 0.2s cubic-bezier(.4,0,.2,1)'
            }}
            onClick={onClick}
            title={label || "Revert your changes to the original code"}
            aria-label={label || "Revert to original snippet"}
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
        >
            <span className="relative flex items-center">
                <RotateCcw
                    className="w-4 h-4 mr-1 text-blue-600 group-hover:text-blue-700 transition-colors duration-200"
                    aria-hidden="true"
                />
                <span className="font-mono tracking-tight text-base">
                    {label || "Revert to original snippet"}
                </span>
                <span
                    className="ml-2 text-xs font-normal text-blue-400 group-hover:text-blue-600 transition-colors duration-200">
                    (click to revert)
                </span>
            </span>
        </button>
    );
}
