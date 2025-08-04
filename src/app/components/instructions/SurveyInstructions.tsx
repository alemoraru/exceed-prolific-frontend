import React, {useState, useEffect} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import {ExperienceSlider} from '../ExperienceSlider';
import {MultipleChoiceQuestion} from '../MultipleChoiceQuestion';
import {CodeEditor} from '../editor/CodeEditor';
import {LikertScalePanel} from '../panels/LikertScalePanel';
import {FaInfoCircle, FaCheckCircle} from 'react-icons/fa';
import {MdOutlineExitToApp} from "react-icons/md";
import {instructionsQuestions} from "@/app/utils/likertQuestions";
import {Mail} from "lucide-react";
import Link from "next/link";

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
    const totalTabs = 5;
    const [tabIndex, setTabIndex] = useState(defaultTabIndex);
    const [visitedTabs, setVisitedTabs] = useState<Set<number>>(() => new Set([defaultTabIndex]));
    const [sliderValue, setSliderValue] = useState(2);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [exampleCode] = useState('print(2 + 1)');
    const [reviewCode] = useState(
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
        <div className="max-w-7xl mx-auto bg-white rounded-2xl px-8 fade-in">
            {/* Header */}
            <header className="mb-4 text-center">
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
                    {["General Overview", "Self-Assessment", "MCQ Example", "Code Fix Example", "Likert Scale"].map((label, idx) => (
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
                <Box className="mb-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded" role="alert">
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
                    <p className="mb-4 text-gray-700 text-left">
                        This survey is made up of three parts: <b>multiple‑choice questions</b>, a <b>code review/fix
                        task</b>, and several <b>Likert scale questions</b> pertaining to your experience with the code
                        review/fix task.
                    </p>
                    <p className="mb-4 text-gray-700 text-left">
                        You will first be asked to self‑assess your Python experience, then answer several
                        multiple‑choice questions about Python code and errors. After that, you will be presented with
                        a Python code snippet which contains an issue. Besides the code, you will also be shown the
                        error message that the code produces when run. You will then be asked to review the code and
                        attempt to fix the code while using the provided code editor. Finally, you will answer a series
                        of Likert scale questions about your experience with the error message you encountered during
                        the code fix task.
                    </p>
                    <p className="mb-4 text-gray-700 text-left">
                        The tabs shown on this page above show examples of each of the aforementioned tasks.
                        Please explore each tab to familiarise yourself with the layout and what will be expected of
                        you. You can interact with the example components to get a feel for how the survey works. These
                        will not affect your participation or results. Before proceeding to the actual survey, you
                        must review all tabs above and ensure you understand the tasks and expectations.
                    </p>
                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left"
                    >
                        <span className="text-blue-900 ml-1">
                            <b>Notes:</b>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>
                                    You can always revisit these instructions at any time during the survey by clicking the <b>INFO</b> button{' '}
                                    <FaInfoCircle className="inline text-blue-600"
                                                  aria-label="Info icon"/>{' '}
                                    at the top‑right of the following survey pages. These will be available at any point should you require clarification on the expectations, or if you need to review the task instructions.
                                </li>
                                <li>
                                    You can exit the study and revoke your consent at any time by clicking the <b>Quit & Revoke Consent</b> icon
                                    {' '}<MdOutlineExitToApp className="inline relative -mt-0.5 text-red-400"/>{' '}
                                    in the top-left corner of the page. If you choose to do so, all your data will be deleted, however,
                                    you will NO longer receive compensation for your time and participation.
                                </li>
                                <li>
                                    <span className="text-red-700 font-semibold">Refreshing or closing the tab / browser is strongly discouraged until finishing the survey. </span>
                                    If you do so, a dialog will appear to confirm your choice, but if you proceed,
                                    your progress will be lost and you will not be able to participate in the survey again.
                                    Please avoid refreshing or closing the tab to ensure your responses are recorded and you receive compensation.
                                </li>
                            </ul>
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
                            detected use of external help will result in immediate disqualification.
                        </li>
                    </ul>
                </div>
            )}

            {/* Tab Panel - Your Experience */}
            {tabIndex === 1 && (
                <section className="space-y-4 text-gray-700">
                    <h3 className="text-xl font-semibold">Self‑Assess Your Python Experience</h3>
                    <p className="mb-4 text-gray-700 text-left">
                        You will be asked to indicate your years of programming experience with Python using a slider or
                        by entering a number. If you have no experience, set it to 0. Round to the nearest whole number
                        (e.g., 1.5 → 2).
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
                    <p className="mb-4 text-gray-700 text-left">
                        In this part, you&apos;ll review and fix a Python code snippet containing an error.
                        This task consists of <b>two steps</b>:
                    </p>
                    <ol className="list-decimal pl-6 mb-4 space-y-1 text-gray-700 text-left">
                        <li><b>Review:</b> Read the Python code snippet and error message to understand the problem. You
                            are not allowed to edit the code at this step. To proceed to the next step, click the
                            &#34;Next&#34; button.
                        </li>
                        <li><b>Fix:</b> Edit the code to fix any errors you have identified. You can revert to the
                            original
                            snippet if needed by clicking the &#34;Revert Code&#34; button. After you are satisfied
                            with your edit, click the &#34;Submit&#34; button to submit your fix.
                        </li>
                    </ol>

                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left"
                    >
                        <span className="text-blue-900 ml-1">
                            <b>Note:</b> If your submitted code in step 2 does not fix the underlying issue,
                            you will be given <b>up to 2 extra chances</b> to fix it (for a total of 3 fix attempts).
                            If at any point within the allowed 3 attempts you submit a code that fixes the error, you
                            will immediately move on to the next stage of the survey.
                        </span>
                    </div>

                    {/* Show the first-step interface for the code fix task */}
                    <p className="mb-4 text-gray-700 text-left">
                        To get familiar with the interface you will use in the actual code fix task, consider the
                        code editor interface shown below as an example of the first step of the code fix task.
                    </p>
                    <div className="mb-4">
                        <CodeEditor
                            instructions="Carefully review the code and the error message.
                            Try to understand what the code is intended to do and what the error means.
                            When you are ready, click the Next button. Note that this step is for review only,
                            therefore you cannot make any changes to the code at this point.
                            You will be asked to fix the code in the next step."
                            title="Step 1: Review the Code and Error"
                            code={reviewCode}
                            errorMessage={exampleErrorMessage}
                            step={1}
                            onSubmitAction={() => {
                            }}
                            readOnly={true}
                            autoHeight={true}
                            renderMarkdown={false}
                        />
                    </div>

                    {/* Show the second-step interface for the code fix task */}
                    <p className="mb-4 text-gray-700 text-left">
                        Similarly, if you are on the second step of the code code fix task, you will see the following
                        code editor interface below, which differs from the first step in that it allows you to edit the
                        code.
                    </p>
                    <div className="mb-4">
                        <CodeEditor
                            instructions={`Edit the code to fix any errors you have identified.
                            You can revert to the original snippet if needed by clicking the "Revert Code" button.
                            The error message is shown below for reference, but you can toggle it on and off using the button in the editor toolbar.
                            Once you have made your changes, click the Next button to submit your fix.
                            Note that once you submit, you will not be able to come back to this step to make further changes.`}
                            title="Step 2: Attempt a Code Fix"
                            code={reviewCode}
                            errorMessage={exampleErrorMessage}
                            step={2}
                            onSubmitAction={() => {
                            }}
                            readOnly={false}
                            autoHeight={true}
                            renderMarkdown={false}
                        />
                        <div
                            className="mt-6 p-3 bg-gray-50 border-l-4 border-gray-400 rounded text-sm text-gray-700 text-left">
                            <b>Editor Buttons Explained:</b>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li><b>Hide/Show Instructions:</b> Toggle the instructions panel visibility.</li>
                                <li><b>Revert to Original:</b> Restore the code to its initial state for this step.</li>
                                <li><b>Show/Hide Error:</b> Toggle the error message visibility below the editor.</li>
                                <li><b>Next/Submit:</b> Submit your code fix and move to the next step.</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Carefully read the code and error message (which you can toggle on or
                        off), then edit the code to fix the error. You can revert to the original code if needed by
                        clicking the &#34;Revert to Original&#34; button. Once you are satisfied with your code fix
                        edit, you can click the &#34;Submit&#34; button to submit your fix. Do not forget that you are
                        allowed a maximum of 3 attempts to fix the code.
                    </p>
                </section>
            )}

            {/* Tab Panel - Likert Scale Example */}
            {tabIndex === 4 && (
                <section className="space-y-4 text-gray-700">
                    <h3 className="text-xl font-semibold">Likert Scale Questions Example</h3>
                    <p className="mb-4 text-gray-700 text-left">
                        In this part, you will answer a series of Likert scale questions about
                        your experience with a programming error message you encountered during the
                        previous code fix task. These questions will help us understand your perception of the error
                        messages and how they affect your coding experience.
                    </p>
                    <p>
                        <br/><b>Note:</b> Likert scale questions appear only after you finish the code fix task. Each
                        panel presents one or more statements for you to rate from &#34;Strongly
                        Disagree&#34; to &#34;Strongly Agree&#34;. The example below is a preview of the Likert-scale
                        panel interface; actual survey questions will differ.
                    </p>
                    <LikertScalePanel
                        errorMessage={exampleErrorMessage}
                        onSubmit={() => {
                        }}
                        submitLoading={false}
                        isMarkdown={false}
                        questions={instructionsQuestions}
                    />
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Please answer all Likert scale questions honestly. Your feedback helps
                        us understand your experience and perception of the error message.
                    </p>
                </section>
            )}

            {/* Support email address for participants */}
            <div className="mt-6 text-xs text-gray-400 flex items-center gap-2 mx-auto justify-center w-fit">
                <Mail className="w-4 h-4"/>
                For support and issues encountered while completing the survey, please contact
                <Link href="mailto:amoraru@tudelft.nl" className="underline hover:text-blue-600">
                    amoraru@tudelft.nl
                </Link>
            </div>
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
