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
}

/**
 * Panel for Part 2 Step 2 of the study, which allows participants to attempt a fix based on the error message.
 */
export const Part2Step2Panel: React.FC<PanelProps> = (
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
        renderMarkdown
    }) => (
    <div>
        {submitLoading && <LoaderToast/>}
        {submitError && <ErrorToast message={submitError}/>}
        <CodeEditor
            code={code}
            errorMessage={error}
            readOnly={readOnly}
            onSubmitAction={onNext}
            onCodeChange={onCodeChange}
            instructions={`Edit the code to fix any errors you have identified.
            You can restore the original snippet using the "Revert Code" button.
            The error message is shown below and can be toggled using the toolbar button.
            When you're done, click "Submit". Submitting uses one attempt — if you have none left, you can’t return to this step.`}
            title="Step 2: Attempt a Code Fix"
            step={2}
            onNext={onNext}
            submitLoading={submitLoading}
            onRevert={onRevert}
            renderMarkdown={renderMarkdown}
        />
        <ConfirmChoiceModal
            open={showConfirmModal}
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
            type={ConfirmChoiceModalType.CodeFix}
        />
    </div>
);
