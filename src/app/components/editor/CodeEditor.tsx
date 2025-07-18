'use client';

import React, {useCallback, useMemo, useState} from "react";
import CodeMirror from '@uiw/react-codemirror';
import {python} from '@codemirror/lang-python';
import {oneDark} from '@codemirror/theme-one-dark';
import {Header} from './Header';
import {BottomPanel} from './BottomPanel';
import {ErrorPanel} from './ErrorPanel';

interface CodeEditorProps {
    title?: string;
    instructions?: string;
    initialCode: string;
    errorMessage?: string;
    progress?: number;
    maxProgress?: number;
    onSubmit: (code: string) => void;
    language?: string;
    readOnly?: boolean;
}

interface CodeEditorState {
    code: string;
    isSubmitted: boolean;
    showHeader: boolean;
    showErrorPanel: boolean;
    errorPanelHeight: number;
}

/**
 * CodeEditor component provides a code editor interface using CodeMirror.
 * @param title - Optional title for the editor.
 * @param instructions - Optional instructions to display in the header.
 * @param initialCode - The initial code to display in the editor.
 * @param errorMessage - Optional error message to display in the error panel.
 * @param progress - Optional progress value (between 0 and maxProgress) to display in the header.
 * @param maxProgress - Optional maximum progress value (default is 1).
 * @param onSubmit - Callback function to handle code submission.
 * @param language - Optional programming language for syntax highlighting (default is 'python').
 * @param readOnly - Optional flag to make the editor read-only (default is false).
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
                                                          title,
                                                          instructions,
                                                          initialCode,
                                                          errorMessage,
                                                          progress = 1,
                                                          maxProgress = 1,
                                                          onSubmit,
                                                          language = 'python',
                                                          readOnly = false,
                                                      }) => {
    const [state, setState] = useState<CodeEditorState>({
        code: initialCode,
        isSubmitted: false,
        showHeader: true,
        showErrorPanel: false,
        errorPanelHeight: 200,
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
            onSubmit(state.code);
        }
    }, [state.isSubmitted, state.code, onSubmit]);

    const handleRevert = useCallback(() => {
        if (!state.isSubmitted) {
            setState(prev => ({...prev, code: initialCode}));
        }
    }, [initialCode, state.isSubmitted]);

    const handleToggleHeader = useCallback(() => {
        setState(prev => ({...prev, showHeader: !prev.showHeader}));
    }, []);

    const handleToggleError = useCallback(() => {
        setState(prev => ({...prev, showErrorPanel: !prev.showErrorPanel}));
    }, []);

    const hasError = Boolean(errorMessage);
    const canRevert = state.code !== initialCode;

    return (
        <div className="h-screen flex flex-col bg-background overflow-hidden relative">
            {/* Header */}
            <Header
                title={title}
                instructions={instructions}
                progress={progress}
                maxProgress={maxProgress}
                isVisible={state.showHeader}
                onToggle={handleToggleHeader}
            />

            {/* Editor Container */}
            <div className="flex-1 flex flex-col min-h-0 relative">
                {/* Code Editor */}
                <div className="flex-1 overflow-auto relative">
                    <CodeMirror
                        value={state.code}
                        onChange={handleCodeChange}
                        theme={oneDark}
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
                    {/* Error Panel overlays the bottom of the editor */}
                    <ErrorPanel
                        message={errorMessage || ''}
                        isVisible={state.showErrorPanel}
                        onClose={handleToggleError}
                        height={state.errorPanelHeight}
                    />
                </div>
            </div>

            {/* Bottom Panel */}
            <BottomPanel
                hasError={hasError}
                showErrorPanel={state.showErrorPanel}
                onToggleError={handleToggleError}
                onRevert={handleRevert}
                onSubmit={handleSubmit}
                isSubmitted={state.isSubmitted}
                canRevert={canRevert}
            />
        </div>
    );
};
