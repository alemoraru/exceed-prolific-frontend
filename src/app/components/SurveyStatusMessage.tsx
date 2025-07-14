import React from "react";
import {ProgressBar} from "./ProgressBar";

interface SurveyStatusMessageProps {
    title: string;
    subtitle: string;
    message: string;
    showStudyTitle?: boolean;
}

/**
 * SurveyStatusMessage component displays a message at the end of the survey.
 * @param title - The main title of the message.
 * @param subtitle - The subtitle providing additional context.
 * @param message - The main message content to display to the user.
 * @param showStudyTitle - Optional flag to show the study title at the top.
 */
export function SurveyStatusMessage(
    {
        title,
        subtitle,
        message,
        showStudyTitle = false
    }: SurveyStatusMessageProps) {

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
            {showStudyTitle && (
                <h1 className="text-2xl font-bold text-black mb-8">Prolific Python Error Fixing Study</h1>
            )}
            <div className="w-full max-w-3xl bg-white rounded-2xl card-shadow p-8 relative fade-in">
                <div className="absolute top-0 left-0 w-full h-2 z-10">
                    <ProgressBar progress={100}/>
                </div>
                <h1 className="text-3xl font-bold text-green-700 mb-6">{title}</h1>
                <h2 className="text-lg font-semibold mb-4 text-gray-800">{subtitle}</h2>
                <p className="mb-6 text-gray-700">{message}</p>
                <div className="text-gray-500 text-sm mt-8">You may now close this window.</div>
            </div>
        </main>
    );
}
