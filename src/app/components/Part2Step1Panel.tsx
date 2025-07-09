import React from "react";
import {CodeEditor} from "./CodeEditor";
import {ErrorMessage} from "./ErrorMessage";
import {ErrorToggle} from "./ErrorToggle";
import {PrimaryButton, DisabledButton} from "./SurveyButtons";

interface PanelProps {
    code: string;
    error: string;
    showError: boolean;
    onToggleError: (open: boolean) => void;
    onNext: () => void;
}

/**
 * Panel for Part 2 Step 1 of the study, which allows participants to review the original code and error message.
 */
export const Part2Step1Panel: React.FC<PanelProps> = (
    {
        code,
        error,
        showError,
        onToggleError,
        onNext
    }) => (
    <div>
        <h2 className="text-lg font-semibold mb-2">Step 1: Review the Code and Error</h2>
        <p className="mb-4 text-gray-700">Carefully review the code and the error message. Try to understand
            what the function is intended to do and what the error means. When you are ready, click
            Next.</p>
        <div className="flex flex-col gap-3">
            <div className="flex-1">
                <CodeEditor code={code} readOnly/>
            </div>
            <div className="flex items-start gap-4 mt-4 w-full">
                <div className="w-1/2 flex justify-start">
                    <ErrorToggle label="View Error Message" initialOpen onToggle={onToggleError}/>
                </div>
            </div>
            {showError && (
                <ErrorMessage errorMessage={error}/>
            )}
        </div>
        <div className="flex justify-between mt-8">
            <DisabledButton>
                Previous
            </DisabledButton>
            <PrimaryButton onClick={onNext}>
                Next
            </PrimaryButton>
        </div>
    </div>
);

