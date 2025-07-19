import React, {useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import {Stepper, Step, StepLabel} from '@mui/material';
import {ExperienceSlider} from './ExperienceSlider';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {CodeEditor} from './editor/CodeEditor';
import {FaInfoCircle, FaCheckCircle} from 'react-icons/fa';

/**
 * Component showing clear, user‑friendly instructions for participants in the survey.
 * It also includes a tabbed interface to navigate through different sections of the instructions.
 * When toggled on, it tracks which tabs have been visited and notifies when all tabs have been visited.
 *
 * @param defaultTabIndex  Which tab to show by default (0‑based). The default is set to 0.
 * @param requireAllTabs   If true, fires `onAllTabsVisited` only after every tab has been visited.
 * @param onAllTabsVisited Callback when all tabs have been visited (fires once).
 */
export function SurveyInstructions(
    {
        defaultTabIndex = 0,
        requireAllTabs = false,
        onAllTabsVisited
    }: {
        defaultTabIndex?: number;
        requireAllTabs?: boolean;
        onAllTabsVisited?: () => void;
    } = {}) {

    /* State management for the instruction component */
    const totalTabs = 4;
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const [visitedTabs, setVisitedTabs] = useState<Set<number>>(() => new Set([defaultTabIndex]));
    const [sliderValue, setSliderValue] = useState(2);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [exampleCode] = useState('print(2 + 1)');
    const [reviewCode, setReviewCode] = useState(
        'def add(a, b):\n    return a + b\n\nprint(add(2))'
    );
    const visitedCount = visitedTabs.size;
    const allVisited = visitedCount === totalTabs;

    // Only fire the callback once *after* all tabs have been visited
    useEffect(() => {
        if (requireAllTabs && allVisited && onAllTabsVisited) {
            onAllTabsVisited();
        }
    }, [allVisited, requireAllTabs, onAllTabsVisited]);

    // Reset the visited tabs if the default tab index changes
    const handleTabChange = (_: unknown, newIndex: number) => {
        setTabIndex(newIndex);
        setVisitedTabs(prev => new Set(prev).add(newIndex));
    };

    return (
        <div className="max-w-7xl mx-auto bg-white rounded-2xl px-6 fade-in">
            {/* Header */}
            <header className="mb-6 text-center">
                <h2 className="text-3xl font-extrabold text-blue-900">Prolific Study Instructions</h2>
            </header>

            {/* Tabs Seen Progress indicator */}
            {requireAllTabs && (
                <Box sx={{mb: 3}}>
                    <LinearProgress variant="determinate" value={(visitedCount / totalTabs) * 100}/>
                    <Typography variant="caption" display="block" textAlign="center" sx={{mt: 0.5}}>
                        {visitedCount} / {totalTabs} tab instructions seen
                    </Typography>
                </Box>
            )}

            {/* Tabs Navigation */}
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 4}}>
                <Tabs value={tabIndex} onChange={handleTabChange} centered>
                    {["Overview", "Your Experience", "MCQ Example", "Code Fix Example"].map((label, idx) => (
                        <Tab
                            key={label}
                            iconPosition="end"
                            icon={
                                requireAllTabs && visitedTabs.has(idx) ?
                                    <FaCheckCircle aria-label="Visited"/> : undefined
                            }
                            label={label}
                            sx={{
                                fontWeight: tabIndex === idx ? 700 : 500,
                                color: tabIndex === idx ? 'primary.main' : 'grey.700',
                                backgroundColor: tabIndex === idx ? 'rgba(25,118,210,0.08)' : 'transparent',
                                borderRadius: 2,
                                mx: 1,
                                transition: 'background 0.3s, color 0.3s',
                                '&:hover': tabIndex !== idx ? {
                                    backgroundColor: 'rgba(25,118,210,0.12)',
                                    color: 'primary.main'
                                } : {}
                            }}
                        />
                    ))}
                </Tabs>
            </Box>

            {/* Call‑out if not yet complete */}
            {!allVisited && requireAllTabs && (
                <Box className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded" role="alert">
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Please review <strong>all</strong> tabs above before continuing. Your answers depend on
                        understanding each
                        section.
                    </Typography>
                </Box>
            )}

            {/* Tab Panel - Main Overview */}
            {tabIndex === 0 && (
                <div>
                    <p className="mb-4 text-gray-700">
                        This survey consists of two main parts: <b>multiple‑choice questions</b> and <b>code review/fix
                        tasks</b>.
                        You will first be asked to self‑assess your Python experience, then answer several
                        multiple‑choice questions about Python code and errors, and finally review and fix code snippets
                        with errors.
                    </p>
                    <p className="mb-4 text-gray-700">
                        The tabs above show examples of each type of question you will encounter. Please explore each
                        tab to
                        familiarise yourself with the layout and what will be expected of you. You can interact with the
                        example
                        components to get a feel for how the survey works. These will not affect your participation or
                        results.
                    </p>
                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left"
                    >
                        <span className="text-blue-900 ml-1">
                            You can always revisit these instructions at any time during the survey by clicking the <b>INFO</b> button{' '}
                            <FaInfoCircle className="inline text-blue-600 align-text-bottom relative -mt-0.5"
                                          aria-label="Info icon"/>{' '}
                            at the top‑right of the following survey pages. These will be available at any point during the survey
                            should you require clarification on the expectations.
                        </span>
                    </div>
                    <ul className="list-disc pl-6 mb-4 text-gray-700 text-left">
                        <li>
                            <b>Be honest and thoughtful</b> in your responses. Your answers help us understand how
                            programmers
                            interact with programming errors and code.
                        </li>
                        <li>
                            <b>Do not use external help</b> (AI tools, search engines, or others) to answer questions or
                            fix code. Your
                            own reasoning is essential for the study. We will monitor for any signs of external
                            assistance, and any
                            detected use of external help will result in disqualification.
                        </li>
                    </ul>
                </div>
            )}

            {/* Tab Panel - Your Experience */}
            {tabIndex === 1 && (
                <section className="space-y-4 text-gray-700">
                    <h3 className="text-xl font-semibold">Self‑Assess Your Python Experience</h3>
                    <p className="mb-4 text-gray-700">
                        You will be asked to indicate your years of programming experience with Python using a slider or
                        by
                        entering a number. If you have no experience, set it to 0. Round to the nearest whole number
                        (e.g., 1.5 →
                        2).
                    </p>
                    <ExperienceSlider value={sliderValue} onChange={setSliderValue}/>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Please honestly indicate your years of experience with Python. This
                        information is
                        only used for research purposes and will not affect your participation.
                    </p>
                </section>
            )}

            {/* Tab Panel - Multiple‑Choice Question Example */}
            {tabIndex === 2 && (
                <section className="space-y-4 text-gray-700">
                    <h3 className="text-xl font-semibold">Multiple‑Choice Question Example</h3>
                    <p className="mb-4 text-gray-700">
                        You will answer a series of multiple‑choice questions about Python code and errors. Read each
                        question
                        carefully and select the answer you believe is correct. These questions help us gauge your
                        understanding of
                        Python programming errors.
                    </p>
                    <MultipleChoiceQuestion
                        question="What will be the output of the following code?"
                        options={["3", "TypeError", "5", "None of the above"]}
                        selected={selectedOption}
                        onSelect={setSelectedOption}
                        code={exampleCode}
                    />
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Carefully read the code snippet and error (if any), then select the
                        answer you
                        believe is correct. Do not use external help or guess randomly.
                    </p>
                </section>
            )}

            {/* Tab Panel - Code Review & Fix Example */}
            {tabIndex === 3 && (
                <section className="space-y-4 text-gray-700">
                    <h3 className="text-xl font-semibold">Code Review & Fix Example</h3>
                    <p className="mb-4 text-gray-700">
                        In the second part of the survey, you will review code snippets that contain errors. Each code
                        review
                        question follows a <b>multi‑step approach</b>:
                    </p>
                    <div className="mb-4 flex justify-center">
                        <Stepper activeStep={1} alternativeLabel className="w-full">
                            <Step key="Review">
                                <StepLabel>Review Code & Error</StepLabel>
                            </Step>
                            <Step key="Fix">
                                <StepLabel>Code Fix</StepLabel>
                            </Step>
                            <Step key="Review Error">
                                <StepLabel>Review Different Error</StepLabel>
                            </Step>
                            <Step key="Final Fix">
                                <StepLabel>Final Code Fix</StepLabel>
                            </Step>
                        </Stepper>
                    </div>
                    <p className="mb-4 text-gray-700 text-left">
                        <b>Step 1:</b> Review the provided code snippet and the associated error message to understand
                        the issue.
                        <br/>
                        <b>Step 2:</b> Based on the provided code snippet and error message, attempt to fix the code by
                        editing it in
                        the code editor.
                        <br/>
                        <b>Step 3:</b> If your first fix does not resolve all issues, you may receive a new error
                        message and be
                        asked to fix the code again. Please read the new error message carefully to understand what
                        needs to be
                        fixed.
                        <br/>
                        <b>Step 4:</b> Make any final adjustments to your code based on the follow‑up error message and
                        submit your
                        final fix that resolves all issues. Note that you cannot go back to previous steps.
                        <br/>
                    </p>

                    <div className="space-y-3">
                        <CodeEditor
                            instructions="Edit the code to fix any errors you have identified. You can revert to the original snippet if needed by clicking the Revert to original snippet button. The error message is shown below for your reference - by default it is hidden, but you can toggle it on to see it. Once you have made your changes, click the Next button to submit your fix. Note that once you submit, you will not be able to come back to this step to make further changes."
                            title="Step 2: Attempt a Fix"
                            code={reviewCode}
                            errorMessage={exampleErrorMessage}
                            step={1}
                            onSubmitAction={setReviewCode}
                            readOnly={false}
                            autoHeight={true}
                        />
                    </div>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Read the code snippet and error message, then edit the code to fix the
                        error. Your
                        solution must be your own work, without external help (whichever it may be).
                    </p>
                </section>
            )}
        </div>
    );
}

/**
 * Example error message used in the code‑fix demo.
 */
const exampleErrorMessage = `Traceback (most recent call last):
  File "main.py", line 4, in <module>
    print(add(2))
          ^^^^^^
TypeError: add() missing 1 required positional argument: 'b'`;
