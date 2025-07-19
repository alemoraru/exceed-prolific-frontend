'use client';

import React, {useState, useEffect} from "react";
import {Part1Answers, SurveyStatusType} from "@/app/utils/types";
import {ProgressBar} from "./components/ProgressBar";
import {Part1Survey} from "./components/Part1Survey";
import {Part2Survey} from "./components/Part2Survey";
import {SurveyStatusMessage} from "./components/SurveyStatusMessage";

/**
 * App component is the main entry point for the Prolific Python Error Fixing Study application.
 */
export default function App() {
    const [part1Complete, setPart1Complete] = useState(false);
    const [, setPart1Answers] = useState<Part1Answers | null>(null);
    const [snippetIdx, setSnippetIdx] = useState(0);
    const [consentDenied, setConsentDenied] = useState(false);

    // Calculate total steps for both parts
    const part1Total = 8 + 1 + 1; // 8 MCQs + 1 for experience/consent + 1 for instructions
    const part2Total = 4 * 4;
    const totalSteps = part1Total + part2Total;

    // Track the overall step for progress bar
    const [overallStep, setOverallStep] = useState(0);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Extract PROLIFIC_PID from URL on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const pid = urlParams.get('PROLIFIC_PID');
            if (pid) {
                setParticipantId(pid);
                localStorage.setItem('participant_id', pid);
            } else {
                setParticipantId(null);
            }
            setLoading(false);
        }
    }, []);

    // Wait for loading to finish before rendering anything
    if (loading) {
        return null;
    }

    // Redirect to /missing-prolific-id if no PROLIFIC_PID in URL
    if (participantId === null) {
        if (typeof window !== 'undefined') {
            window.location.replace('/missing-prolific-id');
        }
        return null;
    }

    // If a participant ID is not set (i.e., no consent), show a message
    if (consentDenied) {
        return (
            <SurveyStatusMessage
                title="Thank you for your time!"
                subtitle="You have chosen not to participate."
                message="Because you have either not consented or quit the study, you will not be able to participate
                in this study and will not receive any compensation. Your choice has been recorded."
                showStudyTitle={true}
                type={SurveyStatusType.Info}
            />
        );
    }

    // If part 1 is not complete, show the Part 1 survey
    if (!part1Complete) {
        return (
            <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
                <div className="w-full max-w-6xl relative mt-4">
                    {/* Progress bar at the top */}
                    <div className="absolute top-0 left-0 w-full z-10">
                        <ProgressBar progress={(overallStep / totalSteps) * 100}/>
                    </div>
                    <Part1Survey
                        participantId={participantId}
                        onComplete={(answers) => {
                            setPart1Answers(answers);
                            setPart1Complete(true);
                            setOverallStep(part1Total);
                        }}
                        onStepChange={(step) => setOverallStep(step)} // Remove +1 so progress starts at 0
                        onConsentDenied={() => setConsentDenied(true)}
                    />
                </div>
            </main>
        );
    }

    // Once part 1 and part 2 are complete, show the final message
    if (snippetIdx >= 4) {
        return (
            <SurveyStatusMessage
                title="Thank you for your time!"
                subtitle="You have completed the survey."
                message="We appreciate your effort and attention in helping us improve code understanding and error fixing. Your responses have been recorded."
                showStudyTitle={true}
                type={SurveyStatusType.Success}
            />
        );
    }
    return (
        <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
            <div className="w-full max-w-6xl relative mt-4">
                {/* Progress bar at the top */}
                <div className="absolute top-0 left-0 w-full z-10">
                    <ProgressBar progress={(overallStep / totalSteps) * 100}/>
                </div>
                <Part2Survey
                    onComplete={() => setSnippetIdx(4)}
                    setOverallStep={setOverallStep}
                    part1Total={part1Total}
                    onConsentDenied={() => setConsentDenied(true)}
                />
            </div>
        </main>
    );
}
