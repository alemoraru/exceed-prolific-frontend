import React from "react";
import {CodeEditor} from "./editor/CodeEditor";
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
    onSubmit: () => void;
    showConfirmModal: boolean;
    onModalCancel: () => void;
    onModalConfirm: () => void;
}

/**
 * Panel for Part 2 Step 4 of the study, which allows participants to make final changes to the code.
 */
export const Part2Step4Panel: React.FC<PanelProps> = (
    {
        code,
        readOnly,
        showRevertModal,
        onRevertCancel,
        onRevertConfirm,
        error,
        submitLoading,
        submitError,
        onPrev,
        onSubmit,
        showConfirmModal,
        onModalCancel,
        onModalConfirm
    }) => (
    <div>
        <h2 className="text-lg font-semibold mb-2">Step 4: Final Fix</h2>
        <p className="mb-4 text-gray-700 text-left">
            Based on the new error message and your understanding, please make your final changes to the
            code below. <b>Your goal is to modify the code so that it achieves the desired result as
            initially defined within the docstrings.</b> You can revert to the original snippet at any time
            by clicking the <b>Revert to original snippet</b> button. When you are done editing, click
            the <b>Submit</b> button to submit your final fix. Note that once you submit, you will not be
            able to come back to this step to make further changes.
        </p>
        {submitLoading && <SubmittingLoader/>}
        {submitError && <SubmissionError message={submitError}/>}
        <CodeEditor
            code={code}
            errorMessage={error}
            readOnly={readOnly}
            onSubmitAction={onSubmit}
        />
        <div className="flex justify-between mt-8">
            <SecondaryButton onClick={onPrev} disabled={submitLoading}>
                Previous
            </SecondaryButton>
            <PrimaryButton onClick={onSubmit} disabled={submitLoading}>
                Submit
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
