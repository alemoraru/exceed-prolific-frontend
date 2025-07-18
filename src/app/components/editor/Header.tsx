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

export const Header: React.FC<HeaderProps> = ({
                                                  title = "Code Editor",
                                                  instructions = "Please fix the code below",
                                                  progress = 1,
                                                  maxProgress = 1,
                                                  isVisible,
                                                  onToggle,
                                              }) => {
    return (
        <div className="bg-card border-b border-border">
            {isVisible && (
                <div className="px-6 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
                        <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                {progress} of {maxProgress}
              </span>

                        </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{instructions}</p>
                </div>
            )}

            <button
                onClick={onToggle}
                className="w-full py-2 px-6 flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
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