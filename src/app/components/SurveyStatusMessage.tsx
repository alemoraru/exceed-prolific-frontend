'use client';

import React from "react";
import {ProgressBar} from "./ProgressBar";
import {ArrowLeft} from "lucide-react";

interface SurveyStatusMessageProps {
    title: string;
    subtitle: string;
    message: string;
    showStudyTitle?: boolean;
    isNotFound?: boolean;
}

/**
 * SurveyStatusMessage component displays a message at the end of the survey or for special pages like 404.
 * @param title - The main title of the message.
 * @param subtitle - The subtitle providing additional context.
 * @param message - The main message content to display to the user.
 * @param showStudyTitle - Optional flag to show the study title at the top.
 * @param isNotFound - Optional flag to style for 404 pages (red progress bar/title, custom footer).
 */
export function SurveyStatusMessage(
    {
        title,
        subtitle,
        message,
        showStudyTitle = false,
        isNotFound = false,
    }: SurveyStatusMessageProps) {

    // Handler for going back
    function handleGoBack() {
        if (typeof window !== 'undefined') {
            window.history.back();

        }
    }

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            {showStudyTitle && (
                <h1 className={`text-2xl font-bold text-black mb-8`}>
                    Prolific Python Error Fixing Study
                </h1>
            )}
            <div className="w-full max-w-3xl bg-white rounded-2xl card-shadow p-8 relative fade-in">
                {!isNotFound && (
                    <div className="absolute top-0 left-0 w-full h-2 z-10">
                        <ProgressBar progress={100}/>
                    </div>
                )}
                <h1 className={`text-3xl font-bold mb-6 ${isNotFound ? "text-red-700" : "text-green-700"}`}>{title}</h1>
                <h2 className={`text-lg font-semibold mb-4 ${isNotFound ? "text-red-600" : "text-gray-800"}`}>
                    {isNotFound ? "" : subtitle}
                </h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className={`text-gray-500 text-sm mt-8`}>
                    {isNotFound ? (
                        <div className="flex justify-center">
                            <button
                                onClick={handleGoBack}
                                className="cursor-pointer px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5"/>
                                Go Back
                            </button>
                        </div>
                    ) : (
                        "You may now close this window."
                    )}
                </div>
            </div>
        </main>
    );
}
