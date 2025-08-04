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
            You can revert to the original snippet if needed by clicking the "Revert Code" button.
            The error message is shown below for reference, but you can toggle it on and off using the button in the editor toolbar.
            Once you have made your changes, click the Next button to submit your fix.
            Note that once you submit, you will not be able to come back to this step to make further changes.`}
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
