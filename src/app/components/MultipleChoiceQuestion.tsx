import React from 'react';
import {SimpleCodeEditor} from './SimpleCodeEditor';
import ReactMarkdown from 'react-markdown';

interface MCQProps {
    question: string;
    options: string[];
    selected: number | null;
    onSelect: (idx: number) => void;
    code?: string;
    error?: string;
    disabled?: boolean;
}

/**
 * MultipleChoiceQuestion component renders a multiple choice question with options.
 * @param question - The question text to display.
 * @param options - Array of options for the question.
 * @param selected - The index of the selected option, or null if none is selected.
 * @param onSelect - Callback function to call when an option is selected, passing the index of the selected option.
 * @param code - Optional code snippet to display below the question.
 * @param error - Optional error message to display below the question.
 * @param disabled - Optional flag to disable interaction with the options.
 */
export function MultipleChoiceQuestion({question, options, selected, onSelect, code, error, disabled}: MCQProps) {
    return (
        <div className="mb-8 w-full">
            <div className="font-semibold mb-2 w-full text-left">{question}</div>

            {/* Display code snippet if provided */}
            {code && (
                <div className="mb-4">
                    <SimpleCodeEditor code={code} readOnly/>
                </div>
            )}

            {/* Display error message if provided */}
            {error && (
                <div
                    className="bg-red-100 border-l-4 border-red-600 text-red-800 p-3 mb-2 rounded text-sm w-full text-left">
                    <pre className="whitespace-pre-wrap ml-2">{error}</pre>
                </div>
            )}
            <div className="flex flex-col gap-2 items-start w-full">
                {/* Render each option as a radio button with label */}
                {options.map((opt, idx) => {
                    const id = `mcq-option-${idx}`;
                    return (
                        <label
                            key={idx}
                            htmlFor={id}
                            className={`flex items-center gap-2 p-2 rounded cursor-pointer border transition-colors w-full ${selected === idx ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-200 hover:bg-gray-50'}` + (disabled ? ' opacity-60 cursor-not-allowed' : '')}
                            tabIndex={0}
                            onKeyDown={e => {
                                if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
                                    e.preventDefault();
                                    onSelect(idx);
                                }
                            }}
                        >
                            <input
                                type="radio"
                                id={id}
                                name="mcq"
                                checked={selected === idx}
                                onChange={() => onSelect(idx)}
                                disabled={disabled}
                                className="accent-blue-600"
                            />
                            <span className="flex-1 text-left">
                                {/* Using ReactMarkdown to render the option text with code formatting */}
                                <ReactMarkdown
                                    components={{
                                        p: 'span',
                                        code: ({...props}) => (
                                            <code
                                                style={{
                                                    background: '#f3f4f6', // Tailwind gray-100
                                                    borderRadius: '4px',
                                                    padding: '2px 6px',
                                                    fontSize: '0.95em',
                                                    fontFamily: 'monospace',
                                                }}
                                                {...props}
                                            />
                                        )
                                    }}
                                >{opt}</ReactMarkdown>
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
