import React, {useEffect, useState} from "react";
import {LikertScalePanel} from "./panels/LikertScalePanel";
import {
    readabilityQuestions,
    cognitiveLoadQuestions,
    authoritativenessQuestions,
    LikertQuestion
} from "@/app/utils/likertQuestions";
import {QuitStudyButton} from "@/app/components/QuitStudyButton";
import {ConfirmChoiceModal, ConfirmChoiceModalType} from "@/app/components/toast/ConfirmChoiceModal";
import {InfoButton} from "@/app/components/instructions/InfoButton";
import {InstructionsOverlay} from "@/app/components/instructions/InstructionsOverlay";
import {SurveyInstructions} from "@/app/components/instructions/SurveyInstructions";
import {ErrorToast} from "@/app/components/toast/ErrorToast";

/**
 * Interface for the feedback request body sent to the backend.
 */
interface FeedbackRequestBody {
    participant_id: string | null;
    snippet_id: string | null;
    length?: number;
    jargon?: number;
    sentence_structure?: number;
    vocabulary?: number;
    intrinsic_load?: number;
    extraneous_load?: number;
    germane_load?: number;
    authoritativeness?: number;
    time_taken_ms?: number;
}

/**
 * Part3Survey component for subjective feedback after code attempts.
 * @param participantId - The participant's ID.
 * @param snippetId - The ID of the code snippet being evaluated.
 * @param errorMessage - Error message from previous steps, if any.
 * @param onComplete - Callback when feedback is submitted.
 * @param isMarkdown - Flag indicating if the error message should be rendered as Markdown.
 * @param onConsentDenied - Callback when consent is denied or participant quits the study.
 * @param setOverallStep - Function to update the overall step in the progress bar.
 * @param part1Total - Total steps in part 1 of the survey.
 * @param part2Total - Total steps in part 2 of the survey.
 */
export function Part3Survey(
    {
        participantId,
        errorMessage,
        snippetId,
        onComplete,
        isMarkdown,
        onConsentDenied,
        setOverallStep,
        part1Total,
        part2Total
    }: {
        participantId: string | null;
        errorMessage: string | null;
        snippetId: string | null;
        onComplete: () => void;
        isMarkdown: boolean;
        onConsentDenied: () => void;
        setOverallStep: (step: number) => void;
        part1Total: number;
        part2Total: number;
    }) {

    // State for feedback panel and submission
    const [submitLoading, setSubmitLoading] = useState(false);
    const [feedbackPanel, setFeedbackPanel] = useState(1);
    const [showQuitModal, setShowQuitModal] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [errorToastMsg, setErrorToastMsg] = useState<string | null>(null);
    const [panelStartTime, setPanelStartTime] = useState<number>(Date.now());
    const [likertAnswers, setLikertAnswers] = useState<number[]>([]);

    // Warn on refresh/leave after consent is given
    useEffect(() => {
        // Only show warning after consent is given (participantId exists)
        if (!participantId) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [participantId]);

    // Update the progress bar step on each panel
    useEffect(() => {
        setOverallStep(part1Total + part2Total + feedbackPanel - 1);
    }, [feedbackPanel, setOverallStep, part1Total, part2Total]);

    // Reset panel start time when the feedback panel changes
    useEffect(() => {
        setPanelStartTime(Date.now());
    }, [feedbackPanel]);

    // Reset Likert answers when feedbackPanel changes
    useEffect(() => {
        setLikertAnswers([]);
    }, [feedbackPanel]);

    // Handle Likert scale submission (for all feedback panels)
    const handleLikertSubmit = async (stepAnswers: number[]) => {
        setSubmitLoading(true);
        setErrorToastMsg(null);
        const timeTakenMs = Date.now() - panelStartTime;
        let apiUrl = "";
        let body: FeedbackRequestBody = {
            participant_id: participantId,
            snippet_id: snippetId,
            time_taken_ms: timeTakenMs
        };
        if (feedbackPanel === 1) {
            // Readability feedback
            apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/errors/readability-feedback`;
            body = {
                ...body,
                length: stepAnswers[0],
                jargon: stepAnswers[1],
                sentence_structure: stepAnswers[2],
                vocabulary: stepAnswers[3]
            };
        } else if (feedbackPanel === 2) {
            // Cognitive load feedback
            apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/errors/cognitive-load-feedback`;
            body = {
                ...body,
                intrinsic_load: stepAnswers[0],
                extraneous_load: stepAnswers[1],
                germane_load: stepAnswers[2]
            };
        } else if (feedbackPanel === 3) {
            // Authoritativeness feedback
            apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/errors/authoritativeness-feedback`;
            body = {
                ...body,
                authoritativeness: stepAnswers[0]
            };
        }
        try {
            console.log(`Submitting feedback for panel ${feedbackPanel}:`, body);
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            });
            if (!res.ok) {
                setErrorToastMsg('An error occurred while submitting your feedback. Please try again.');
                return;
            }
            if (feedbackPanel < 3) {
                setFeedbackPanel(feedbackPanel + 1);
                setLikertAnswers([]); // Reset answers for next panel
                window.scrollTo({top: 0, behavior: 'instant'});
            } else {
                onComplete();
            }
        } catch {
            setErrorToastMsg('An error occurred while submitting your feedback. Please check your connection and try again.');
        } finally {
            setSubmitLoading(false);
        }
    };

    let likertQuestions: LikertQuestion[];
    let likertPanelTitle: string;
    if (feedbackPanel === 1) {
        likertQuestions = readabilityQuestions;
        likertPanelTitle = "Readability";
    } else if (feedbackPanel === 2) {
        likertQuestions = cognitiveLoadQuestions;
        likertPanelTitle = "Cognitive Load";
    } else {
        likertQuestions = authoritativenessQuestions;
        likertPanelTitle = "Authoritativeness";
    }

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl card-shadow p-8 fade-in">
            <QuitStudyButton onClick={() => setShowQuitModal(true)} disabled={showQuitModal}/>
            <ConfirmChoiceModal
                open={showQuitModal}
                onCancel={() => setShowQuitModal(false)}
                onConfirm={onConsentDenied}
                type={ConfirmChoiceModalType.QuitStudy}
            />
            <InfoButton onClick={() => setShowInstructions(true)}/>
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions defaultTabIndex={4}/>
            </InstructionsOverlay>
            <div className="text-center text-gray-600 mt-0">
                Likert-scale panel {feedbackPanel} out of 3 — {likertPanelTitle} Feedback
            </div>
            {errorToastMsg && <ErrorToast message={errorToastMsg}/>}
            <LikertScalePanel
                errorMessage={errorMessage ? errorMessage : ""}
                onSubmit={handleLikertSubmit}
                submitLoading={submitLoading}
                isMarkdown={isMarkdown}
                questions={likertQuestions}
                selectedAnswers={likertAnswers}
                feedbackPanel={feedbackPanel}
                onAnswersChange={setLikertAnswers}
            />
        </div>
    );
}
