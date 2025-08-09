import React from "react";
import {CodeEditor} from "../editor/CodeEditor";
import {LoaderToast} from "../toast/LoaderToast";
import {ErrorToast} from "../toast/ErrorToast";
import {ConfirmChoiceModal, ConfirmChoiceModalType} from "../toast/ConfirmChoiceModal";

interface PanelProps {
    code: string;
    onCodeChange: (code: string) => void;
    readOnly: boolean;
    showError: boolean;
    onToggleError: (open: boolean) => void;
    onRevert: () => void;
    error: string;
    submitLoading: boolean;
    submitError: string | null;
    onNext: () => void;
    showConfirmModal: boolean;
    onModalCancel: () => void;
    onModalConfirm: () => void;
    renderMarkdown: boolean;
    shouldRevert?: boolean;
    onRevertComplete?: () => void;
}

/**
 * CodeFixPanel component allows users to review and edit code snippets in order to fix the present errors.
 * It provides a code editor with error messages, a revert button to restore the original code,
 * and a submit button to save changes. It also includes a confirmation modal for submitting changes.
 */
export const CodeFixPanel: React.FC<PanelProps> = (
    {
        code,
        readOnly,
        onRevert,
        error,
        submitLoading,
        submitError,
        onNext,
        showConfirmModal,
        onModalCancel,
        onModalConfirm,
        onCodeChange,
        renderMarkdown,
        shouldRevert,
        onRevertComplete
    }) => (
    <div>
        {submitLoading && <LoaderToast/>}
        <CodeEditor
            code={code}
            errorMessage={error}
            readOnly={readOnly}
            onSubmitAction={onNext}
            onCodeChange={onCodeChange}
            instructions={`Carefully review the code and the error message.
            Try to understand what the code is intended to do and what the error means. When you are ready, 
            edit the code to fix any errors you have identified.
            You can restore the original snippet using the "Revert Code" button.
            The error message is shown below and can be toggled on/off using the "Error Message" button.
            When you're done, click the "Submit" button. Submitting uses one attempt — if you have none left, you can’t return to this step.
            Reminder: NO copy-pasting is allowed — you MUST write the code yourself.
            `}
            title="Code Fix: Review and Edit The Code"
            onNext={onNext}
            submitLoading={submitLoading}
            onRevert={onRevert}
            renderMarkdown={renderMarkdown}
            shouldRevert={shouldRevert}
            onRevertComplete={onRevertComplete}
        />
        <ConfirmChoiceModal
            open={showConfirmModal}
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
            type={ConfirmChoiceModalType.CodeFix}
        />
        {submitError && <ErrorToast message={submitError}/>}
    </div>
);
