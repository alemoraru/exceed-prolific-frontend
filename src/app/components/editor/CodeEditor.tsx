'use client';

import React, {useCallback, useState, useRef, useEffect} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {Header} from './Header';
import {BottomPanel} from './BottomPanel';
import {ErrorPanel} from './ErrorPanel';
import {ConfirmChoiceModal, ConfirmChoiceModalType} from "../toast/ConfirmChoiceModal";

/**
 * Props for the CodeEditor component.
 */
interface CodeEditorProps {
    title?: string;
    instructions?: string;
    code: string;
    errorMessage: string;
    progress?: number;
    maxProgress?: number;
    onSubmitAction?: (code: string) => void;
    onNext?: () => void;
    step: 1 | 2;
    submitLoading?: boolean;
    language?: string;
    readOnly?: boolean;
    autoHeight?: boolean;
    onRevert?: () => void;
    onCodeChange?: (code: string) => void;
    renderMarkdown: boolean;
}

/**
 * Manage the state of the code editor, including the current code,
 * submission status, header visibility, and error panel visibility.
 */
interface CodeEditorState {
    code: string;
    isSubmitted: boolean;
    showHeader: boolean;
    showErrorPanel: boolean;
}

/**
 * CodeEditor component provides a code editor interface using CodeMirror.
 * @param title - Optional title for the editor.
 * @param instructions - Optional instructions to display in the header.
 * @param code - The code to display in the editor.
 * @param errorMessage - Optional error message to display in the error panel.
 * @param onSubmit - Callback function to handle code submission.
 * @param readOnly - Optional flag to make the editor read-only (default is false).
 * @param autoHeight - Optional flag to enable auto height for the editor (default is false).
 * @param onRevert - Callback function to handle code revert action.
 * @param onCodeChange - Callback function to handle code changes.
 * @param renderMarkdown - Flag to determine if markdown rendering is enabled.
 */
export const CodeEditor: React.FC<CodeEditorProps> = (
    {
        title,
        instructions,
        code,
        errorMessage,
        onSubmitAction,
        onNext,
        step,
        submitLoading,
        readOnly = false,
        autoHeight = false,
        onRevert,
        onCodeChange,
        renderMarkdown
    }) => {

    // Store the true original code only once on mount
    const originalCodeRef = useRef<string>("");
    useEffect(() => {
        if (originalCodeRef.current === "") {
            originalCodeRef.current = code;
        }
    }, [code]);

    // Initialize state with the original code
    const [state, setState] = useState<CodeEditorState>({
        code: code,
        isSubmitted: false,
        showHeader: true,
        showErrorPanel: true
    });

    // State to control the revert modal visibility
    const [showRevertModal, setShowRevertModal] = useState(false);

    // Effect to reset the code when the step changes
    const handleCodeChange = useCallback((value: string) => {
        if (!state.isSubmitted && !readOnly) {
            setState(prev => ({...prev, code: value}));
            if (onCodeChange) onCodeChange(value);
        }
    }, [state.isSubmitted, readOnly, onCodeChange]);

    // Handle code submission
    const handleSubmit = useCallback(() => {
        if (!state.isSubmitted) {
            setState(prev => ({...prev, isSubmitted: true}));
            if (onSubmitAction) {
                onSubmitAction(state.code);
            }
        }
    }, [state.isSubmitted, state.code, onSubmitAction]);

    // Handle revert click to show the confirmation modal
    const handleRevertClick = useCallback(() => {
        setShowRevertModal(true);
    }, []);

    // Handle revert confirmation
    const handleRevertConfirm = useCallback(() => {
        setShowRevertModal(false);
        setState(prev => ({...prev, code: originalCodeRef.current}));
        if (onRevert) onRevert();
        if (onCodeChange) onCodeChange(originalCodeRef.current);
    }, [onRevert, onCodeChange]);

    // Handle revert cancel
    const handleRevertCancel = useCallback(() => {
        setShowRevertModal(false);
    }, []);

    // Handle header toggle
    const handleToggleHeader = useCallback(() => {
        setState(prev => ({...prev, showHeader: !prev.showHeader}));
    }, []);

    // Handle error panel toggle
    const handleToggleError = useCallback(() => {
        setState(prev => ({...prev, showErrorPanel: !prev.showErrorPanel}));
    }, []);

    // Determine if there is an error and if the code can be reverted
    const hasError = Boolean(errorMessage);
    const canRevert = state.code !== originalCodeRef.current;

    // If autoHeight is true, do not enforce height; otherwise, use h-[80vh]
    const editorClass = autoHeight ? 'overflow-auto' : 'h-[80vh] overflow-auto';

    return (
        <div
            className={autoHeight ? 'flex flex-col bg-background overflow-hidden text-center border border-black rounded-lg shadow-sm' :
                'h-[80vh] flex flex-col bg-background overflow-hidden text-center border border-black rounded-lg shadow-sm'}>
            {/* Header */}
            <Header
                title={title}
                instructions={instructions}
                isVisible={state.showHeader}
                onToggle={handleToggleHeader}
            />
            {/* Editor Container */}
            <div className="flex flex-col min-h-0 flex-1 text-left">
                {/* Code Editor */}
                <div className={editorClass}>
                    <CodeMirror
                        value={state.code}
                        onChange={handleCodeChange}
                        theme={"light"}
                        extensions={[python()]}
                        readOnly={state.isSubmitted || readOnly}
                        className={autoHeight ? "h-auto" : "h-full"}
                        basicSetup={{
                            lineNumbers: true,
                            foldGutter: true,
                            dropCursor: false,
                            allowMultipleSelections: false,
                            indentOnInput: true,
                            bracketMatching: true,
                            closeBrackets: true,
                            autocompletion: true,
                            highlightSelectionMatches: false,
                        }}
                    />
                </div>
                <ErrorPanel
                    message={errorMessage}
                    isVisible={state.showErrorPanel}
                    onCloseAction={handleToggleError}
                    renderMarkdown={renderMarkdown}
                />
            </div>
            {/* Bottom Panel */}
            <BottomPanel
                hasError={hasError}
                showErrorPanel={state.showErrorPanel}
                onToggleError={handleToggleError}
                onRevert={handleRevertClick}
                onNext={onNext || handleSubmit}
                isSubmitted={state.isSubmitted}
                canRevert={canRevert}
                step={step}
                submitLoading={submitLoading}
            />
            {/* Revert Modal */}
            <ConfirmChoiceModal
                open={showRevertModal}
                onCancel={handleRevertCancel}
                onConfirm={handleRevertConfirm}
                type={ConfirmChoiceModalType.CodeRevert}
            />
        </div>
    );
};
