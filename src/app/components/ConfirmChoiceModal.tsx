import React, {useEffect} from "react";
import {FaRegKeyboard} from "react-icons/fa";
import {MdSend} from "react-icons/md";
import {MdRestore} from "react-icons/md";
import {MdOutlineExitToApp} from "react-icons/md";
import {MdOutlineThumbUp} from "react-icons/md";

export enum ConfirmChoiceModalType {
    CodeFix = "CodeFix",
    CodeRevert = "CodeRevert",
    QuitStudy = "QuitStudy"
}

export interface ConfirmChoiceModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: () => void;
    type: ConfirmChoiceModalType;
}

/**
 * ConfirmChoiceModal component displays a modal dialog to confirm user choices.
 * @param open - Whether the modal is open
 * @param onCancel - Function to call when the user cancels the action
 * @param onConfirm - Function to call when the user confirms the action
 * @param type - Type of confirmation modal to display (CodeFix or CodeRevert)
 */
export function ConfirmChoiceModal(
    {
        open,
        onCancel,
        onConfirm,
        type
    }: ConfirmChoiceModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onCancel]);

    if (!open) return null;

    let title = "";
    let message: React.ReactNode = null;
    let confirmLabel = "";
    let cancelLabel = "";
    let confirmIcon: React.ReactNode = null;
    let cancelIcon: React.ReactNode = null;

    if (type === ConfirmChoiceModalType.CodeFix) {
        title = "Confirm Code Submission";
        message = (
            <>
                Are you sure you want to submit your code fix for this step? <b>Once you submit, you will not be able to
                return to this step to make further changes.</b> Please make sure you are satisfied with your edits
                before submitting.
            </>
        );
        confirmLabel = "Submit Code Fix";
        cancelLabel = "Keep Editing";
        confirmIcon = <MdSend className="text-lg"/>;
        cancelIcon = <FaRegKeyboard className="text-lg"/>;
    } else if (type === ConfirmChoiceModalType.CodeRevert) {
        title = "Revert to Original Code?";
        message = (
            <>
                Are you sure you want to revert your changes? <b>All edits for this step will be lost</b> and the
                original code that was provided will be restored. Please confirm if you want to proceed with this
                action.
            </>
        );
        confirmLabel = "Revert Code";
        cancelLabel = "Keep Editing";
        confirmIcon = <MdRestore className="text-lg"/>;
        cancelIcon = <FaRegKeyboard className="text-lg"/>;
    } else if (type === ConfirmChoiceModalType.QuitStudy) {
        title = "Quit & Revoke Consent?";
        message = (
            <>
                Are you sure you want to quit the study and revoke your consent? <b>If you proceed, all your data will
                be erased and you will no longer receive compensation for your time spent on the study so far.</b> This
                action cannot be undone.
            </>
        );
        confirmLabel = "Quit & Revoke Consent";
        cancelLabel = "Continue Study";
        confirmIcon = <MdOutlineExitToApp className="text-lg"/>;
        cancelIcon = <MdOutlineThumbUp className="text-lg"/>;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
                <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
                <p className="mb-6 text-gray-700 text-center">{message}</p>

                {/* Action buttons, which are centered, and show either confirm or cancel icons */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                        onClick={onCancel}
                        type="button"
                    >
                        {cancelIcon}
                        {cancelLabel}
                    </button>
                    <button
                        className={`cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition 
                        shadow ${type === ConfirmChoiceModalType.QuitStudy ? 'bg-red-600 text-white hover:bg-red-700 ' +
                            'border border-red-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        onClick={onConfirm}
                        type="button"
                    >
                        {confirmIcon}
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
