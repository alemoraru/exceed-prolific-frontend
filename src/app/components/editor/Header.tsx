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
        <div className="bg-white border-b border-gray-200">
            {isVisible && (
                <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center justify-center text-center">
                        <h1 className="text-xl font-semibold text-gray-900 text-center w-full">{title}</h1>
                    </div>
                    <p className="text-gray-500 leading-relaxed text-left w-full">{instructions}</p>
                </div>
            )}

            <button
                onClick={onToggle}
                className="cursor-pointer w-full py-2 px-6 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label={isVisible ? "Hide header" : "Show header"}
            >
                {isVisible ? (
                    <>
                        <ChevronUp size={16}/>
                        <span className="text-sm">Hide Instructions</span>
                    </>
                ) : (
                    <>
                        <ChevronDown size={16}/>
                        <span className="text-sm">Show Instructions</span>
                    </>
                )}
            </button>
        </div>
    );
};
