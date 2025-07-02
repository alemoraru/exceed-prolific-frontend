import React from "react";
import {RotateCcw} from "lucide-react";

/**
 * Functional component for a revert to the original code button.
 * @param onClick - Function to call when the button is clicked.
 * @param label - Optional label for the button, defaults to "Revert to original snippet".
 */
export function RevertButton({onClick, label}: { onClick: () => void; label?: string }) {
    return (
        <button
            className="mt-2 text-sm text-blue-500 flex items-center gap-1 cursor-pointer group transition-all duration-200"
            onClick={onClick}
            title={label || "Revert your changes to the original code"}
            style={{outline: 'none'}}
        >
            <span className="relative flex items-center">
                <RotateCcw
                    className="w-4 h-4 group-hover:rotate-[-20deg] group-hover:scale-110 transition-transform duration-200"/>
                <span
                    className="ml-1 group-hover:underline group-hover:text-blue-700 transition-colors duration-200">
                    {label || "Revert to original snippet"}
                </span>
            </span>
        </button>
    );
}
