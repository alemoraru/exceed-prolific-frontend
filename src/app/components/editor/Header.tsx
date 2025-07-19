import React from 'react';
import {ChevronUp, ChevronDown} from 'lucide-react';

interface HeaderProps {
    title?: string;
    instructions?: string;
    progress?: number;
    maxProgress?: number;
    isVisible: boolean;
    onToggle: () => void;
}

/**
 * Header component displays a title and instructions with a toggle button to show or hide them.
 */
export const Header: React.FC<HeaderProps> = ({title, instructions, isVisible, onToggle}) => {
    return (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
            {isVisible && (
                <div className="space-y-3">
                    <div className="flex items-center justify-center text-center">
                        <h1 className="text-xl font-semibold text-blue-700 text-center w-full">{title}</h1>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-left w-full">{instructions}</p>
                </div>
            )}
            <button
                onClick={onToggle}
                className="cursor-pointer w-full py-2 px-6 flex items-center justify-center gap-2 text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm font-medium hover:text-blue-700 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300 mt-2"
                aria-label={isVisible ? "Hide header" : "Show header"}
            >
                {isVisible ? (
                    <>
                        <ChevronUp size={16} className="text-blue-400"/>
                        <span className="text-sm">Hide Instructions</span>
                    </>
                ) : (
                    <>
                        <ChevronDown size={16} className="text-blue-400"/>
                        <span className="text-sm">Show Instructions</span>
                    </>
                )}
            </button>
        </div>
    );
};
