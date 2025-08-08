import React from 'react';
import {AlertTriangle, RotateCcw, Send} from 'lucide-react';

/**
 * Props for the BottomPanel component.
 */
interface BottomPanelProps {
    hasError: boolean;
    showErrorPanel: boolean;
    onToggleError: () => void;
    onRevert: () => void;
    onNext: () => void;
    isSubmitted: boolean;
    canRevert: boolean;
    canSubmit: boolean;
    submitLoading?: boolean;
}

/**
 * BottomPanel component provides a footer panel with action buttons for the code editor.
 * @param hasError - Indicates if there is an error to display.
 * @param showErrorPanel - Controls visibility of the error panel.
 * @param onToggleError - Callback to toggle the error panel visibility.
 * @param onRevert - Callback to revert the code to its original state.
 * @param onNext - Callback to proceed to the next step or submit the code.
 * @param isSubmitted - Indicates if the code has been submitted.
 * @param canRevert - Indicates if the code can be reverted to its original state.
 * @param canSubmit - Indicates if the code can be submitted.
 * @param submitLoading - Indicates if the submission is currently loading.
 */
export const BottomPanel: React.FC<BottomPanelProps> = (
    {
        hasError,
        showErrorPanel,
        onToggleError,
        onRevert,
        onNext,
        isSubmitted,
        canRevert,
        canSubmit,
        submitLoading,
    }) => {

    // Disable submit if code is not changed for code fix steps
    const disableSubmit = !canSubmit;

    return (
        <div className="bg-gray-50 border-t border-gray-300 px-4 py-3 flex items-center justify-between">
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
                    border border-gray-300 hover:bg-yellow-50 hover:text-yellow-700 transition-colors
                    shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2
                    focus:ring-yellow-300 cursor-pointer"
                    aria-label="Revert to original code"
                >
                    <RotateCcw size={14} className="text-gray-400"/>
                    <span>Revert Code</span>
                </button>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={onNext}
                    disabled={disableSubmit || submitLoading}
                    className={`ml-2 flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300
                        ${disableSubmit || submitLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300' : 'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 border border-blue-700'}
                    `}
                    aria-label="Submit"
                >
                    <Send size={16}/>
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};
