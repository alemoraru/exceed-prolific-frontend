import React from "react";
import {CodeEditor} from "./CodeEditor";
import {ErrorMessage} from "./ErrorMessage";
import {ErrorToggle} from "./ErrorToggle";
import {PrimaryButton, SecondaryButton} from "./SurveyButtons";

interface PanelProps {
    code: string;
    error: string;
    showError: boolean;
    onToggleError: (open: boolean) => void;
    onPrev: () => void;
    onNext: () => void;
}

/**
 * Panel for Part 2 Step 3 of the study, which allows participants to review the new error message.
 */
export const Part2Step3Panel: React.FC<PanelProps> = (
    {
        code,
        error,
        showError,
        onToggleError,
        onPrev,
        onNext
    }) => (
    <div>
        <h2 className="text-lg font-semibold mb-2">Step 3: Review the New Error Message</h2>
        <p className="mb-4 text-gray-700 text-left">
            The code you submitted previously did not fully resolve all issues. Please review the new error
            message below, which was triggered by your code changes. Use this information to help
            you understand what went wrong. <b>Your goal is still to modify the code so that it achieves the
            desired result as initially defined within the docstrings. </b>
        </p>
        <div className="flex flex-col gap-3">
            <div className="flex-1">
                <CodeEditor code={code} readOnly/>
            </div>
            <div className="flex items-start gap-4 mt-4 w-full">
                <div className="w-1/2 flex justify-start">
                    <ErrorToggle label="Error Message" initialOpen onToggle={onToggleError}/>
                </div>
            </div>
            {showError && (
                <div className="w-full">
                    <ErrorMessage errorMessage={error} renderMarkdown={true}/>
                </div>
            )}
        </div>
        <div className="flex justify-between mt-8">
            <SecondaryButton onClick={onPrev}>
                Previous
            </SecondaryButton>
            <PrimaryButton onClick={onNext}>
                Next
            </PrimaryButton>
        </div>
    </div>
);
