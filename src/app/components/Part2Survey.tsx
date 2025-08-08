import React, {useState, useEffect} from "react";
import {SurveyInstructions} from './instructions/SurveyInstructions';
import {InstructionsOverlay} from './instructions/InstructionsOverlay';
import {InfoButton} from './instructions/InfoButton';
import {CodeFixPanel} from "./panels/CodeFixPanel";
import {CodeSnippet} from "@/app/utils/types";
import {ConfirmChoiceModal, ConfirmChoiceModalType} from './toast/ConfirmChoiceModal';
import {QuitStudyButton} from './QuitStudyButton';
import {ErrorToast} from './toast/ErrorToast';
import {useCheatingDetection} from '../hooks/useCheatingDetection';
import {Mail} from "lucide-react";
import Link from "next/link";

/**
 * Part2Survey component handles the second part of the survey where users fix code snippets.
 * This component manages the flow of the survey, including displaying code snippets,
 * error messages, and allowing users to edit code.
 * @param participantId - The participant's ID, used to fetch and submit code snippets.
 * @param setOverallStep - Function to update the overall step in a parent component.
 * @param part1Total - Total number of steps in Part 1 of the survey, used to calculate the overall step.
 * @param onConsentDenied - Callback function to call when the user denies consent.
 * @param onComplete - Callback function to call when the survey is completed.
 */
export function Part2Survey(
    {
        participantId,
        setOverallStep,
        part1Total,
        onConsentDenied,
        onComplete
    }: {
        participantId: string | null;
        setOverallStep: (step: number) => void;
        part1Total: number;
        onConsentDenied: () => void;
        onComplete: (errorMessage: string, codeSnippetId: string, renderMarkdown: boolean) => void;
    }) {
    // State management
    const [currentSnippet, setCurrentSnippet] = useState<CodeSnippet>();
    const [loadingSnippet, setLoadingSnippet] = useState(true);
    const [snippetError, setSnippetError] = useState<string | null>(null);
    const [editedCode, setEditedCode] = useState("");
    const [renderMarkdown, setRenderMarkdown] = useState(false);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showError, setShowError] = useState(true);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [attemptCount, setAttemptCount] = useState(1); // Track the number of attempts
    const [attemptStartTime, setAttemptStartTime] = useState<number>(Date.now());

    // Track if cheating detection should be active
    useCheatingDetection(Boolean(participantId) && !showQuitModal && !snippetError);

    // Progress bar step (always show code fix step)
    useEffect(() => {
        setOverallStep(part1Total + 1); // Part 1 total steps + 1 for code fix step
    }, [setOverallStep, part1Total]);

    // Warn on refresh/leave after consent is given
    useEffect(() => {
        if (!participantId) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [participantId]);

    // Fetch assigned code snippet and error
    useEffect(() => {
        if (!participantId) return;
        const fetchSnippet = async () => {
            setLoadingSnippet(true);
            setSnippetError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/snippet?participant_id=${participantId}`);
                if (!res.ok) throw new Error('Failed to fetch code snippet');
                const snippet: CodeSnippet = await res.json();
                setCurrentSnippet(snippet);
                setEditedCode(snippet.code);
                setRenderMarkdown(snippet.markdown)
            } catch (err) {
                setSnippetError(err instanceof Error ? err.message : 'Failed to load snippet');
            } finally {
                setLoadingSnippet(false);
            }
        };
        fetchSnippet();
    }, [participantId]);

    // When a new attempt starts (after a failed submission), reset attemptStartTime
    useEffect(() => {
        setAttemptStartTime(Date.now());
    }, [attemptCount]);

    // Handle code fix submission (used for both initial and follow-up attempts)
    const handleSubmit = async () => {
        setSubmitLoading(true);
        setSubmitError(null);
        setShowConfirmModal(false);

        const timeTakenMs = Date.now() - attemptStartTime;
        const minLoaderMs = 1500;
        const startTime = Date.now();

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/code/submit`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    participant_id: participantId,
                    snippet_id: currentSnippet?.id,
                    code: editedCode,
                    time_taken_ms: timeTakenMs
                })
            });
            const data = await res.json();
            const elapsed = Date.now() - startTime;
            if (elapsed < minLoaderMs) {
                await new Promise(resolve => setTimeout(resolve, minLoaderMs - elapsed));
            }
            if (data.status === 'success') {
                onComplete(currentSnippet?.error || "", currentSnippet?.id || "", renderMarkdown);
                return;
            } else {
                setAttemptCount(attemptCount + 1);
                setEditedCode(currentSnippet?.code || "")
                if (attemptCount + 1 > 3) {
                    onComplete(currentSnippet?.error || "", currentSnippet?.id || "", renderMarkdown);
                    return;
                }
            }
        } catch {
            const elapsed = Date.now() - startTime;
            if (elapsed < minLoaderMs) {
                await new Promise(resolve => setTimeout(resolve, minLoaderMs - elapsed));
            }
            setSubmitError('Our apologies, something went wrong while submitting your code. Please try again after a couple of seconds.');
        } finally {
            setSubmitLoading(false);
        }
    };

    // long error wait state management and detection
    const [showLongWait, setShowLongWait] = useState(false);
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (loadingSnippet) {
            timer = setTimeout(() => setShowLongWait(true), 5000);
        } else {
            setShowLongWait(false);
        }
        return () => clearTimeout(timer);
    }, [loadingSnippet]);

    if (loadingSnippet) {
        return (
            <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl card-shadow p-8 text-center">
                <div className="flex flex-col items-center justify-center h-64">
                    <div
                        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                    <div className="text-lg text-gray-700">Loading code and error message...</div>
                    {showLongWait && (
                        <div className="mt-4 text-yellow-600 text-base">Still working, please wait…</div>
                    )}
                </div>
                <div className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4"/>
                    For support regarding long loading times or failures, please reach out to us via Prolific or send an
                    email to
                    <Link href="mailto:amoraru@tudelft.nl" className="underline hover:text-blue-600">
                        amoraru@tudelft.nl
                    </Link>
                </div>
            </div>
        );
    }

    if (snippetError || !currentSnippet) {
        return (
            <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl card-shadow p-8 text-center text-red-600">
                {'Failed to load Python code snippet and error message.'}
                <div className="mt-6 text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4"/>
                    For support regarding failures such as this, please reach out to us via Prolific or send an email to
                    <Link href="mailto:amoraru@tudelft.nl" className="underline hover:text-blue-600">
                        amoraru@tudelft.nl
                    </Link>
                </div>
            </div>

        );
    }

    // Only show code fix panel (no review step)
    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl card-shadow p-6 relative fade-in">
            <QuitStudyButton onClick={() => setShowQuitModal(true)} disabled={showQuitModal}/>
            <ConfirmChoiceModal
                open={showQuitModal}
                onCancel={() => setShowQuitModal(false)}
                onConfirm={onConsentDenied}
                type={ConfirmChoiceModalType.QuitStudy}
            />
            <ConfirmChoiceModal
                open={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={handleSubmit}
                type={ConfirmChoiceModalType.CodeFix}
            />
            {submitError && <ErrorToast message={submitError}/>}
            <InfoButton onClick={() => setShowInstructions(true)}/>
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions defaultTabIndex={3}/>
            </InstructionsOverlay>
            <div className="text-center text-gray-600 mt-0">
                Attempt {attemptCount} out of 3
            </div>
            <div className="mt-6"/>
            <CodeFixPanel
                code={editedCode}
                onCodeChange={setEditedCode}
                readOnly={submitLoading}
                showError={showError}
                onToggleError={setShowError}
                error={currentSnippet.error}
                submitLoading={submitLoading}
                submitError={submitError}
                onNext={() => setShowConfirmModal(true)}
                showConfirmModal={showConfirmModal}
                onModalCancel={() => setShowConfirmModal(false)}
                onModalConfirm={handleSubmit}
                onRevert={() => setEditedCode(currentSnippet.code || "")}
                renderMarkdown={renderMarkdown}
            />
        </div>
    );
}
