import React, {useState, useEffect} from "react";
import {SurveyInstructions} from './SurveyInstructions';
import {InstructionsOverlay} from './InstructionsOverlay';
import {InfoButton} from './InfoButton';
import {Part2Step1Panel} from "./Part2Step1Panel";
import {Part2Step2Panel} from "./Part2Step2Panel";
import {Part2Step3Panel} from "./Part2Step3Panel";
import {Part2Step4Panel} from "./Part2Step4Panel";
import {CodeSnippet} from "@/app/utils/types";

/**
 * Part2Survey component handles the second part of the survey where users fix code snippets.
 * This component manages the flow of the survey, including displaying code snippets,
 * error messages, and allowing users to edit code.
 * @param onComplete - Callback function to call when the survey is completed.
 * @param setOverallStep - Function to update the overall step in a parent component.
 * @param part1Total - Total number of steps in Part 1 of the survey, used to calculate overall step.
 */
export function Part2Survey(
    {
        onComplete,
        setOverallStep,
        part1Total
    }: {
        onComplete: () => void;
        setOverallStep: (step: number) => void;
        part1Total: number;
    }) {
    // State management
    const [snippetIdx, setSnippetIdx] = useState(0);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const snippetIds = ["0", "1", "2", "3"];
    const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet | null>(null);
    const [loadingSnippet, setLoadingSnippet] = useState(true);
    const [snippetError, setSnippetError] = useState<string | null>(null);
    const [editedCode1, setEditedCode1] = useState("");
    const [editedCode2, setEditedCode2] = useState("");
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showError1, setShowError1] = useState(false);
    const [showError2, setShowError2] = useState(false);
    const [showErrorStep1, setShowErrorStep1] = useState(true);
    const [showError3, setShowError3] = useState(true);
    const [showConfirmModal, setShowConfirmModal] = useState<false | 2 | 4>(false);
    const [showRevertModal, setShowRevertModal] = useState<false | 1 | 2>(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [rephrasedError, setRephrasedError] = useState<string>("");
    const [submitStartTime, setSubmitStartTime] = useState<number | null>(null);

    // Step and snippet index effects
    useEffect(() => {
        setOverallStep(part1Total + (snippetIdx * 4) + step);
    }, [snippetIdx, step, setOverallStep, part1Total]);

    // Participant ID effect
    useEffect(() => {
        setParticipantId(localStorage.getItem('participant_id'));
    }, []);

    // Effect to handle the ESC keyboard key for closing instructions overlay
    useEffect(() => {
        if (!showInstructions) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowInstructions(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showInstructions]);

    // Effect to fetch the current code snippet based on index and participant ID
    useEffect(() => {
        const fetchSnippet = async () => {
            setLoadingSnippet(true);
            setSnippetError(null);
            try {
                if (!participantId) throw new Error("No participant_id found");
                const id = snippetIds[snippetIdx];
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/snippet/${id}?participant_id=${participantId}`);
                if (!res.ok) throw new Error(`Failed to fetch snippet ${id}`);
                const snippet: CodeSnippet = await res.json();
                setCurrentSnippet(snippet);
                setEditedCode1(snippet.code || "");
                setEditedCode2(snippet.code || "");
                setRephrasedError("");
            } catch (err) {
                setSnippetError(err instanceof Error ? err.message : 'Failed to load snippet');
                setCurrentSnippet(null);
            } finally {
                setLoadingSnippet(false);
            }
        };
        fetchSnippet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [snippetIdx, participantId]);

    // Track when we enter step 2 or 4, and start timer accordingly
    useEffect(() => {
        if (step === 2 || step === 4) {
            setSubmitStartTime(Date.now());
        } else {
            setSubmitStartTime(null);
        }
    }, [step]);

    // Next and Previous navigation helpers
    const goNext = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (!currentSnippet) return;
        if (step === 2 || step === 4) {
            setSubmitLoading(true);
            setSubmitError(null);
            let time_taken_ms = 0;
            if (submitStartTime) {
                time_taken_ms = Date.now() - submitStartTime;
            }
            try {
                const code = step === 2 ? editedCode1 : editedCode2;
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/submit`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        snippet_id: currentSnippet.id,
                        code: code,
                        time_taken_ms: time_taken_ms
                    })
                });
                const data = await res.json();
                if (step === 2 && data.status !== 'success') {
                    setRephrasedError(data.error_msg || 'Unknown error');
                    setStep(3);
                } else if (snippetIdx < snippetIds.length - 1) {
                    setSnippetIdx(snippetIdx + 1);
                    setStep(1);
                } else {
                    onComplete();
                }
            } catch {
                setSubmitError('Our apologies, something went wrong while submitting your code. Please try again after a couple of seconds.');
            } finally {
                setSubmitLoading(false);
            }
            return;
        }
        if (step < 4) {
            setStep((step + 1) as 1 | 2 | 3 | 4);
        } else if (snippetIdx < snippetIds.length - 1) {
            setSnippetIdx(snippetIdx + 1);
            setStep(1);
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
        }
    };

    // Rollback functions to reset code editors to the original snippet code (for Step 2 and Step 4)
    const rollback = () => currentSnippet && setEditedCode1(currentSnippet.code);
    const rollback2 = () => currentSnippet && setEditedCode2(currentSnippet.code);

    // Submit handlers for modals (confirming code fixes or reverting changes)
    const handleSubmit = () => {
        if (step === 2 || step === 4) setShowConfirmModal(step);
        else goNext();
    };

    // Modal handlers for confirmation and revert actions
    const handleModalConfirm = async () => {
        setShowConfirmModal(false);
        setShowError1(false);
        setShowError2(false);
        setShowError3(false);
        setShowErrorStep1(false);
        await goNext();
    };
    const handleModalCancel = () => setShowConfirmModal(false);
    const handleRevert = () => setShowRevertModal(step === 2 ? 1 : 2);
    const handleRevertConfirm = () => {
        setShowRevertModal(false);
        if (step === 2) rollback();
        else if (step === 4) rollback2();
    };
    const handleRevertCancel = () => setShowRevertModal(false);

    // UI for loading and error states (initial fetch of code snippet)
    if (loadingSnippet) {
        return null; // Optionally show a loading spinner here
    }
    if (snippetError || !currentSnippet) {
        return <div
            className="w-full max-w-5xl mx-auto bg-white rounded-2xl card-shadow p-8 text-center text-red-600">{snippetError || 'Failed to load snippet.'}</div>;
    }

    const getErrorMessage = (): string => currentSnippet?.error || '';

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl card-shadow p-6 relative fade-in">
            {/* Info icon at top-right, not shown on consent form (not relevant for Part2) */}
            <InfoButton onClick={() => setShowInstructions(true)}/>

            {/* Overlay for instructions */}
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions defaultTabIndex={3}/>
            </InstructionsOverlay>

            {/* Stepper for snippet progress */}
            <div className="text-center text-gray-600 mt-2">
                Code Snippet {snippetIdx + 1} of {snippetIds.length}
            </div>

            {/* Divider for separation */}
            <div className="mt-6 border-b border-gray-200"/>

            {/* Step 1: Show original code and standard error message below, with toggle open by default */}
            {step === 1 && (
                <Part2Step1Panel
                    code={currentSnippet.code}
                    error={getErrorMessage()}
                    showError={showErrorStep1}
                    onNext={goNext}
                />
            )}
            {/* Step 2: Ask user to fix the code, show standard error message below code, revert button below code */}
            {step === 2 && (
                <Part2Step2Panel
                    code={editedCode1}
                    onCodeChange={setEditedCode1}
                    readOnly={submitLoading}
                    showError={showError1}
                    onToggleError={setShowError1}
                    onRevert={handleRevert}
                    showRevertModal={showRevertModal === 1}
                    onRevertCancel={handleRevertCancel}
                    onRevertConfirm={handleRevertConfirm}
                    error={getErrorMessage()}
                    submitLoading={submitLoading}
                    submitError={submitError}
                    onPrev={goPrev}
                    onNext={handleSubmit}
                    showConfirmModal={showConfirmModal === 2}
                    onModalCancel={handleModalCancel}
                    onModalConfirm={handleModalConfirm}
                />
            )}
            {/* Step 3: Show code (read-only) and new error message below, with toggle open by default */}
            {step === 3 && (
                <Part2Step3Panel
                    code={currentSnippet.code}
                    error={rephrasedError}
                    showError={showError3}
                    onToggleError={setShowError3}
                    onPrev={goPrev}
                    onNext={() => {
                        setStep(4);
                        setEditedCode2(currentSnippet.code || "");
                    }}
                />
            )}
            {/* Step 4: Ask user to fix the code again, show the new error message below code, revert button below code */}
            {step === 4 && (
                <Part2Step4Panel
                    code={editedCode2}
                    onCodeChange={setEditedCode2}
                    readOnly={submitLoading}
                    showError={showError2}
                    onToggleError={setShowError2}
                    onRevert={handleRevert}
                    showRevertModal={showRevertModal === 2}
                    onRevertCancel={handleRevertCancel}
                    onRevertConfirm={handleRevertConfirm}
                    error={rephrasedError}
                    submitLoading={submitLoading}
                    submitError={submitError}
                    onPrev={goPrev}
                    onSubmit={handleSubmit}
                    showConfirmModal={showConfirmModal === 4}
                    onModalCancel={handleModalCancel}
                    onModalConfirm={handleModalConfirm}
                />
            )}
        </div>
    );
}
