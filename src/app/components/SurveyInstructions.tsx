import React, {useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import {ExperienceSlider} from './ExperienceSlider';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';
import {CodeEditor} from './CodeEditor';
import {FaInfoCircle} from 'react-icons/fa';
import {ErrorToggle} from './ErrorToggle';
import {RevertButton} from './RevertButton';
import {ErrorMessage} from './ErrorMessage';

/**
 * SurveyInstructions component provides detailed instructions for participants in the survey.
 * It explains the structure of the survey, how to navigate through different question types,
 * and what is expected from participants.
 */
export function SurveyInstructions() {
    const [tab, setTab] = useState(0);
    // Interactive state for examples
    const [sliderValue, setSliderValue] = useState(2);
    const [mcqSelected, setMcqSelected] = useState<number | null>(null);
    const [mcqCode, setMcqCode] = useState('print(2 + 1)');
    const [codeReviewValue, setCodeReviewValue] = useState('def add(a, b):\n    return a + b\n\nprint(add(2))');
    const [showError, setShowError] = useState(false);

    return (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl fade-in">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Survey Instructions</h2>
            <Box sx={{borderBottom: 1, borderColor: 'divider', mb: 3}}>
                <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
                    <Tab label="General Instructions"/>
                    <Tab label="Experience Slider"/>
                    <Tab label="Multipe Choice Question"/>
                    <Tab label="Code Review & Fix"/>
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
                    <div
                        className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded flex items-center gap-2 text-left">
                        <span className="text-blue-900 ml-1">You can always revisit these instructions at any time during the survey by clicking the <b>INFO</b> button <FaInfoCircle
                            className="inline text-blue-600 align-text-bottom relative -mt-0.5"
                            style={{verticalAlign: 'middle', marginLeft: 2, marginRight: 2}} aria-label="Info icon"/> at the top of the page. These will be available at any point during the survey should you require clarification on the
                        expectations.</span>
                    </div>
                    <ul className="list-disc pl-6 mb-4 text-gray-700 text-left">
                        <li><b>Be honest and thoughtful</b> in your responses. Your answers help us understand how
                            programmers interact with errors and code.
                        </li>
                        <li><b>Do not use external help</b> (AI tools, search engines, or others) to answer questions or
                            fix code. Your own reasoning is essential for the study.
                        </li>
                        <li>
                            Engage with each question and task to the best of your ability. If you have questions,
                            you can always refer back to these instructions using the <span
                            className="inline-flex items-center"><FaInfoCircle
                            className="inline text-blue-600 align-text-bottom relative -mt-0.5 mr-1"
                            style={{verticalAlign: 'middle'}} aria-label="Info icon"/>INFO button</span> at the top of
                            the page.
                        </li>
                        <li>You can experiment with the interactive examples in each tab to see how the survey interface
                            works.
                        </li>
                    </ul>
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
                        <ExperienceSlider value={sliderValue} onChange={setSliderValue}/>
                    </div>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Please honestly indicate your years of experience with Python.
                        This information is only used for research purposes and will not affect your participation.
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
                        selected={mcqSelected}
                        onSelect={setMcqSelected}
                        code={mcqCode}
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
                        see the code, an error message, and be asked to fix the code. Carefully read the error message
                        and use your knowledge to correct the code. Your edits will be submitted for evaluation.
                    </p>
                    <div className="mb-4">
                        <div className="font-semibold mb-1">Example code snippet (try editing below!):</div>
                        <CodeEditor code={codeReviewValue} onChange={setCodeReviewValue}/>
                        <div className="flex items-start gap-4 mt-4 w-full">
                            <div className="w-1/2 flex justify-start">
                                <ErrorToggle label="Error Message" onToggle={setShowError}/>
                            </div>
                            <div className="w-1/2 flex justify-end">
                                <RevertButton
                                    onClick={() => setCodeReviewValue('def add(a, b):\n    return a + b\n\nprint(add(2))')}/>
                            </div>
                        </div>
                        {showError && (
                            <div className="w-full mt-3">
                                <ErrorMessage
                                    errorMessage={"TypeError: add() missing 1 required positional argument: 'b'"}/>
                            </div>
                        )}
                    </div>
                    <p className="text-gray-600 text-sm">
                        <b>What is expected:</b> Read the code and error message, then edit the code to fix the error.
                        Your solution should be your own work, without external help.
                    </p>
                </div>
            )}
        </div>
    );
}
