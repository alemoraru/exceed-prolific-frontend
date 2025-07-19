import React from 'react';
import {FaInfoCircle} from 'react-icons/fa';

/**
 * Props for the InfoButton component.
 */
interface InfoButtonProps {
    onClick: () => void;
    className?: string;
    ariaLabel?: string;
    tooltip?: string;
}

/**
 * InfoButton component displays a button with an info icon.
 * @param onClick - Function to call when the button is clicked
 * @param className - Optional additional CSS classes for styling
 * @param ariaLabel - Optional ARIA label for accessibility, defaults to "Show instructions"
 * @param tooltip - Optional tooltip text displayed on hover, defaults to "Show instructions"
 * @constructor
 */
export const InfoButton: React.FC<InfoButtonProps> = (
    {
        onClick,
        className = '',
        ariaLabel = 'Show instructions',
    }) => {
    return (
        <div className={`absolute top-6 right-6 z-20 flex items-center gap-1 ${className}`}>
            {/* Tooltip wrapper for the info button */}
            <button
                className="flex items-center gap-1 cursor-pointer text-blue-600 hover:text-blue-800 duration-120
                    px-2 py-1 bg-white bg-opacity-80 rounded-lg shadow-sm border border-blue-100 hover:bg-blue-50"
                aria-label={ariaLabel}
                onClick={onClick}
                type="button"
            >
                <FaInfoCircle size={22}/>
                <span className="ml-1 font-medium text-base text-gray-700">Instructions</span>
            </button>
        </div>
    );
};
