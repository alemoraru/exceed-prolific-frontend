import React from 'react';
import {MultipleChoiceQuestion} from './MultipleChoiceQuestion';

/**
 * ConsentForm component displays the consent form for participants in the research study.
 * Controlled: receives value and onChange from parent.
 * Uses MultipleChoiceQuestion for the consent question.
 */
export function ConsentForm(
    {
        value,
        onChange,
        disabled
    }: {
        value: number | null;
        onChange: (value: number) => void;
        disabled?: boolean;
    }) {
    return (
        <div
            className="mb-8 w-full mx-auto text-left bg-white px-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-900">Research Consent</h2>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">About the Study</h3>
                <p className="mb-4">We are a team of researchers from <strong>Delft University of Technology in the
                    Netherlands</strong>. This study explores how individuals interpret and respond to programming
                    errors, with the aim of improving how such errors are explained based on a programmer’s skill level.
                    You are invited to take part in this research project.
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Your Participation</h3>
                <p className="mb-4">If you agree to participate, you will begin by self-assessing your experience with
                    Python. Following that, you’ll complete a series of multiple-choice questions designed to evaluate
                    different aspects of your understanding of Python programming errors. These questions form the first
                    part of the study and will help us gauge your proficiency in Python. In the second part, you’ll be
                    asked to review and correct code snippets that contain errors.
                </p>
                <p className="mb-4">You don’t need any special equipment to participate.
                    <span className="font-semibold">Your involvement is completely voluntary</span>, and you are free to
                    withdraw at any point without penalty. Note, however, that if you choose to withdraw,
                    <span
                        className="font-semibold"> you will NOT receive any compensation for your participation.
                    </span>
                </p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Integrity & Fairness</h3>
                <div style={{backgroundColor: '#FEF9C3', borderLeft: '4px solid #FACC15'}} className="p-4 rounded mb-4">
                    <span style={{color: '#B45309'}} className="font-bold">Important:</span> To maintain the integrity
                    of this
                    study, please complete all tasks independently, without using external assistance such as large
                    language models (LLMs), AI tools, search engines, or help from others. Your responses must reflect
                    your own reasoning and understanding. It is essential that you thoughtfully engage with each
                    question rather than submitting answers at random or without proper consideration. We will be
                    actively checking for signs of inauthentic or careless participation.
                    <br/><br/>
                    <span style={{color: 'red'}} className="font-bold text-red-700">The use of LLMs (e.g., ChatGPT, Copilot), or failing to engage meaningfully with the task, will result in your responses being invalidated and you will NOT be eligible for compensation.</span>
                </div>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">What Data Will Be Collected?</h3>
                <p className="mb-2">We will collect the following information during your participation:</p>
                <ul className="list-disc pl-8 mb-4 space-y-2 text-gray-800"
                    style={{listStyleType: 'disc', marginLeft: '2rem'}}>
                    <li><strong>Your programming experience:</strong> How many years you report having worked with
                        Python.
                    </li>
                    <li><strong>Your interaction data:</strong> Metrics such as the time you spend on each question and
                        whether the survey window remains active (for example, when you switch tabs or windows).
                    </li>
                    <li><strong>Your survey responses:</strong> The answers you provide to the multiple-choice
                        questions.
                    </li>
                    <li><strong>Your code submissions:</strong> The code you write and submit in response to the coding
                        tasks.
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Confidentiality & Data Use</h3>
                <p className="mb-4">We will not collect any data beyond what has been described above, and we will treat
                    your information with strict confidentiality to the best of our ability. All data will be securely
                    stored in password-protected electronic systems. Please note that the data collected in this study
                    may be published or shared in anonymized form. This anonymized dataset may include your responses to
                    the survey and coding tasks, but will exclude any personal identifiers (such as usernames or
                    participant IDs), ensuring that your responses cannot be linked back to you.</p>
            </section>

            <section className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-blue-800">Your Rights</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-2">
                    <span className="font-semibold">By clicking &nbsp;
                        <span className='text-blue-700'>&quot;Yes, I consent&quot;</span>
                        &nbsp; at the bottom of this page, you confirm that you have read, understood, and consent to the above information.
                    </span>
                </div>
                <p className="text-sm text-gray-600 mt-2"><strong>Note:</strong> You can exit the task at any time. This
                    will imply revoking your consent, and subsequently, all your data will be discarded from our
                    databases.</p>
            </section>

            {/* Consent question and options using MCQ style */}
            <MultipleChoiceQuestion
                question={"Do you consent to participate in this study under the above conditions?"}
                options={["Yes, I consent", "No, I do not consent"]}
                selected={value}
                onSelect={onChange}
                disabled={disabled}
            />
        </div>
    );
}
