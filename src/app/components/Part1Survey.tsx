import React, {useState, useEffect, useMemo} from 'react';
import {questions as questionsRaw} from '../data/questions';
import {ExperienceSlider} from './ExperienceSlider';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {ConsentForm} from './ConsentForm';
import {PrimaryButton, DisabledButton} from './SurveyButtons';
import {SurveyInstructions} from './SurveyInstructions';
import {InstructionsOverlay} from './InstructionsOverlay';
import {InfoButton} from './InfoButton';

// Helper to shuffle an array
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Part1Answers interface defines the structure of answers collected in Part 1 of the survey.
 */
export interface Part1Answers {
    consent: number | null;
    experience: number;
    mcqAnswers: (number | null)[];
    randomizedQuestions: typeof questionsRaw;
}

export function Part1Survey({onComplete, onStepChange, onConsentDenied}: {
    onComplete: (answers: Part1Answers) => void,
    onStepChange: (step: number) => void,
    onConsentDenied: () => void
}) {
    // Randomize questions and options only once
    const randomizedQuestions = useMemo(() => {
        return shuffle(questionsRaw).map(q => ({
            ...q,
            options: shuffle(q.options)
        }));
    }, []);

    const [consent, setConsent] = useState<null | number>(null);
    const [experience, setExperience] = useState(0);
    const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>(Array(randomizedQuestions.length).fill(null));
    const [step, setStep] = useState(0);
    // 0 = consent, 1 = instructions, 2 = experience, 3..n = MCQs
    // For progress bar and question count, exclude consent and instructions steps
    const totalSteps = randomizedQuestions.length + 1; // experience + MCQs only
    // progressStep: 0=consent, 1=instructions, 2=experience, 3..n=MCQs
    // Show progress only for experience and MCQs
    let progressStep = 0;
    if (step === 2) progressStep = 1; // experience is step 1
    else if (step > 2) progressStep = step - 1; // MCQs: step-1 (since consent+instructions are skipped)
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [mcqLoading, setMcqLoading] = useState(false);
    const [mcqError, setMcqError] = useState<string | null>(null);
    const [consentSubmitting, setConsentSubmitting] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);

    useEffect(() => {
        onStepChange(step);
    }, [step, onStepChange]);

    const handleMCQSelect = (idx: number) => (ans: number) => {
        setMcqAnswers(prev => {
            const next = [...prev];
            next[idx] = ans;
            return next;
        });
    };

    // If the user does not consent, allow them to click Next to go to thank you page
    const canContinue = (step === 0 && consent !== null) || (step === 1) || (step === 2) || (step > 2 && mcqAnswers[step - 3] !== null);
    const isLast = step === randomizedQuestions.length + 2;

    const handleNext = async () => {
        if (step === 0) {
            if (consent !== 0 && consent !== 1) return;
            setConsentSubmitting(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/consent`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({consent: consent === 0})
                });
                if (!res.ok) throw new Error('Failed to submit consent');
                const data = await res.json();
                if (consent === 0) { // Yes, I consent
                    if (data.participant_id) {
                        setParticipantId(data.participant_id);
                        localStorage.setItem('participant_id', data.participant_id);
                    }
                    setStep(1); // Always show instructions after consent
                } else if (consent === 1) { // No, I do not consent
                    setParticipantId(null);
                    localStorage.removeItem('participant_id');
                    onConsentDenied();
                }
            } catch (e) {
                if (e instanceof Error) {
                    console.log(e.message || 'Failed to submit consent');
                } else {
                    console.log('Failed to submit consent');
                }
            } finally {
                setConsentSubmitting(false);
            }
            return;
        }
        // Only allow if consent is 'Yes' or 'No'
        if (step === 0 && consent !== 0) return;

        if (step === 1) {
            // Instructions step: just go to experience
            setStep(2);
            return;
        }

        if (step === 2) {
            // Experience step: send experience to backend
            if (!participantId) {
                console.error('No participant_id found');
                return;
            }
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/experience`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        python_yoe: experience
                    })
                });
                if (!res.ok) throw new Error('Failed to submit experience');
            } catch (e) {
                if (e instanceof Error) {
                    console.error(e.message || 'Failed to submit experience');
                } else {
                    console.error('Failed to submit experience');
                }
            }
            setStep(s => s + 1);
            return;
        }

        if (step > 2 && step - 3 < randomizedQuestions.length) {
            // MCQ step: send answer to backend
            if (!participantId) {
                console.error('No participant_id found');
                return;
            }
            const questionIdx = step - 3;
            const question = randomizedQuestions[questionIdx];
            const selectedIdx = mcqAnswers[questionIdx];
            if (selectedIdx == null) {
                console.error('No answer selected');
                return;
            }
            const answerString = question.options[selectedIdx];
            setMcqLoading(true);
            setMcqError(null);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/question`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        question_id: question.id,
                        answer: answerString
                    })
                });
                if (!res.ok) throw new Error('Failed to submit MCQ answer');
                // If this was the last MCQ, call onComplete instead of an incrementing step
                if (questionIdx >= randomizedQuestions.length - 1) {
                    onComplete({consent, experience, mcqAnswers, randomizedQuestions});
                    return;
                } else {
                    setStep(s => s + 1);
                }
            } catch (e) {
                if (e instanceof Error) {
                    setMcqError(e.message || 'Failed to submit MCQ answer');
                } else {
                    setMcqError('Failed to submit MCQ answer');
                }
            } finally {
                setMcqLoading(false);
            }
            return;
        }

        if (isLast) {
            onComplete({consent, experience, mcqAnswers, randomizedQuestions});
            // Do NOT increment step after onComplete
            return;
        }
        // Only increment step if not last
        setStep(s => s + 1);
    }

    return (
        <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl p-6 fade-in relative">
            {/* Info icon at top-right - only show after instructions page (step > 1) */}
            {step > 1 && (
                <InfoButton onClick={() => setShowInstructions(true)}/>
            )}
            {/* Overlay for instructions */}
            <InstructionsOverlay open={showInstructions} onClose={() => setShowInstructions(false)}>
                <SurveyInstructions/>
            </InstructionsOverlay>
            <div className="mb-8 text-sm text-gray-500">
                {step === 0 ? (
                    <span></span>
                ) : step === 1 ? (
                    <span></span>
                ) : (
                    <span>Question {progressStep} of {totalSteps}</span>
                )}
            </div>
            {step > 2 && step - 3 < randomizedQuestions.length ? (
                <>
                    <MultipleChoiceQuestion
                        question={randomizedQuestions[step - 3].question}
                        options={randomizedQuestions[step - 3].options}
                        selected={mcqAnswers[step - 3]}
                        onSelect={handleMCQSelect(step - 3)}
                        code={randomizedQuestions[step - 3].code}
                        error={randomizedQuestions[step - 3].error}
                        disabled={mcqLoading}
                    />
                    {mcqLoading && <div className="text-blue-700 mt-2">Submitting your answer...</div>}
                    {mcqError && <div className="text-red-700 mt-2">{mcqError}</div>}
                </>
            ) : step === 0 ? (
                <>
                    <ConsentForm value={consent} onChange={setConsent} disabled={consentSubmitting}/>
                </>
            ) : step === 1 ? (
                <SurveyInstructions/>
            ) : step === 2 ? (
                <div>
                    <div className="mb-4 text-left text-gray-700 text-sm">
                        Please indicate your years of experience with Python. Use the slider or enter a number. If
                        you have no experience, set it to 0, otherwise round it to the closest whole number (e.g. 1.5
                        years should be set to 2). This information helps us understand your background.
                    </div>
                    <ExperienceSlider value={experience} onChange={setExperience}/>
                </div>
            ) : null}
            <div className="flex justify-between mt-8">
                <DisabledButton>
                    Previous
                </DisabledButton>
                <PrimaryButton onClick={handleNext} disabled={!canContinue || mcqLoading || consentSubmitting}>
                    {isLast ? 'Next' : 'Next'}
                </PrimaryButton>
            </div>
        </div>
    );
}
