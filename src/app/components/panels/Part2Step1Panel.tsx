import React from "react";
import {CodeEditor} from "../editor/CodeEditor";

interface PanelProps {
    code: string;
    error: string;
    showError: boolean;
    onNext: () => void;
    renderMarkdown: boolean;
}

/**
 * Panel for Part 2 Step 1 of the study, which allows participants to review the original code and error message.
 */
export const Part2Step1Panel: React.FC<PanelProps> = (
    {
        code,
        error,
        onNext,
        renderMarkdown
    }) => (
    <div>
        <div className="flex flex-col gap-3">
            <div className="flex-1">
                <CodeEditor
                    code={code}
                    readOnly
                    errorMessage={error}
                    instructions="Carefully review the code and the error message.
                    Try to understand what the code is intended to do and what the error means.
                    When you are ready, click the Next button. Note that this step is for review only,
                    therefore you cannot make any changes to the code at this point.
                    You will be asked to fix the code in the next step."
                    title="Step 1: Review the Code and Error"
                    step={1}
                    onNext={onNext}
                    renderMarkdown={renderMarkdown}
                />
            </div>
        </div>
    </div>
);
