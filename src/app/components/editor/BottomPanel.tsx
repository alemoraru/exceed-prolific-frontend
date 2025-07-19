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
        <div className="bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {hasError && (
                    <button
                        onClick={onToggleError}
                        className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors ${
                            showErrorPanel
                                ? 'bg-red-100 text-red-600'
                                : 'text-gray-500 hover:text-blue-600 hover:bg-gray-100'
                        }`}
                        aria-label={showErrorPanel ? "Hide error panel" : "Show error panel"}
                    >
                        <AlertTriangle size={14}/>
                        <span>Error</span>
                    </button>
                )}

                <button
                    onClick={onRevert}
                    disabled={!canRevert || isSubmitted}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm text-gray-500 hover:text-blue-600
                    hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Revert to original code"
                >
                    <RotateCcw size={14}/>
                    <span>Revert</span>
                </button>
            </div>

            <button
                onClick={onSubmit}
                disabled={isSubmitted}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-sm text-sm font-medium transition-colors ${
                    isSubmitted
                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                aria-label={isSubmitted ? "Code submitted" : "Submit code"}
            >
                <Send size={14}/>
                <span>{isSubmitted ? 'Submitted' : 'Submit'}</span>
            </button>
        </div>
    );
};