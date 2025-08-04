import React from 'react';
import {ChevronUp, ChevronDown} from 'lucide-react';

interface HeaderProps {
    title?: string;
    instructions?: string;
    isVisible: boolean;
    onToggle: () => void;
}

/**
 * A header component which displays a title and instructions with a toggle button to show or hide them.
 * @param title - The title to display in the header.
 * @param instructions - The instructions to display below the title.
 * @param isVisible - Controls whether the header content is visible.
 * @param onToggle - Callback function to toggle the visibility of the header content.
 */
export const Header: React.FC<HeaderProps> = ({title, instructions, isVisible, onToggle}) => {
    return (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
            {isVisible && (
                <div className="space-y-2">
                    <div className="flex items-center justify-center text-center">
                        <h1 className="text-lg font-semibold text-blue-700 text-center w-full leading-tight">{title}</h1>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed text-left w-full max-h-32 overflow-auto">{instructions}</p>
                </div>
            )}
            <button
                onClick={onToggle}
                className="cursor-pointer w-full flex items-center justify-center gap-2 text-gray-600 font-medium hover:text-blue-700 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 mt-1 py-1"
                aria-label={isVisible ? "Hide header" : "Show header"}
            >
                {isVisible ? (
                    <>
                        <ChevronUp size={14} className="text-blue-400"/>
                        <span className="text-sm">Hide Task Description</span>
                    </>
                ) : (
                    <>
                        <ChevronDown size={14} className="text-blue-400"/>
                        <span className="text-sm">Show Task Description</span>
                    </>
                )}
            </button>
        </div>
    );
};
