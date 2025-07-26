import React from "react";
import {CodeEditor} from "../editor/CodeEditor";

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
        onPrev,
        onNext
    }) => (
    <div>
        <div className="flex flex-col gap-3">
            <div className="flex-1">
                <CodeEditor
                    code={code}
                    readOnly
                    errorMessage={error}
                    instructions="The code you submitted previously did not fully resolve all issues.
                    Please review the new error message below, which was triggered by your code changes.
                    Use this information to help you understand what went wrong.
                    Your goal is still to modify the code so that it achieves the desired result as initially defined within the docstrings.
                    When you are ready, click the Next button. Note that this step is for review only,
                    therefore you cannot make any changes to the code at this point."
                    title="Step 3: Review the New Error Message"
                    step={3}
                    onPrev={onPrev}
                    onNext={onNext}
                />
            </div>
        </div>
    </div>
);
