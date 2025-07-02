import React, {useState, useEffect, useMemo} from 'react';
import {questions as questionsRaw} from '../data/questions';
import {ExperienceSlider} from './ExperienceSlider';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {ConsentForm} from './ConsentForm';

// Helper to shuffle an array
function shuffle<T>(arr: T[]): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

const consentQuestion = {
    question: 'Do you consent to participate in this study under the above conditions?',
    options: ['Yes, I consent', 'No, I do not consent'],
};

export function Part1Survey({onComplete, onStepChange, onConsentDenied}: {
    onComplete: (answers: any) => void,
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

    // 0 = consent, 1 = experience, 2..n = MCQs
    const [consent, setConsent] = useState<null | number>(null);
    const [experience, setExperience] = useState(0);
    const [mcqAnswers, setMcqAnswers] = useState<(number | null)[]>(Array(randomizedQuestions.length).fill(null));
    const [step, setStep] = useState(0);

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
    const canContinue = (step === 0 && consent !== null) || (step === 1) || (step > 1 && mcqAnswers[step - 2] !== null);
    const isLast = step === randomizedQuestions.length + 1;

    const handleNext = () => {
        if (step === 0 && consent === 1) {
            // User did not consent, go to thank you page
            onConsentDenied();
            return;
        }

        // Only allow if consent is 'Yes' or 'No'
        if (step === 0 && consent !== 0) return;

        if (isLast) {
            onComplete({consent, experience, mcqAnswers, randomizedQuestions});
        } else {
            setStep(s => s + 1);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl p-8 fade-in">
            <div className="mb-8 text-sm text-gray-500">Question {step + 1} of {randomizedQuestions.length + 2}</div>
            {step === 0 ? (
                <div>
                    <ConsentForm/>
                    <MultipleChoiceQuestion
                        question={consentQuestion.question}
                        options={consentQuestion.options}
                        selected={consent}
                        onSelect={setConsent}
                        disabled={false}
                    />
                </div>
            ) : step === 1 ? (
                <div>
                    <div className="mb-4 text-left text-gray-700 text-sm">
                        Please indicate your years of experience with Python. Use the slider or enter a number. If you
                        have no experience, set it to 0, otherwise set it to the closest whole number (e.g. 1.5 years
                        should be set to 2). This information helps us understand your background.
                    </div>
                    <ExperienceSlider value={experience} onChange={setExperience}/>
                </div>
            ) : (
                <MultipleChoiceQuestion
                    question={randomizedQuestions[step - 2].question}
                    options={randomizedQuestions[step - 2].options}
                    selected={mcqAnswers[step - 2]}
                    onSelect={handleMCQSelect(step - 2)}
                    code={randomizedQuestions[step - 2].code}
                    error={randomizedQuestions[step - 2].error}
                />
            )}
            <div className="flex justify-between mt-8">
                <button
                    className={`py-2 px-4 rounded font-semibold bg-gray-200 text-gray-400 cursor-not-allowed`}
                    disabled
                >
                    Previous
                </button>
                <button
                    className={`py-2 px-4 rounded font-semibold ${canContinue ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                    onClick={handleNext}
                    disabled={!canContinue}
                >
                    {isLast ? 'Next' : 'Next'}
                </button>
            </div>
        </div>
    );
}
