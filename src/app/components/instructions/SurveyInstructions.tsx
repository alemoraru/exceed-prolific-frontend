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
export function SurveyInstructions({defaultTabIndex = 0, requireAllTabs = false, onAllTabsVisited}: {
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
    const [likertAnswers, setLikertAnswers] = useState<number[]>([]);
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
                        This survey has three parts: <b>multiple-choice questions</b>, a <b>code fix task</b>, and <b>Likert
                        scale questions</b>.
                    </p>
                    <p className="mb-4 text-gray-700 text-left">
                        You will first self-assess your Python experience, and answer several multiple-choice questions
                        about Python code and errors. Afterwards, you will be asked to review and fix a Python code
                        snippet using the provided editor interface. Lastly, you will rate your experience with the
                        encountered error message in the code fix task using a series of Likert scale questions.
                    </p>
                    <p className="mb-4 text-gray-700 text-left">
                        Please review each tab above to understand the survey layout and expectations. We
                        strongly encourage you to read the instructions for each task carefully and play with the
                        example interfaces before proceeding to completing the actual survey tasks.
                    </p>
                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left"
                    >
                        <span className="text-blue-900 ml-1">
                            <b>Important:</b>
                            <ul className="list-disc pl-6 mt-2 space-y-1">
                                <li>
                                    <span className="text-red-700 font-semibold">Do NOT reload, close the tab or browser, or clear your browser&#39;s cache during the survey. </span>
                                    Doing so will break the survey&#39;s flow and result in <span
                                    className="text-red-700 font-semibold">immediate disqualification and loss of compensation</span>.
                                </li>
                                <li>
                                    <span className="text-red-700 font-semibold">Do NOT use external help (AI tools, search engines, or other people) to answer questions or
                                        fix code. </span> Doing so will result in
                                    <span className="text-red-700 font-semibold"> immediate disqualification and loss of compensation</span>.
                                </li>
                                <li>
                                    You can revisit these instructions at any time by clicking the <b>INFO</b> button <FaInfoCircle
                                    className="inline text-blue-600" aria-label="Info icon"/> at the top-right of the survey pages.
                                </li>
                                <li>
                                    You may quit and revoke consent at any time by clicking the <b>Quit & Revoke Consent</b> icon <MdOutlineExitToApp
                                    className="inline relative -mt-0.5 text-red-400"/> in the top-left corner. All your data will be deleted, <span
                                    className="text-red-700 font-semibold"> but you will NOT receive compensation</span>.
                                </li>
                            </ul>
                        </span>
                    </div>
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
                        In this part, you&apos;ll fix a Python code snippet containing an error.
                        Your task is to <b>edit the code to resolve the issue</b> and submit your fix.
                    </p>
                    <ul className="list-decimal pl-6 mb-4 space-y-1 text-gray-700 text-left">
                        <li>
                            <b>Fix:</b> Edit the code to correct the error you identified. You can revert to the
                            original snippet if needed by clicking the &#34;<b>Revert Code</b>&#34; button. When you are
                            satisfied with your edit, click the &#34;<b>Submit</b>&#34; button.
                        </li>
                    </ul>

                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left"
                    >
                        <span className="text-blue-900 ml-1">
                            <b>Note:</b> You have <b>up to 3 attempts</b> to fix the code. Once you submit your third attempt, you will move on to the next stage of the survey.
                        </span>
                    </div>

                    <p className="mb-4 text-gray-700 text-left">
                        To get familiar with the interface you will use in the actual code fix task, consider the code
                        editor interface shown below — you can interact with it and try editing the code to see how it
                        works. Submitting this example code will not perform any action.
                    </p>
                    <div className="mb-4">
                        <CodeEditor
                            instructions={`Edit the code to fix any errors you have identified.\nYou can restore the original snippet using the \"Revert Code\" button.\nThe error message is shown below and can be toggled using the toolbar button.\nWhen you're done, click \"Submit\". You have up to 3 attempts to fix the code.`}
                            title="Code Fix: Review and Edit The Code"
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
                                <li><b>Submit:</b> Submit your code fix and move to the next part of the survey.</li>
                            </ul>
                        </div>
                    </div>

                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Carefully read the code and error message (which you can toggle on or
                        off), then edit the code to fix the error. You can revert to the original code if needed by
                        clicking the &#34;Revert Code&#34; button. Once you are satisfied with your code fix
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
                        After the code fix task, you will answer several Likert scale questions about your experience
                        with the error message you had just reviewed. Some questions use a scale from &#34;Strongly
                        Disagree&#34; to &#34;Strongly Agree&#34;, while others may use different rating options.
                        Pay attention to the scale used for each question when answering. The example below shows the
                        interface you will use. Actual survey questions and scales may differ.
                    </p>
                    <LikertScalePanel
                        errorMessage={exampleErrorMessage}
                        onSubmit={() => setLikertAnswers([])}
                        submitLoading={false}
                        isMarkdown={false}
                        questions={instructionsQuestions}
                        selectedAnswers={likertAnswers}
                        onAnswersChange={setLikertAnswers}
                    />
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Please answer all Likert scale questions honestly. Your feedback helps
                        us understand your experience and perception of the error message.
                    </p>
                </section>
            )}

            {/* Support email address for participants */}
            <div className="mt-6 text-xs text-gray-400 flex items-center gap-1 mx-auto justify-center w-fit">
                <Mail className="w-4 h-4"/>
                For support and issues encountered while completing the survey, reach out to us via Prolific or send an
                email to
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
