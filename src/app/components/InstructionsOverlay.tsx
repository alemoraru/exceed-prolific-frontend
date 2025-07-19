import React, {useEffect} from 'react';
import {FaTimes} from 'react-icons/fa';

interface InstructionsOverlayProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

/**
 * InstructionsOverlay component displays an overlay with instructions for participants.
 * @param open - Whether the overlay is open
 * @param onClose - Function to call when the overlay should be closed
 * @param children - Content to display inside the overlay
 */
export function InstructionsOverlay({open, onClose, children}: InstructionsOverlayProps) {
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        // Prevent background scroll
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = originalOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
            <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full mx-4 p-0">
                <button
                    className="cursor-pointer absolute top-5 right-5 text-gray-500 hover:text-gray-800 focus:outline-none"
                    aria-label="Close instructions"
                    onClick={onClose}
                    type="button"
                >
                    <FaTimes size={22} className="hover:scale-110 duration-120"/>
                </button>
                <div className="p-6 max-h-[85vh] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}
