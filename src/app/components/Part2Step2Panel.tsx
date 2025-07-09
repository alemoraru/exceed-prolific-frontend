import React from "react";
import {CodeEditor} from "./CodeEditor";
import {ErrorMessage} from "./ErrorMessage";
import {ErrorToggle} from "./ErrorToggle";
import {RevertButton} from "./RevertButton";
import {PrimaryButton, SecondaryButton} from "./SurveyButtons";
import {SubmittingLoader} from "./SubmittingLoader";
import {SubmissionError} from "./SubmissionError";
import {ConfirmChoiceModal, ConfirmChoiceModalType} from "./ConfirmChoiceModal";

interface PanelProps {
    code: string;
    onCodeChange: (code: string) => void;
    readOnly: boolean;
    showError: boolean;
    onToggleError: (open: boolean) => void;
    onRevert: () => void;
    showRevertModal: boolean;
    onRevertCancel: () => void;
    onRevertConfirm: () => void;
    error: string;
    submitLoading: boolean;
    submitError: string | null;
    onPrev: () => void;
    onNext: () => void;
    showConfirmModal: boolean;
    onModalCancel: () => void;
    onModalConfirm: () => void;
}

/**
 * Panel for Part 2 Step 2 of the study, which allows participants to attempt a fix based on the error message.
 */
export const Part2Step2Panel: React.FC<PanelProps> = (
    {
        code,
        onCodeChange,
        readOnly,
        showError,
        onToggleError,
        onRevert,
        showRevertModal,
        onRevertCancel,
        onRevertConfirm,
        error,
        submitLoading,
        submitError,
        onPrev,
        onNext,
        showConfirmModal,
        onModalCancel,
        onModalConfirm
    }) => (
    <div>
        <h2 className="text-lg font-semibold mb-2">Step 2: Attempt a Fix</h2>
        <p className="mb-4 text-gray-700 text-left">
            Edit the code to fix any errors you have identified. You can revert to the original snippet if
            needed by clicking the <b>Revert to original snippet</b> button. The error message is shown
            below for your reference - by default it is hidden, but you can toggle it on to see it.
            Once you have made your changes, click the <b>Next</b> button to submit your fix. Note that
            once you submit, you will not be able to come back to this step to make further changes.
        </p>
        {submitLoading && <SubmittingLoader/>}
        {submitError && <SubmissionError message={submitError}/>}
        <CodeEditor code={code} onChange={onCodeChange} readOnly={readOnly}/>
        <div className="flex items-start gap-4 mt-4 w-full">
            <div className="w-1/2 flex justify-start">
                <ErrorToggle label="Error Message" onToggle={onToggleError}/>
            </div>
            <div className="w-1/2 flex justify-end">
                <RevertButton onClick={onRevert}/>
            </div>
        </div>
        {showError && (
            <div className="w-full mt-3">
                <ErrorMessage errorMessage={error}/>
            </div>
        )}
        <div className="flex justify-between mt-8">
            <SecondaryButton onClick={onPrev} disabled={submitLoading}>
                Previous
            </SecondaryButton>
            <PrimaryButton onClick={onNext} disabled={submitLoading}>
                Next
            </PrimaryButton>
        </div>
        <ConfirmChoiceModal
            open={showConfirmModal}
            onCancel={onModalCancel}
            onConfirm={onModalConfirm}
            type={ConfirmChoiceModalType.CodeFix}
        />
        <ConfirmChoiceModal
            open={showRevertModal}
            onCancel={onRevertCancel}
            onConfirm={onRevertConfirm}
            type={ConfirmChoiceModalType.CodeRevert}
        />
    </div>
);
