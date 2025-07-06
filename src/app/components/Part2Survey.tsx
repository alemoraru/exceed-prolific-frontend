import React, {useState, useEffect} from "react";
import {CodeEditor} from "./CodeEditor";
import {ErrorMessage} from "./ErrorMessage";
import {snippets} from "../data/snippets";
import {ErrorToggle} from './ErrorToggle';
import {RevertButton} from './RevertButton';
import {PrimaryButton, SecondaryButton, DisabledButton} from './SurveyButtons';
import {SubmittingLoader} from './SubmittingLoader';
import {SubmissionError} from './SubmissionError';
import {ConfirmChoiceModal, ConfirmChoiceModalType} from './ConfirmChoiceModal';
import {SurveyInstructions} from './SurveyInstructions';
import {InstructionsOverlay} from './InstructionsOverlay';
import {InfoButton} from './InfoButton';
import {Stepper, Step, StepLabel} from '@mui/material';

/**
 * Part2Survey component handles the second part of the survey where users fix code snippets.
 * This component manages the flow of the survey, including displaying code snippets,
 * error messages, and allowing users to edit code.
 * @param onComplete - Callback function to call when the survey is completed.
 * @param progressPercent - Percentage of progress to display in the progress bar.
 * @param setOverallStep - Function to update the overall step in a parent component.
 * @param part1Total - Total number of steps in Part 1 of the survey, used to calculate overall step.
 */
export function Part2Survey(
    {
        onComplete,
        progressPercent,
        setOverallStep,
        part1Total
    }: {
        onComplete: () => void;
        progressPercent: number;
        setOverallStep: (step: number) => void;
        part1Total: number;
    }) {
    const [snippetIdx, setSnippetIdx] = useState(0);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [editedCode1, setEditedCode1] = useState(snippets[0].code);
    const [editedCode2, setEditedCode2] = useState(snippets[0].code);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dynamicErrorMsg, setDynamicErrorMsg] = useState<string | null>(null);
    const [showError1, setShowError1] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [showErrorStep1, setShowErrorStep1] = useState(true); // Step 1: open by default
    const [showError3, setShowError3] = useState(true); // Step 3: open by default
    const [showConfirmModal, setShowConfirmModal] = useState<false | 2 | 4>(false);
    const [showRevertModal, setShowRevertModal] = useState<false | 1 | 2>(false);
    const [showInstructions, setShowInstructions] = useState(false);

    // Randomly pick either 'pragmatic' or 'contingent' for each snippet for the second error message style
    const [secondErrorStyleList] = useState(() =>
        Array.from({length: snippets.length}, () => (Math.random() < 0.5 ? 'pragmatic' : 'contingent') as 'pragmatic' | 'contingent')
    );
    const currentSnippet = snippets[snippetIdx];
    const currentSecondErrorStyle = secondErrorStyleList[snippetIdx];

    // Step instructions for each step
    // Update overall step in a parent component
    useEffect(() => {
        // Calculate the overall step: part1Total + (snippetIdx * 4) + step
        setOverallStep(part1Total + (snippetIdx * 4) + step);
    }, [snippetIdx, step, setOverallStep, part1Total]);

    // Get participant_id from localStorage on mount
    useEffect(() => {
        const pid = localStorage.getItem('participant_id');
        if (pid) setParticipantId(pid);
    }, []);

    // ESC key handler for closing overlay
    React.useEffect(() => {
        if (!showInstructions) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowInstructions(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showInstructions]);

    // Navigation helpers
    const goNext = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (step === 2) {
            setSubmitLoading(true);
            setSubmitError(null);
            setDynamicErrorMsg(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/submit`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        snippet_id: currentSnippet.id,
                        code: editedCode1
                    })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    // Move to next snippet or finish
                    if (snippetIdx < snippets.length - 1) {
                        setSnippetIdx(snippetIdx + 1);
                        setStep(1);
                        setEditedCode1(snippets[snippetIdx + 1].code);
                        setEditedCode2(snippets[snippetIdx + 1].code);
                        setDynamicErrorMsg(null);
                    } else {
                        onComplete();
                    }
                } else {
                    // Show backend error in step 3
                    setDynamicErrorMsg(data.error_msg || 'Unknown error');
                    setStep(3);
                }
            } catch (e) {
                // Handle fetch error
                setSubmitError('Our apologies, something went wrong while submitting your code. ' +
                    'Please try again after a couple of seconds.');
            } finally {
                setSubmitLoading(false);
            }
            return;
        }
        if (step === 4) {
            setSubmitLoading(true);
            setSubmitError(null);
            setDynamicErrorMsg(null);
            try {
                await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/submit`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        snippet_id: currentSnippet.id,
                        code: editedCode2
                    })
                });
                // Regardless of success or error, go to the next snippet or finish
                if (snippetIdx < snippets.length - 1) {
                    setSnippetIdx(snippetIdx + 1);
                    setStep(1);
                    setEditedCode1(snippets[snippetIdx + 1].code);
                    setEditedCode2(snippets[snippetIdx + 1].code);
                    setDynamicErrorMsg(null);
                } else {
                    onComplete();
                }
            } catch (e) {
                setSubmitError('Our apologies, something went wrong while submitting your code. ' +
                    'Please try again after a couple of seconds.');
            } finally {
                setSubmitLoading(false);
            }
            return;
        }
        if (step < 4) {
            setStep((step + 1) as 1 | 2 | 3 | 4);
        } else if (snippetIdx < snippets.length - 1) {
            setSnippetIdx(snippetIdx + 1);
            setStep(1);
            setEditedCode1(snippets[snippetIdx + 1].code);
            setEditedCode2(snippets[snippetIdx + 1].code);
            setDynamicErrorMsg(null);
        } else {
            onComplete();
        }
    };
    const goPrev = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (step > 1) {
            setStep((step - 1) as 1 | 2 | 3 | 4);
        } else if (snippetIdx > 0) {
            setSnippetIdx(snippetIdx - 1);
            setStep(4);
            setEditedCode1(snippets[snippetIdx - 1].code);
            setEditedCode2(snippets[snippetIdx - 1].code);
        }
    };
    const rollback = () => setEditedCode1(currentSnippet.code);
    const rollback2 = () => setEditedCode2(currentSnippet.code);

    // Submission handler split for modal confirmation
    const handleSubmit = async () => {
        if (step === 2 || step === 4) {
            setShowConfirmModal(step);
        } else {
            goNext();
        }
    };
    const handleModalConfirm = async () => {
        setShowConfirmModal(false);
        await goNext();
    };
    const handleModalCancel = () => setShowConfirmModal(false);

    // Revert handlers
    const handleRevert = () => setShowRevertModal(step === 2 ? 1 : 2);
    const handleRevertConfirm = () => {
        setShowRevertModal(false);
        if (step === 2) rollback();
        else if (step === 4) rollback2();
    };
    const handleRevertCancel = () => setShowRevertModal(false);

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl card-shadow p-8 relative fade-in">
            {/* Info icon at top-right, not shown on consent form (not relevant for Part2) */}
            <InfoButton onClick={() => setShowInstructions(true)}/>
            {/* Overlay for instructions */}
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions defaultTabIndex={3}/>
            </InstructionsOverlay>

            {/* Stepper for snippet progress */}
            <div className="text-center text-gray-600 mt-2">
                Code Snippet {snippetIdx + 1} of {snippets.length}
            </div>

            {/* Progress bar remains */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{width: `${progressPercent}%`}}
                ></div>
            </div>

            {/* Divider for separation */}
            <div className="my-6 border-b border-gray-200"/>

            {/* Step 1: Show original code and standard error message below, with toggle open by default */}
            {step === 1 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 1: Review the Code and Error</h2>
                    <p className="mb-4 text-gray-700">Carefully review the code and the error message. Try to understand
                        what the function is intended to do and what the error means. When you are ready, click
                        Next.</p>
                    <div className="flex flex-col gap-3">
                        <div className="flex-1">
                            <div className="font-semibold mb-1">Original Code</div>
                            <CodeEditor code={currentSnippet.code} readOnly/>
                        </div>
                        <div className="flex items-start gap-4 mt-4 w-full">
                            <div className="w-1/2 flex justify-start">
                                <ErrorToggle label="View Error Message" initialOpen onToggle={setShowErrorStep1}/>
                            </div>
                        </div>
                        {showErrorStep1 && (
                            <ErrorMessage errorMessage={currentSnippet.errorMessages["standard"]}/>
                        )}
                    </div>
                    <div className="flex justify-between mt-8">
                        <DisabledButton>
                            Previous
                        </DisabledButton>
                        <PrimaryButton onClick={goNext}>
                            Next
                        </PrimaryButton>
                    </div>
                </div>
            )}
            {/* Step 2: Ask user to fix the code, show standard error message below code, revert button below code */}
            {step === 2 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 2: Attempt a Fix</h2>
                    <p className="mb-4 text-gray-700 text-left">
                        Edit the code to fix any errors you have identified. You can revert to the original snippet if
                        needed by clicking the <b>Revert to original snippet</b> button. The error message is shown
                        below for your reference - by default it is hidden, but you can toggle it on to see it.
                        Once you have made your changes, click the <b>Next</b> button to submit your fix. Note that
                        once you submit, you will not be able to come back to this step to make further changes.
                    </p>
                    <CodeEditor code={editedCode1} onChange={setEditedCode1} readOnly={submitLoading}/>
                    <div className="flex items-start gap-4 mt-4 w-full">
                        <div className="w-1/2 flex justify-start">
                            <ErrorToggle label="Error Message" onToggle={setShowError1}/>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <RevertButton onClick={handleRevert}/>
                        </div>
                    </div>
                    {/* Error message shown below, not disrupting RevertButton */}
                    {showError1 && (
                        <div className="w-full mt-3">
                            <ErrorMessage errorMessage={currentSnippet.errorMessages["standard"]}/>
                        </div>
                    )}
                    {submitLoading && <SubmittingLoader/>}
                    {submitError && <SubmissionError message={submitError}/>}
                    <div className="flex justify-between mt-8">
                        <SecondaryButton onClick={goPrev} disabled={submitLoading}>
                            Previous
                        </SecondaryButton>
                        <PrimaryButton onClick={handleSubmit} disabled={submitLoading}>
                            Next
                        </PrimaryButton>
                    </div>
                    <ConfirmChoiceModal
                        open={showConfirmModal === 2}
                        onCancel={handleModalCancel}
                        onConfirm={handleModalConfirm}
                        type={ConfirmChoiceModalType.CodeFix}
                    />
                    <ConfirmChoiceModal
                        open={showRevertModal === 1}
                        onCancel={handleRevertCancel}
                        onConfirm={handleRevertConfirm}
                        type={ConfirmChoiceModalType.CodeRevert}
                    />
                </div>
            )}
            {/* Step 3: Show code (read-only) and new error message below, with toggle open by default */}
            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 3: Review the New Error Message</h2>
                    <p className="mb-4 text-gray-700 text-left">
                        The code you submitted previously did not fully resolve all issues. Please review the new error
                        message below, which was triggered by your code changes. Use this information to help
                        you understand what went wrong. <b>Your goal is still to modify the code so that it achieves the
                        desired result as initially defined within the docstrings. </b>
                    </p>
                    <div className="flex flex-col gap-3">
                        <div className="flex-1">
                            <div className="font-semibold mb-1">Code (after your initial fix)</div>
                            <CodeEditor code={editedCode1} readOnly/>
                        </div>
                        <div className="flex items-start gap-4 mt-4 w-full">
                            <div className="w-1/2 flex justify-start">
                                <ErrorToggle label="Error Message" initialOpen onToggle={setShowError3}/>
                            </div>
                        </div>
                        {showError3 && (
                            <div className="w-full">
                                <ErrorMessage
                                    errorMessage={dynamicErrorMsg || currentSnippet.errorMessages[currentSecondErrorStyle]}
                                />
                            </div>
                        )}
                    </div>
                    <div className="flex justify-between mt-8">
                        <SecondaryButton onClick={goPrev}>
                            Previous
                        </SecondaryButton>
                        <PrimaryButton onClick={() => {
                            setStep(4);
                            setEditedCode2(editedCode1);
                        }}>
                            Next
                        </PrimaryButton>
                    </div>
                </div>
            )}
            {/* Step 4: Ask user to fix the code again, show the new error message below code, revert button below code */}
            {step === 4 && (
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
                    <CodeEditor code={editedCode2} onChange={setEditedCode2} readOnly={submitLoading}/>
                    <div className="flex items-start gap-4 mt-4 w-full">
                        <div className="w-1/2 flex justify-start">
                            <ErrorToggle label="Error Message" onToggle={setShowError2}/>
                        </div>
                        <div className="w-1/2 flex justify-end">
                            <RevertButton onClick={handleRevert}/>
                        </div>
                    </div>
                    {showError2 && (
                        <div className="w-full">
                            <ErrorMessage
                                errorMessage={dynamicErrorMsg || currentSnippet.errorMessages[currentSecondErrorStyle]}
                            />
                        </div>
                    )}
                    {submitLoading && <SubmittingLoader/>}
                    {submitError && <SubmissionError message={submitError}/>}
                    <div className="flex justify-between mt-8">
                        <SecondaryButton onClick={goPrev} disabled={submitLoading}>
                            Previous
                        </SecondaryButton>
                        <PrimaryButton onClick={handleSubmit} disabled={submitLoading}>
                            Submit
                        </PrimaryButton>
                    </div>
                    <ConfirmChoiceModal
                        open={showConfirmModal === 4}
                        onCancel={handleModalCancel}
                        onConfirm={handleModalConfirm}
                        type={ConfirmChoiceModalType.CodeFix}
                    />
                    <ConfirmChoiceModal
                        open={showRevertModal === 2}
                        onCancel={handleRevertCancel}
                        onConfirm={handleRevertConfirm}
                        type={ConfirmChoiceModalType.CodeRevert}
                    />
                </div>
            )}
        </div>
    );
}
