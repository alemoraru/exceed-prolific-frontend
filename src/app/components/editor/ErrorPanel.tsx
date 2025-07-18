import React from 'react';
import {AlertTriangle, X} from 'lucide-react';

interface ErrorPanelProps {
    message: string;
    isVisible: boolean;
    onClose: () => void;
    height: number;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({
                                                          message,
                                                          isVisible,
                                                          onClose,
                                                          height,
                                                      }) => {
    if (!isVisible) return null;

    return (
        <div
            className="bg-error-bg border-t border-destructive/30 overflow-y-auto transition-all duration-300 ease-out"
            style={{height: `${height}px`}}
        >
            <div className="flex items-start gap-3 p-4">
                <AlertTriangle size={18} className="text-destructive mt-0.5 flex-shrink-0"/>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-error-fg mb-2">Error Message</h4>
                    <pre className="text-sm text-error-fg/90 whitespace-pre-wrap font-mono leading-relaxed">
            {message}
          </pre>
                </div>
                <button
                    onClick={onClose}
                    className="text-error-fg/70 hover:text-error-fg transition-colors p-1 rounded-sm hover:bg-destructive/20"
                    aria-label="Close error panel"
                >
                    <X size={16}/>
                </button>
            </div>
        </div>
    );
};