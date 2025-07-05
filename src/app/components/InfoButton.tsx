import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import {FaInfoCircle} from 'react-icons/fa';

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
        tooltip = 'Show instructions',
    }) => {
    return (
        <div className={`absolute top-4 right-4 z-20 ${className}`}>
            <Tooltip title={tooltip} placement="bottom" arrow>
                <button
                    className="cursor-pointer text-blue-600 hover:text-blue-800 focus:outline-none"
                    aria-label={ariaLabel}
                    onClick={onClick}
                    type="button"
                >
                    <FaInfoCircle size={22}/>
                </button>
            </Tooltip>
        </div>
    );
};
