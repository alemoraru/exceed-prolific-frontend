'use client';

import React, {useCallback, useMemo, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {Header} from './Header';
import {BottomPanel} from './BottomPanel';
import {ErrorPanel} from './ErrorPanel';

interface CodeEditorProps {
    title?: string;
    instructions?: string;
    code: string;
    errorMessage: string;
    progress?: number;
    maxProgress?: number;
    onSubmitAction?: (code: string) => void;
    onPrev?: () => void;
    onNext?: () => void;
    step: 1 | 2 | 3 | 4;
    submitLoading?: boolean;
    language?: string;
    readOnly?: boolean;
    autoHeight?: boolean; // new prop to control dynamic height
    onRevert?: () => void;
}

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
 * @param language - Optional programming language for syntax highlighting (default is 'python').
 * @param readOnly - Optional flag to make the editor read-only (default is false).
 */
export const CodeEditor: React.FC<CodeEditorProps> = (
    {
        title,
        instructions,
        code,
        errorMessage,
        onSubmitAction,
        onPrev,
        onNext,
        step,
        submitLoading,
        language = 'python',
        readOnly = false,
        autoHeight = false,
        onRevert,
    }) => {
    const [state, setState] = useState<CodeEditorState>({
        code: code,
        isSubmitted: false,
        showHeader: true,
        showErrorPanel: step === 1 || step === 3, // Show the error panel by default for steps 1 and 3
    });
    const extensions = useMemo(() => {
        const exts = [];
        if (language === 'python') {
            exts.push(python());
        }
        return exts;
    }, [language]);

    const handleCodeChange = useCallback((value: string) => {
        if (!state.isSubmitted && !readOnly) {
            setState(prev => ({...prev, code: value}));
        }
    }, [state.isSubmitted, readOnly]);

    const handleSubmit = useCallback(() => {
        if (!state.isSubmitted) {
            setState(prev => ({...prev, isSubmitted: true}));
            if (onSubmitAction) {
                onSubmitAction(state.code);
            }
        }
    }, [state.isSubmitted, state.code, onSubmitAction]);

    const handleRevert = useCallback(() => {
        if (!state.isSubmitted) {
            setState(prev => ({...prev, code: code}));
        }
    }, [code, state.isSubmitted]);

    const handleToggleHeader = useCallback(() => {
        setState(prev => ({...prev, showHeader: !prev.showHeader}));
    }, []);

    const handleToggleError = useCallback(() => {
        setState(prev => ({...prev, showErrorPanel: !prev.showErrorPanel}));
    }, []);

    const hasError = Boolean(errorMessage);
    const canRevert = state.code !== code;

    // Dynamic height calculation based on code length
    const minHeight = 120; // px
    const maxHeight = 480; // px
    const lineHeight = 22; // px (approximate for CodeMirror)
    const codeLines = state.code.split('\n').length;
    // If autoHeight is true, use dynamic height, else use h-[80vh]
    const editorHeight = autoHeight ? Math.max(minHeight, Math.min(maxHeight, codeLines * lineHeight + 32)) : undefined;
    const editorClass = autoHeight ? 'overflow-auto' : 'h-[80vh] overflow-auto';

    return (
        <div
            className={autoHeight ? 'flex flex-col bg-background overflow-hidden text-center border border-gray-200 rounded-lg shadow-sm' :
                'h-[80vh] flex flex-col bg-background overflow-hidden text-center border border-gray-200 rounded-lg shadow-sm'}>
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
                <div style={autoHeight ? {height: editorHeight, minHeight, maxHeight} : {}} className={editorClass}>
                    <CodeMirror
                        value={state.code}
                        onChange={handleCodeChange}
                        theme={"light"}
                        extensions={extensions}
                        readOnly={state.isSubmitted || readOnly}
                        className="h-full"
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
                    step={step}
                />
            </div>
            {/* Bottom Panel */}
            <BottomPanel
                hasError={hasError}
                showErrorPanel={state.showErrorPanel}
                onToggleError={handleToggleError}
                onRevert={typeof onRevert === 'function' ? onRevert : handleRevert}
                onPrev={onPrev || (() => {
                })}
                onNext={onNext || handleSubmit}
                isSubmitted={state.isSubmitted}
                canRevert={canRevert}
                step={step}
                submitLoading={submitLoading}
            />
        </div>
    );
};
