import React from "react";
import {MdOutlineExitToApp} from "react-icons/md";

interface QuitStudyButtonProps {
    onClick: () => void;
    className?: string;
    disabled?: boolean;
}

export function QuitStudyButton({onClick, className = "", disabled = false}: QuitStudyButtonProps) {
    return (
        <button
            className={`cursor-pointer fixed top-6 left-6 z-[10000] flex items-center group transition-all duration-200 ${className}`}
            onClick={onClick}
            type="button"
            aria-label="Quit & Revoke Consent"
            disabled={disabled}
            style={disabled ? {pointerEvents: 'none', opacity: 0.5} : {}}
        >
            <span
                className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-400 border
                border-red-300 shadow group-hover:bg-red-500 group-hover:text-white group-hover:border-red-700
                transition-all duration-200"
            >
                <MdOutlineExitToApp className="text-xl"/>
            </span>
            <span
                className="overflow-hidden whitespace-nowrap max-w-0 group-hover:max-w-xs group-hover:ml-3
                group-hover:px-2 group-hover:py-1 group-hover:bg-red-500 group-hover:text-white rounded-lg
                transition-all duration-200 text-base font-semibold"
                style={{transitionProperty: 'max-width, margin, padding, background, color'}}
            >
                Quit & Revoke Consent
            </span>
        </button>
    );
}
