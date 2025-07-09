'use client';

import React, {useState} from "react";
import {Part1Survey} from "./components/Part1Survey";
import {Part2Survey} from "./components/Part2Survey";
import {Part1Answers} from "@/app/utils/types";

/**
 * App component is the main entry point for the Prolific Python Error Fixing Study application.
 */
export default function App() {
    const [part1Complete, setPart1Complete] = useState(false);
    const [, setPart1Answers] = useState<Part1Answers | null>(null);
    const [snippetIdx, setSnippetIdx] = useState(0);
    const [consentDenied, setConsentDenied] = useState(false);

    // Calculate total steps for both parts
    const part1Total = 8 + 1; // 8 MCQs + 1 for experience/consent
    const part2Total = 4 * 4;
    const totalSteps = part1Total + part2Total;

    // Track the overall step for progress bar
    const [overallStep, setOverallStep] = useState(1);

    if (consentDenied) {
        // Show thank you page if consent denied
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <h1 className="text-2xl font-bold text-black mb-8">Prolific Python Error Fixing Study</h1>
                <div className="w-full max-w-3xl bg-white rounded-2xl card-shadow p-8 relative fade-in">
                    <div
                        className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{width: `100%`}}
                        ></div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-700 mb-6">Thank you for your time!</h1>
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">You have chosen not to participate.</h2>
                    <p className="mb-6 text-gray-700">
                        Your choice has been recorded.
                    </p>
                    <div className="text-gray-500 text-sm mt-8">You may now close this window.</div>
                </div>
            </main>
        );
    }

    if (!part1Complete) {
        return (
            <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
                {/*<h1 className="text-2xl font-bold text-black mb-8">Prolific Python Error Fixing Study</h1>*/}

                {/* Unified progress bar for both parts */}
                <div className="w-full max-w-5xl relative mt-6">
                    <div
                        className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{width: `${(overallStep / totalSteps) * 100}%`}}
                        ></div>
                    </div>
                    <div className="bg-white rounded-2xl card-shadow p-8 fade-in">
                        <Part1Survey
                            onComplete={(answers) => {
                                setPart1Answers(answers);
                                setPart1Complete(true);
                                setOverallStep(part1Total + 1);
                            }}
                            onStepChange={(step) => setOverallStep(step + 1)}
                            onConsentDenied={() => setConsentDenied(true)}
                        />
                    </div>
                </div>
            </main>
        );
    }
    if (snippetIdx >= 4) {
        // All snippets done
        return (
            <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <h1 className="text-2xl font-bold text-black mb-8">Prolific Python Error Fixing Study</h1>
                <div className="w-full max-w-3xl bg-white rounded-2xl card-shadow p-8 relative fade-in">
                    <div
                        className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{width: `100%`}}
                        ></div>
                    </div>
                    <h1 className="text-3xl font-bold text-green-700 mb-6">Thank you for your time!</h1>
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">You have completed the survey.</h2>
                    <p className="mb-6 text-gray-700">
                        We appreciate your effort and attention in helping us improve code
                        understanding and error fixing. Your responses have been recorded.
                    </p>
                    <div className="text-gray-500 text-sm mt-8">You may now close this window.</div>
                </div>
            </main>
        );
    }
    return (
        <main className="min-h-screen flex flex-col items-center bg-gray-100 p-4 text-center">
            {/*<h1 className="text-2xl font-bold text-black mb-8">Prolific Python Error Fixing Study</h1>*/}
            <div className="w-full max-w-5xl relative mt-6">
                <div
                    className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                    <div
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{width: `${(overallStep / totalSteps) * 100}%`}}
                    ></div>
                </div>
                <Part2Survey
                    onComplete={() => setSnippetIdx(4)}
                    progressPercent={(overallStep / totalSteps) * 100}
                    setOverallStep={setOverallStep}
                    part1Total={part1Total}
                />
            </div>
        </main>
    );
}
