import React from 'react';
import {AlertTriangle, RotateCcw, Send, ArrowRight, ArrowLeft} from 'lucide-react';

interface BottomPanelProps {
    hasError: boolean;
    showErrorPanel: boolean;
    onToggleError: () => void;
    onRevert: () => void;
    onPrev: () => void;
    onNext: () => void;
    isSubmitted: boolean;
    canRevert: boolean;
    step: 1 | 2 | 3 | 4;
    submitLoading?: boolean;
}

export const BottomPanel: React.FC<BottomPanelProps> = (
    {
        hasError,
        showErrorPanel,
        onToggleError,
        onRevert,
        onPrev,
        onNext,
        isSubmitted,
        canRevert,
        step,
        submitLoading,
    }) => {
    const nextLabel = (step === 2 || step === 4) ? 'Submit' : 'Next';
    return (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                {hasError && (
                    <button
                        onClick={onToggleError}
                        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-300
                            ${showErrorPanel ? 'bg-red-100 text-red-700 border border-red-300' : 'bg-white text-gray-600 hover:bg-red-50 ' +
                            'hover:text-red-700 border border-gray-300'}
                        `}
                        aria-label={showErrorPanel ? "Hide error panel" : "Show error panel"}
                    >
                        <AlertTriangle size={14} className={showErrorPanel ? "text-red-500" : "text-gray-400"}/>
                        <span>Error Message</span>
                    </button>
                )}
                <button
                    onClick={onRevert}
                    disabled={!canRevert || isSubmitted}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-white text-gray-600
                    border border-gray-300 hover:bg-blue-50 hover:text-blue-700 transition-colors
                    shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2
                    focus:ring-blue-300 cursor-pointer"
                    aria-label="Revert to original code"
                >
                    <RotateCcw size={14} className="text-blue-400"/>
                    <span>Revert Code</span>
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onPrev}
                    disabled={submitLoading || step === 1}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-600 border
                    border-gray-300 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50
                    disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                >
                    <ArrowLeft size={14}/>
                    <span>Prev</span>
                </button>
                <button
                    onClick={onNext}
                    disabled={isSubmitted || submitLoading}
                    className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-white text-gray-600 border
                    border-gray-300 hover:bg-gray-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                    focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer"
                    aria-label={nextLabel}
                >
                    <span>{nextLabel}</span>
                    {nextLabel === 'Submit' ? <Send size={14}/> : <ArrowRight size={14}/>}
                </button>
            </div>
        </div>
    );
};