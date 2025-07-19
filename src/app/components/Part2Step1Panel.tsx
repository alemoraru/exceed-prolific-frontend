import React from "react";
import {CodeEditor} from "./editor/CodeEditor";
import {PrimaryButton, DisabledButton} from "./SurveyButtons";

interface PanelProps {
    code: string;
    error: string;
    showError: boolean;
    onNext: () => void;
}

/**
 * Panel for Part 2 Step 1 of the study, which allows participants to review the original code and error message.
 */
export const Part2Step1Panel: React.FC<PanelProps> = (
    {
        code,
        error,
        onNext
    }) => (
    <div>
        <div className="flex flex-col gap-3">
            <div className="flex-1">
                <CodeEditor
                    code={code}
                    readOnly
                    errorMessage={error}
                    instructions="Carefully review the code and the error message. Try to understand
                    what the function is intended to do and what the error means. When you are ready, click l
                    Next."
                    title={"Step 1: Review the Code and Error"}
                />
            </div>
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
