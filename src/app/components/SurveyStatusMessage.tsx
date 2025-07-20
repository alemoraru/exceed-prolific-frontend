'use client';

import React from "react";
import {Info, ArrowLeft, Mail, AlertTriangle, Smile, CheckCircle} from "lucide-react";
import Link from "next/link";
import {ProgressBar} from "./ProgressBar";
import {SurveyStatusType} from "../utils/types";

interface SurveyStatusMessageProps {
    title: string;
    subtitle: string;
    message: string;
    showStudyTitle?: boolean;
    isNotFound?: boolean;
    type?: SurveyStatusType;
}

const iconMap = {
    [SurveyStatusType.Success]: <Smile className="w-12 h-12 text-green-500 mb-4" aria-hidden="true"/>,
    [SurveyStatusType.Error]: <AlertTriangle className="w-12 h-12 text-red-500 mb-4" aria-hidden="true"/>,
    [SurveyStatusType.Info]: <Info className="w-12 h-12 text-blue-500 mb-4" aria-hidden="true"/>,
    [SurveyStatusType.AlreadyParticipated]: <CheckCircle className="w-12 h-12 text-gray-500 mb-4" aria-hidden="true"/>,
};

/**
 * SurveyStatusMessage component displays a message at the end of the survey or for special pages like 404.
 * @param title - The main title of the message.
 * @param subtitle - The subtitle providing additional context.
 * @param message - The main message content to display to the user.
 * @param showStudyTitle - Optional flag to show the study title at the top.
 * @param isNotFound - Optional flag to style for 404 pages (red progress bar/title, custom footer).
 * @param type - The type of message, can be "success", "error", or "info". Defaults to "info".
 */
export function SurveyStatusMessage(
    {
        title,
        subtitle,
        message,
        showStudyTitle = false,
        isNotFound = false,
        type,
    }: SurveyStatusMessageProps) {

    // Handler for going back
    function handleGoBack() {
        if (typeof window !== 'undefined') {
            window.history.back();

        }
    }

    // Determine icon and color
    const resolvedType = type || SurveyStatusType.Info;
    const icon = iconMap[resolvedType];
    const titleColor = resolvedType === SurveyStatusType.Error ?
        "text-red-700" : resolvedType === SurveyStatusType.Success ?
            "text-green-700" : resolvedType === SurveyStatusType.AlreadyParticipated ?
                "text-gray-700" : "text-blue-700";
    const subtitleColor = resolvedType === SurveyStatusType.Error ?
        "text-red-600" : "text-gray-800";
    const progressBarColor = resolvedType === SurveyStatusType.Error ?
        "bg-red-500" : resolvedType === SurveyStatusType.Success ?
            "bg-green-500" : resolvedType === SurveyStatusType.AlreadyParticipated ?
                "bg-gray-400" : "bg-blue-500";

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center"
              aria-live="polite" role="status">
            {showStudyTitle && (
                <h1 className="text-2xl font-bold text-black mb-8 tracking-tight drop-shadow-sm">
                    Prolific Python Error Fixing Study
                </h1>
            )}
            <div className="w-full max-w-3xl bg-white rounded-2xl card-shadow p-8 relative fade-in animate-fadeIn"
                 style={{boxShadow: "0 4px 24px rgba(0,0,0,0.08)"}}>

                {/* Progress bar at the top */}
                <div className="absolute top-0 left-0 w-full z-10">
                    <ProgressBar progress={100} className={progressBarColor}/>
                </div>

                {/* Title and subtitle section with icon*/}
                <div className="flex flex-col items-center">
                    {icon}
                    <h1 className={`text-3xl font-bold mb-2 ${titleColor}`}>{title}</h1>
                    {subtitle && (
                        <h2 className={`text-lg font-semibold mb-4 ${subtitleColor}`}>{subtitle}</h2>
                    )}
                    <p className="mb-6 text-gray-700 max-w-xl">{message}</p>
                </div>

                {/* Action buttons section */}
                <div className="flex flex-col gap-3 items-center mt-4">
                    {isNotFound ? (
                        <button
                            onClick={handleGoBack}
                            className="cursor-pointer px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-400"
                            aria-label="Go Back"
                        >
                            <ArrowLeft className="w-5 h-5"/>
                            Go Back
                        </button>
                    ) : null}
                </div>
                {!isNotFound && (
                    <div className="text-gray-500 text-sm mt-8">You may now close this window.</div>
                )}
            </div>
            <div className="mt-6 text-xs text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4"/>
                For support, please contact
                <Link href="mailto:amoraru@tudelft.nl" className="underline hover:text-blue-600">
                    amoraru@tudelft.nl
                </Link>
            </div>
        </main>
    );
}
