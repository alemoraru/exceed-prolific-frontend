import React from 'react';
import {AlertTriangle, RotateCcw, Send} from 'lucide-react';

interface BottomPanelProps {
    hasError: boolean;
    showErrorPanel: boolean;
    onToggleError: () => void;
    onRevert: () => void;
    onSubmit: () => void;
    isSubmitted: boolean;
    canRevert: boolean;
}

export const BottomPanel: React.FC<BottomPanelProps> = (
    {
        hasError,
        showErrorPanel,
        onToggleError,
        onRevert,
        onSubmit,
        isSubmitted,
        canRevert,
    }) => {
    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {hasError && (
                    <button
                        onClick={onToggleError}
                        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300
                            ${showErrorPanel ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-700 border border-gray-300'}
                        `}
                        aria-label={showErrorPanel ? "Hide error panel" : "Show error panel"}
                    >
                        <AlertTriangle size={14} className={showErrorPanel ? "text-red-500" : "text-gray-400"}/>
                        <span>Error</span>
                    </button>
                )}

                <button
                    onClick={onRevert}
                    disabled={!canRevert || isSubmitted}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-600 border
                    border-gray-300 hover:bg-blue-50 hover:text-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Revert to original code"
                >
                    <RotateCcw size={14} className="text-blue-400"/>
                    <span>Revert</span>
                </button>
            </div>

            <button
                onClick={onSubmit}
                disabled={isSubmitted}
                className={`cursor-pointer flex items-center gap-2 px-5 py-2 rounded-md text-sm font-semibold transition-colors shadow focus:outline-none focus:ring-2 focus:ring-blue-400
                    ${isSubmitted
                    ? 'bg-green-100 text-green-700 border border-green-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-700'}
                `}
                aria-label={isSubmitted ? "Code submitted" : "Submit code"}
            >
                <Send size={14}/>
                <span>{isSubmitted ? 'Submitted' : 'Submit'}</span>
            </button>
        </div>
    );
};