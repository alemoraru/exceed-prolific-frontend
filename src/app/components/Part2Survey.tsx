import React, {useState, useEffect} from "react";
import {CodeEditor} from "./CodeEditor";
import {ErrorMessage} from "./ErrorMessage";
import {snippets} from "../data/snippets";
import {ErrorToggle} from './ErrorToggle';
import {RevertButton} from './RevertButton';

/**
 * Part2Survey component handles the second part of the survey where users fix code snippets.
 * This component manages the flow of the survey, including displaying code snippets,
 * error messages, and allowing users to edit code.
 * @param onComplete - Callback function to call when the survey is completed.
 * @param progressPercent - Percentage of progress to display in the progress bar.
 * @param setOverallStep - Function to update the overall step in a parent component.
 * @param part1Total - Total number of steps in Part 1 of the survey, used to calculate overall step.
 */
export function Part2Survey(
    {
        onComplete,
        progressPercent,
        setOverallStep,
        part1Total
    }: {
        onComplete: () => void;
        progressPercent: number;
        setOverallStep: (step: number) => void;
        part1Total: number;
    }) {
    const [snippetIdx, setSnippetIdx] = useState(0);
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
    const [editedCode1, setEditedCode1] = useState(snippets[0].code);
    const [editedCode2, setEditedCode2] = useState(snippets[0].code);
    const [participantId, setParticipantId] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [dynamicErrorMsg, setDynamicErrorMsg] = useState<string | null>(null);

    // Randomly pick either 'pragmatic' or 'contingent' for each snippet for the second error message style
    const [secondErrorStyleList] = useState(() =>
        Array.from({length: snippets.length}, () => (Math.random() < 0.5 ? 'pragmatic' : 'contingent') as 'pragmatic' | 'contingent')
    );
    const currentSnippet = snippets[snippetIdx];
    const currentSecondErrorStyle = secondErrorStyleList[snippetIdx];

    // Step instructions for each step
    // Update overall step in a parent component
    useEffect(() => {
        // Calculate the overall step: part1Total + (snippetIdx * 4) + step
        setOverallStep(part1Total + (snippetIdx * 4) + step);
    }, [snippetIdx, step, setOverallStep, part1Total]);

    // Get participant_id from localStorage on mount
    useEffect(() => {
        const pid = localStorage.getItem('participant_id');
        if (pid) setParticipantId(pid);
    }, []);

    // Navigation helpers
    const goNext = async () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (step === 2) {
            setSubmitLoading(true);
            setSubmitError(null);
            setDynamicErrorMsg(null);
            try {
                const res = await fetch('http://localhost:8000/api/code/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        snippet_id: currentSnippet.id,
                        code: editedCode1
                    })
                });
                const data = await res.json();
                if (data.status === 'success') {
                    // Move to next snippet or finish
                    if (snippetIdx < snippets.length - 1) {
                        setSnippetIdx(snippetIdx + 1);
                        setStep(1);
                        setEditedCode1(snippets[snippetIdx + 1].code);
                        setEditedCode2(snippets[snippetIdx + 1].code);
                        setDynamicErrorMsg(null);
                    } else {
                        onComplete();
                    }
                } else {
                    // Show backend error in step 3
                    setDynamicErrorMsg(data.error_msg || 'Unknown error');
                    setStep(3);
                }
            } catch (e) {
                setSubmitError('Failed to submit code. Please try again.');
            } finally {
                setSubmitLoading(false);
            }
            return;
        }
        if (step === 4) {
            setSubmitLoading(true);
            setSubmitError(null);
            setDynamicErrorMsg(null);
            try {
                await fetch('http://localhost:8000/api/code/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        participant_id: participantId,
                        snippet_id: currentSnippet.id,
                        code: editedCode2
                    })
                });
                // Regardless of success or error, go to the next snippet or finish
                if (snippetIdx < snippets.length - 1) {
                    setSnippetIdx(snippetIdx + 1);
                    setStep(1);
                    setEditedCode1(snippets[snippetIdx + 1].code);
                    setEditedCode2(snippets[snippetIdx + 1].code);
                    setDynamicErrorMsg(null);
                } else {
                    onComplete();
                }
            } catch (e) {
                setSubmitError('Failed to submit code. Please try again.');
            } finally {
                setSubmitLoading(false);
            }
            return;
        }
        if (step < 4) {
            setStep((step + 1) as 1 | 2 | 3 | 4);
        } else if (snippetIdx < snippets.length - 1) {
            setSnippetIdx(snippetIdx + 1);
            setStep(1);
            setEditedCode1(snippets[snippetIdx + 1].code);
            setEditedCode2(snippets[snippetIdx + 1].code);
            setDynamicErrorMsg(null);
        } else {
            onComplete();
        }
    };
    const goPrev = () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
        if (step > 1) {
            setStep((step - 1) as 1 | 2 | 3 | 4);
        } else if (snippetIdx > 0) {
            setSnippetIdx(snippetIdx - 1);
            setStep(4);
            setEditedCode1(snippets[snippetIdx - 1].code);
            setEditedCode2(snippets[snippetIdx - 1].code);
        }
    };
    const rollback = () => setEditedCode1(currentSnippet.code);
    const rollback2 = () => setEditedCode2(currentSnippet.code);

    return (
        <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl card-shadow p-8 relative fade-in">
      <span className="step-indicator">
        Snippet {snippetIdx + 1} of {snippets.length} &mdash; Step {step} of 4<br/>
      </span>
            <div className="absolute top-0 left-0 w-full h-2 bg-gray-200 rounded-t-2xl overflow-hidden progress-bar">
                <div
                    className="h-full bg-blue-600 transition-all duration-300"
                    style={{width: `${progressPercent}%`}}
                ></div>
            </div>
            {/* Step 1: Show original code and standard error message below, with toggle open by default */}
            {step === 1 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 1: Review the Code and Error</h2>
                    <p className="mb-4 text-gray-700">Carefully review the code and the error message. Try to understand
                        what the function is intended to do and what the error means. When you are ready, click
                        Next.</p>
                    <div className="flex flex-col gap-6">
                        <div className="flex-1">
                            <div className="font-semibold mb-1">Original Code</div>
                            <CodeEditor code={currentSnippet.code} readOnly/>
                        </div>
                        <ErrorToggle label="View Error Message" initialOpen>
                            <ErrorMessage messageStyle="standard" snippet={currentSnippet}/>
                        </ErrorToggle>
                    </div>
                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-gray-200 text-gray-500 font-semibold py-2 px-4 rounded cursor-not-allowed opacity-60"
                            disabled
                        >
                            Previous
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
                            onClick={goNext}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {/* Step 2: Ask user to fix the code, show standard error message below code, revert button below code */}
            {step === 2 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 2: Attempt a Fix</h2>
                    <p className="mb-4 text-gray-700">Edit the code to fix any errors you have identified. You can
                        revert to the original snippet if needed. The error message is shown below for your reference.
                        Click Next when you are satisfied with your fix.</p>
                    <CodeEditor code={editedCode1} onChange={setEditedCode1} readOnly={submitLoading}/>
                    <RevertButton onClick={rollback}/>
                    <ErrorToggle label="Error Message">
                        <ErrorMessage messageStyle="standard" snippet={currentSnippet}/>
                    </ErrorToggle>
                    {submitLoading &&
                        <div className="text-blue-700 mt-2">Submitting your code for verification...</div>}
                    {submitError && <div className="text-red-700 mt-2">{submitError}</div>}
                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded cursor-pointer"
                            onClick={goPrev}
                            disabled={submitLoading}
                        >
                            Previous
                        </button>
                        <button
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer${submitLoading ? ' opacity-60 cursor-not-allowed' : ''}`}
                            onClick={goNext}
                            disabled={submitLoading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {/* Step 3: Show code (read-only) and new error message below, with toggle open by default */}
            {step === 3 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 3: Review the New Error Message</h2>
                    <p className="mb-4 text-gray-700">Review the code and the new error message. Use this information to
                        help you understand what went wrong. Click Next to try fixing the code again.</p>
                    <div className="flex flex-col gap-6">
                        <div className="flex-1">
                            <div className="font-semibold mb-1">Code (after your fix)</div>
                            <CodeEditor code={editedCode1} readOnly/>
                        </div>
                        <ErrorToggle label="Error Message" initialOpen>
                            <div
                                className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mt-4 rounded text-left">
                                <pre className="whitespace-pre-wrap mt-2 text-left">{dynamicErrorMsg}</pre>
                            </div>
                        </ErrorToggle>
                    </div>
                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded cursor-pointer"
                            onClick={goPrev}
                        >
                            Previous
                        </button>
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer"
                            onClick={() => {
                                setStep(4);
                                setEditedCode2(editedCode1);
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
            {/* Step 4: Ask user to fix the code again, show new error message below code, revert button below code */}
            {step === 4 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Step 4: Final Fix</h2>
                    <p className="mb-4 text-gray-700">Make your final changes to the code based on the new error message
                        and your understanding. The error message is shown below for your reference. When you are done,
                        click Submit to finish.</p>
                    <CodeEditor code={editedCode2} onChange={setEditedCode2} readOnly={submitLoading}/>
                    <RevertButton onClick={rollback2}/>
                    <ErrorToggle label="Error Message">
                        <div className="bg-red-100 border-l-4 border-red-600 text-red-800 p-4 mt-4 rounded text-left">
                            <pre className="whitespace-pre-wrap mt-2 text-left">{dynamicErrorMsg}</pre>
                        </div>
                    </ErrorToggle>
                    {submitLoading &&
                        <div className="text-blue-700 mt-2">Submitting your code for verification...</div>}
                    {submitError && <div className="text-red-700 mt-2">{submitError}</div>}
                    <div className="flex justify-between mt-8">
                        <button
                            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded cursor-pointer"
                            onClick={goPrev}
                            disabled={submitLoading}
                        >
                            Previous
                        </button>
                        <button
                            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded cursor-pointer${submitLoading ? ' opacity-60 cursor-not-allowed' : ''}`}
                            onClick={goNext}
                            disabled={submitLoading}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
