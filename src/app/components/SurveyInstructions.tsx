import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {ExperienceSlider} from './ExperienceSlider';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {CodeEditor} from './CodeEditor';

/**
 * SurveyInstructions component provides detailed instructions for participants in the survey.
 * It explains the structure of the survey, how to navigate through different question types,
 * and what is expected from participants.
 */
export function SurveyInstructions() {
    const [tab, setTab] = useState(0);

    return (
        <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl p-8 fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Survey Instructions</h2>
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 3}}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab label="General"/>
                    <Tab label="Experience Slider"/>
                    <Tab label="MCQ"/>
                    <Tab label="Code Review"/>
                </Tabs>
            </Box>
            {tab === 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to the Survey</h3>
                    <p className="mb-4 text-gray-700">
                        This survey consists of two main parts: <b>multiple-choice questions</b> and <b>code review/fix
                        tasks</b>.
                        You will first be asked to self-assess your Python experience, then answer several
                        multiple-choice
                        questions about Python code and errors, and finally review and fix code snippets with errors.
                    </p>
                    <p className="mb-4 text-gray-700">
                        The tabs above show examples of each type of question you will encounter. Please explore each
                        tab to
                        familiarize yourself with the layout and what will be expected of you. You can interact with the
                        example components to get a feel for how the survey works.
                    </p>
                    <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
                        <span className="font-semibold text-blue-800">Tip:</span> You can always revisit these
                        instructions
                        at any time during the survey by clicking the <b>INFO</b> button (usually shown as an
                        <span
                            className="inline-block bg-blue-200 text-blue-800 rounded px-2 py-0.5 text-xs font-mono">i</span>
                        icon) at the top of the page.
                    </div>
                    <ul className="list-disc pl-6 mb-4 text-gray-700">
                        <li><b>Be honest and thoughtful</b> in your responses. Your answers help us understand how
                            programmers
                            interact with errors and code.
                        </li>
                        <li><b>Do not use external help</b> (AI tools, search engines, or others) to answer questions or
                            fix
                            code. Your own reasoning is essential for the study.
                        </li>
                        <li>You can experiment with the interactive examples in each tab to see how the survey interface
                            works.
                        </li>
                    </ul>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Engage with each question and task to the best of your ability. If you
                        have
                        questions, refer back to these instructions using the INFO button.
                    </p>
                </div>
            )}
            {tab === 1 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Self-Assess Your Python Experience</h3>
                    <p className="mb-4 text-gray-700">
                        You will be asked to indicate your years of experience with Python using a slider or by entering
                        a number. If you have no experience, set it to 0. If you have partial years (e.g., 1.5 years),
                        round to the nearest whole number. This helps us understand your background.
                    </p>
                    <div className="mb-4">
                        <ExperienceSlider value={2} onChange={() => {
                        }}/>
                    </div>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Please honestly indicate your experience. This information is only used
                        for research purposes and will not affect your participation.
                    </p>
                </div>
            )}
            {tab === 2 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Multiple-Choice Questions (MCQ)</h3>
                    <p className="mb-4 text-gray-700">
                        You will answer a series of multiple-choice questions about Python code and errors. Read each
                        question carefully and select the answer you believe is correct. These questions help us gauge
                        your understanding of Python programming errors.
                    </p>
                    <MultipleChoiceQuestion
                        question={"What will be the output of the following code?"}
                        options={["3", "TypeError", "5", "None of the above"]}
                        selected={null}
                        onSelect={() => {
                        }}
                        code={`print(2 + 1)`}
                    />
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Carefully read the code and error (if any), then select the answer you
                        believe is correct. Do not use external help or guess randomly.
                    </p>
                </div>
            )}
            {tab === 3 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Code Review & Fix Tasks</h3>
                    <p className="mb-4 text-gray-700">
                        In the second part of the survey, you will review code snippets that contain errors. You will
                        see
                        the code, an error message, and be asked to fix the code. Carefully read the error message and
                        use your knowledge to correct the code. Your edits will be submitted for evaluation.
                    </p>
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Example code snippet:</div>
                        <CodeEditor code={`def add(a, b):\n    return a + b\n\nprint(add(2))`} readOnly/>
                        <div
                            className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 mt-2 rounded text-sm w-full text-left">
                            <pre className="whitespace-pre-wrap ml-2">TypeError: add() missing 1 required positional argument: &#39;b&#39;</pre>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Read the code and error message, then edit the code to fix the error.
                        Your solution should be your own work, without external help.
                    </p>
                </div>
            )}
            <div className="mt-8 text-center">
                <span className="text-gray-500 text-sm">You can refer back to these instructions at any time during the survey by clicking the INFO button.</span>
            </div>
        </div>
    );
}
