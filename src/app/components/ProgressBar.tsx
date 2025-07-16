import React from "react";

interface ProgressBarProps {
    progress: number; // 0-100
    className?: string;
}

/**
 * ProgressBar component displays a horizontal progress bar indicating the completion percentage.
 * @param progress - Completion percentage from 0 to 100
 * @param className - Optional additional CSS classes for styling the progress bar
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({progress, className}) => (
    <div className={`h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar`}>
        <div
            className={`h-full transition-all duration-300 ${className || 'bg-blue-600'}`}
            style={{width: `${progress}%`}}
        ></div>
    </div>
);
