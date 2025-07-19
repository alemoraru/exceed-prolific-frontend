import React, {useState, useEffect} from 'react';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {ConsentForm} from './ConsentForm';
import {PrimaryButton, DisabledButton} from './SurveyButtons';
import {SurveyInstructions} from './instructions/SurveyInstructions';
import {InstructionsOverlay} from './instructions/InstructionsOverlay';
import {InfoButton} from './instructions/InfoButton';
import {ExperienceSlider} from './ExperienceSlider';
import {ErrorToast} from './toast/ErrorToast';
import {LoaderToast} from './toast/LoaderToast';
import {ConfirmChoiceModal, ConfirmChoiceModalType} from './ConfirmChoiceModal';
import {QuitStudyButton} from './QuitStudyButton';
import {MCQQuestion, Part1Answers} from "@/app/utils/types";

/**
 * Part1Survey component handles the first part of the survey including consent, experience, and multiple choice questions.
 * @param participantId - The participant's ID, which is used to fetch questions and submit answers.
 * @param onComplete - Callback function to call when the survey is completed, passing the answers.
 * @param onStepChange - Callback function to notify the parent component about step changes.
 * @param onConsentDenied - Callback function to call when consent is denied, to show a thank-you message.
 */
export function Part1Survey({participantId, onComplete, onStepChange, onConsentDenied}: {
    participantId: string,
    onComplete: (answers: Part1Answers) => void,
    onStepChange: (step: number) => void,
    onConsentDenied: () => void
}) {
    // State management
    const [questions, setQuestions] = useState<MCQQuestion[] | null>(null);
    const [consent, setConsent] = useState<null | number>(null);
    const [experience, setExperience] = useState(0);
    const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>([]);
    const [step, setStep] = useState(0);
    const [mcqLoading, setMcqLoading] = useState(false);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const [consentSubmitting, setConsentSubmitting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questionsError, setQuestionsError] = useState<string | null>(null);
    const [showSubmittingLoader, setShowSubmittingLoader] = useState(false);
    const [mcqTimes, setMcqTimes] = useState<number[]>([]);
    const [mcqStartTime, setMcqStartTime] = useState<number | null>(null);
    const [allInstructionTabsVisited, setAllInstructionTabsVisited] = useState(false);
    const [showQuitModal, setShowQuitModal] = useState(false);

    // Fetch questions after consent and participantId is set
    useEffect(() => {
        if (step === 1 && participantId) {
            setQuestionsLoading(true);
            setQuestionsError(null);
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/questions?participant_id=${participantId}`)
                .then(async res => {
                    if (!res.ok) throw new Error('Failed to fetch questions');
                    const data = await res.json();
                    setQuestions(data);
                    setMcqAnswers(Array(data.length).fill(null));
                })
                .catch(e => {
                    setQuestionsError(e.message || 'Failed to fetch questions');
                })
                .finally(() => setQuestionsLoading(false));
        }
    }, [step, participantId]);

    useEffect(() => {
        onStepChange(step);
    }, [step, onStepChange]);

    // Show SubmittingLoader only if waiting for more than 3 seconds
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (mcqLoading) {
            timer = setTimeout(() => setShowSubmittingLoader(true), 3000);
        } else {
            setShowSubmittingLoader(false);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [mcqLoading]);

    // Set mcqStartTime when a new MCQ is shown
    useEffect(() => {
        if (questions && step > 2 && step - 3 < questions.length) {
            setMcqStartTime(Date.now());
        }
    }, [step, questions]);

    // Handlers
    const handleMCQSelect = (idx: number) => (ans: number) => {
        setMcqAnswers(prev => {
            const next = [...prev];
            next[idx] = ans;
            return next;
        });
    };

    // Consent submission handler
    const handleConsentNext = async () => {
        if (consent !== 0 && consent !== 1) return;
        setConsentSubmitting(true);
        setSubmissionError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/consent`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    participant_id: participantId,
                    consent: consent === 0
                })
            });
            if (!res.ok) throw new Error('Failed to submit consent');
            const data = await res.json();
            if (consent === 0 && data.participant_id) {
                // No need to setParticipantId, just store in localStorage for redundancy
                localStorage.setItem('participant_id', data.participant_id);
                setStep(1);
            } else if (consent === 1) {
                localStorage.removeItem('participant_id');
                onConsentDenied();
            }
        } catch (e) {
            setSubmissionError(e instanceof Error ? e.message : 'Failed to submit consent');
        } finally {
            setConsentSubmitting(false);
        }
    };

    // Handle experience submission and move to the next step
    const handleExperienceNext = async () => {
        if (!participantId) return;
        setSubmissionError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/experience`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({participant_id: participantId, python_yoe: experience})
            });
            if (!res.ok) throw new Error('Failed to submit experience');
        } catch (e) {
            setSubmissionError(e instanceof Error ? e.message : 'Failed to submit experience');
            return;
        }
        setStep(s => s + 1);
    };

    // Handle MCQ submission and time tracking
    const handleMCQNext = async () => {
        if (!participantId || !questions) return;
        const questionIdx = step - 3;
        const question = questions[questionIdx];
        const selectedIdx = mcqAnswers[questionIdx];
        if (selectedIdx == null) return;

        // Calculate time taken for this question
        const now = Date.now();
        const timeTaken = mcqStartTime ? now - mcqStartTime : null;
        setMcqTimes(prev => {
            const next = [...prev];
            next[questionIdx] = timeTaken ?? 0;
            return next;
        });
        setMcqLoading(true);
        setSubmissionError(null);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/question`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    participant_id: String(participantId),
                    question_id: String(question.id),
                    answer: String(selectedIdx),
                    time_taken_ms: timeTaken ?? 0
                })
            });
            if (!res.ok) throw new Error('Failed to submit MCQ answer');
            if (questionIdx >= questions.length - 1) {
                onComplete({consent, experience, mcqAnswers, questions, mcqTimes});
                return;
            } else {
                setStep(s => s + 1);
            }
        } catch (e) {
            if (e instanceof Error) setSubmissionError(e.message || 'Failed to submit MCQ answer');
        } finally {
            setMcqLoading(false);
        }
    };

    // Navigation logic
    const canContinue = (
        (step === 0 && consent !== null) ||
        (step === 1) ||
        (step === 2) ||
        (step > 2 && questions && mcqAnswers[step - 3] !== null)
    );
    const isLast = questions ? step === questions.length + 2 : false;

    // Step content renderers
    function renderConsent() {
        return <ConsentForm value={consent} onChange={setConsent} disabled={consentSubmitting}/>;
    }

    // Survey Instructions renderer
    function renderInstructions() {
        return (
            <SurveyInstructions
                requireAllTabs={step === 1}
                onAllTabsVisited={() => setAllInstructionTabsVisited(true)}
                defaultTabIndex={0}
            />
        );
    }

    // Experience slider renderer
    function renderExperience() {
        return (
            <div>
                <div className="mb-8 text-left text-gray-700 text-sm">
                    Please indicate your years of experience with Python. Use the slider or enter a number. If
                    you have no experience, set it to 0, otherwise round it to the closest whole number (e.g. 1.5
                    years should be set to 2). This information helps us understand your background.
                </div>
                <ExperienceSlider value={experience} onChange={setExperience}/>
            </div>
        );
    }

    // Multiple Choice Question renderer
    function renderMCQ() {
        if (!questions) return null;
        const idx = step - 3;
        const q = questions[idx];
        return (
            <>
                <MultipleChoiceQuestion
                    question={q.question}
                    options={q.options}
                    selected={mcqAnswers[idx]}
                    onSelect={handleMCQSelect(idx)}
                    code={q.code}
                    error={q.error}
                    disabled={mcqLoading}
                />
                {showSubmittingLoader && <LoaderToast text="Submitting your answer..."/>}
                {submissionError &&
                    <ErrorToast message={"Our apologies, something went wrong while submitting your answer. " +
                        "Please try again after a couple of seconds."}
                    />
                }
            </>
        );
    }

    // Main step content
    let stepContent: React.ReactNode = null;
    if (step === 0) stepContent = renderConsent();
    else if (step === 1) stepContent = renderInstructions();
    else if (step === 2) stepContent = renderExperience();
    else if (questions && step > 2 && step - 3 < questions.length) stepContent = renderMCQ();

    // Progress bar logic
    const totalSteps = questions ? questions.length + 1 : 1;
    let progressStep = 0;
    if (step === 2) progressStep = 1;
    else if (step > 2) progressStep = step - 1;

    // Next button handler
    const handleNext = async () => {
        if (step === 0) return handleConsentNext();
        if (step === 1) {
            if (!questionsLoading && questions && allInstructionTabsVisited) setStep(2);
            return;
        }
        if (step === 2) return handleExperienceNext();
        if (questions && step > 2 && step - 3 < questions.length) return handleMCQNext();
        if (isLast) onComplete({consent, experience, mcqAnswers, questions: questions ?? [], mcqTimes});
        else setStep(s => s + 1);
    };

    // Show quit button only after consent form and before end-of-study/consent-denied
    const showQuitButton = step > 0 && step < (questions ? questions.length + 3 : 9999);

    // Handler for quit study
    const handleQuitConfirm = () => {
        setShowQuitModal(false);
        // Call onConsentDenied to show the thank-you message and erase data
        onConsentDenied();
    };
    const handleQuitCancel = () => setShowQuitModal(false);

    return (
        <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl card-shadow p-8 relative fade-in">
            {/* Fixed Quit Study button */}
            {showQuitButton && (
                <QuitStudyButton
                    onClick={() => setShowQuitModal(true)}
                    disabled={showQuitModal}
                />
            )}
            {/* Quit Study Modal */}
            <ConfirmChoiceModal
                open={showQuitModal}
                onCancel={handleQuitCancel}
                onConfirm={handleQuitConfirm}
                type={ConfirmChoiceModalType.QuitStudy}
            />
            {/* Instructions Info Button */}
            {step > 1 && <InfoButton onClick={() => setShowInstructions(true)}/>}
            {/* Overlay for instructions */}
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions defaultTabIndex={step === 2 ? 1 : step > 2 ? 2 : 0}/>
            </InstructionsOverlay>
            <div className="text-center text-gray-600 mt-2">
                {step > 1 ? <span>Question {progressStep} of {totalSteps}</span> : <span></span>}
            </div>
            {/* Divider when not on the consent form page */}
            {step > 1 &&
                <div className="my-6 border-b border-gray-200"/>
            }
            {/* Loading and Error Messages */}
            {questionsLoading && step === 1 &&
                <div className="text-blue-700 mt-2">Loading questions...</div>
            }
            {questionsError && step === 1 &&
                <div className="text-red-700 mt-2">{questionsError}</div>
            }
            {stepContent}

            {/* Consent or experience submission error */}
            {submissionError && (step === 0 || step === 2) && (
                <ErrorToast message={
                    step === 0
                        ? "Our apologies, something went wrong while submitting your consent. Please try again after a couple of seconds."
                        : "Our apologies, something went wrong while submitting your experience. Please try again after a couple of seconds."
                }/>
            )}
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
                <DisabledButton>Previous</DisabledButton>
                <PrimaryButton
                    onClick={handleNext}
                    disabled={
                        !canContinue ||
                        mcqLoading ||
                        consentSubmitting ||
                        (step === 1 && (!questions || questionsLoading || !allInstructionTabsVisited))
                    }>
                    {isLast ? 'Next' : 'Next'}
                </PrimaryButton>
            </div>
        </div>
    );
}
