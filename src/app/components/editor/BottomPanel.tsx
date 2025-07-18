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

export const BottomPanel: React.FC<BottomPanelProps> = ({
                                                            hasError,
                                                            showErrorPanel,
                                                            onToggleError,
                                                            onRevert,
                                                            onSubmit,
                                                            isSubmitted,
                                                            canRevert,
                                                        }) => {
    return (
        <div className="bg-card border-t border-border px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
                {hasError && (
                    <button
                        onClick={onToggleError}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm transition-colors ${
                            showErrorPanel
                                ? 'bg-destructive/20 text-destructive'
                                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-sm text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? 'bg-success/20 text-success cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
                aria-label={isSubmitted ? "Code submitted" : "Submit code"}
            >
                <Send size={14}/>
                <span>{isSubmitted ? 'Submitted' : 'Submit'}</span>
            </button>
        </div>
    );
};