'use client';

import React, {useState, useEffect} from "react";
import {SurveyStatusType} from "@/app/utils/types";
import {SurveyStatusMessage} from "./components/SurveyStatusMessage";
import {ProgressBar} from "./components/ProgressBar";
import {Part1Survey} from "./components/Part1Survey";
import {Part2Survey} from "./components/Part2Survey";
import {Part3Survey} from "./components/Part3Survey";

/**
 * App component is the main entry point for the Prolific Python Error Fixing Study application.
 */
export default function App() {
    const [part1Complete, setPart1Complete] = useState(false);
    const [part2Complete, setPart2Complete] = useState(false);
    const [part3Complete, setPart3Complete] = useState(false);
    const [consentDenied, setConsentDenied] = useState(false);
    const [alreadyParticipated, setAlreadyParticipated] = useState(false);

    // Calculate total steps for both parts
    const part1Total = 8 + 1 + 1; // 8 MCQs + 1 for experience/consent + 1 for instructions
    const part2Total = 2; // 2 steps for part 2 (one for review, and another for attempts 1 through 3)
    const part3Total = 3; // 3 steps, each of which having different Likert scales questions
    const totalSteps = part1Total + part2Total + part3Total; // Total steps across all parts

    // Track the overall step for progress bar
    const [overallStep, setOverallStep] = useState(0);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // New state for study design
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [codeSnippetId, setCodeSnippetId] = useState<string>("");
    const [renderMarkdown, setRenderMarkdown] = useState<boolean>(false);

    // Extract PROLIFIC_PID from URL on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const pid = urlParams.get('PROLIFIC_PID');
            if (pid) {
                setParticipantId(pid);
                localStorage.setItem('participant_id', pid);
                // Check if participant already exists
                fetch(`${process.env.NEXT_PUBLIC_BACKEND_HOST}/api/participants/participant-exists`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({participant_id: pid})
                })
                    .then(async res => {
                        if (!res.ok) throw new Error('Failed to check participant');
                        const data = await res.json();
                        if (data.exists) setAlreadyParticipated(true);
                    })
                    .catch(() => setAlreadyParticipated(false));
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

    // If already participated, show a different message
    if (alreadyParticipated) {
        return (
            <SurveyStatusMessage
                title="Already Participated"
                subtitle="You have already completed this study."
                message="Our records show that you have already participated in this survey.
                Thank you for your contribution! Even though we appreciate your interest, you cannot participate again.
                If you believe this is an error, please reach out to us via the contact information provided below."
                showStudyTitle={true}
                type={SurveyStatusType.AlreadyParticipated}
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
                        onComplete={async () => {
                            setPart1Complete(true);
                            setOverallStep(part1Total);
                        }}
                        onStepChange={(step) => setOverallStep(step)}
                        onConsentDenied={() => setConsentDenied(true)}
                    />
                </div>
            </main>
        );
    }

    // Show Part2Survey for code attempts (single snippet, max 3 attempts)
    if (!part2Complete) {
        return (
            <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
                <div className="w-full max-w-6xl relative mt-4">
                    <div className="absolute top-0 left-0 w-full z-10">
                        <ProgressBar progress={(overallStep / totalSteps) * 100}/>
                    </div>
                    <Part2Survey
                        participantId={participantId}
                        setOverallStep={setOverallStep}
                        part1Total={part1Total}
                        onConsentDenied={() => setConsentDenied(true)}
                        onComplete={async (errorMsg, snippetId, isMarkdown) => {
                            setErrorMessage(errorMsg);
                            setCodeSnippetId(snippetId);
                            setRenderMarkdown(isMarkdown);
                            setPart2Complete(true);
                        }}
                    />
                </div>
            </main>
        );
    }

    // Show Part3Survey for feedback after code attempts
    if (!part3Complete) {
        return (
            <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
                <div className="w-full max-w-6xl relative mt-4">
                    <div className="absolute top-0 left-0 w-full z-10">
                        <ProgressBar progress={((overallStep + 1) / totalSteps) * 100}/>
                    </div>
                    <Part3Survey
                        participantId={participantId}
                        errorMessage={errorMessage}
                        snippetId={codeSnippetId}
                        onComplete={() => {
                            setPart3Complete(true);
                            setOverallStep(part1Total + part2Total + part3Total);
                        }}
                        isMarkdown={renderMarkdown}
                        onConsentDenied={() => setConsentDenied(true)}
                        setOverallStep={setOverallStep}
                        part1Total={part1Total}
                        part2Total={part2Total}
                    />
                </div>
            </main>
        );
    }

    // Show completed survey message after feedback is submitted
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
