import React, {useEffect, useState} from "react";
import {ErrorPanel} from "../editor/ErrorPanel";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import {Send} from "lucide-react";

/**
 * Props for the LikertScalePanel component.
 */
interface LikertScalePanelProps {
    errorMessage: string;
    onSubmit: (answers: number[]) => void;
    submitLoading?: boolean;
    isMarkdown: boolean;
    questions: string[];
    selectedAnswers?: number[];
    onAnswersChange?: (answers: number[]) => void;
}

/**
 * LikertScalePanel component allows users to provide feedback on an error message
 * using a Likert scale. It presents a series of statements and users can select their level
 * of agreement or disagreement with each statement.
 * @param errorMessage - The error message to be displayed.
 * @param onSubmit - Callback function to handle the submission of answers.
 * @param step - The current step in the process (1, 2, 3, or 4).
 * @param submitLoading - Optional flag to indicate if the submission is in progress.
 * @param isMarkdown - Flag indicating if the error message should be rendered as Markdown.
 * @param questions - Array of questions to be displayed in the Likert scale.
 * @param selectedAnswers - Optional array of pre-selected answers for controlled components.
 * @param onAnswersChange - Optional callback to handle changes in selected answers for controlled components.
 */
export const LikertScalePanel: React.FC<LikertScalePanelProps> = (
    {
        errorMessage,
        onSubmit,
        submitLoading = false,
        isMarkdown,
        questions,
        selectedAnswers,
        onAnswersChange
    }) => {
    // Use controlled answers if provided, otherwise manage internally
    const isControlled = selectedAnswers !== undefined && onAnswersChange !== undefined;
    const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
    const [touched, setTouched] = useState<boolean[]>(Array(questions.length).fill(false));

    // Sync controlled answers with internal state
    useEffect(() => {
        if (isControlled) {
            setAnswers(selectedAnswers.map(a => a ?? null).concat(Array(questions.length - selectedAnswers.length).fill(null)).slice(0, questions.length));
        } else {
            setAnswers(Array(questions.length).fill(null));
        }
        setTouched(Array(questions.length).fill(false));
    }, [isControlled, questions, selectedAnswers]);

    // Track if each question has been touched (answered or interacted with)
    const handleChange = (idx: number, value: number) => {
        const newAnswers = [...answers];
        newAnswers[idx] = value;
        setAnswers(newAnswers);
        const newTouched = [...touched];
        newTouched[idx] = true;
        setTouched(newTouched);
        if (isControlled && onAnswersChange) {
            // Convert nulls to undefined for controlled answers
            onAnswersChange(newAnswers.map(a => a ?? undefined) as number[]);
        }
    };

    const allAnswered = answers.every((a) => a !== null);

    const likertMarks = [
        {value: 1, label: "Strongly disagree"},
        {value: 2, label: "Disagree"},
        {value: 3, label: "Neutral"},
        {value: 4, label: "Agree"},
        {value: 5, label: "Strongly agree"},
    ];

    return (
        <Card
            sx={{
                maxWidth: 900,
                mx: "auto",
                my: 4,
                borderRadius: 4,
                border: "1px solid #000",
                borderColor: "black",
                boxShadow: 4,
                px: 4,
                py: 1
            }}
        >
            <CardContent>
                <div className={"pb-4"}>
                    Please read again the error message below and provide your feedback according to the following
                    statements. Note that this is the same error message you saw in the previous code fix task.
                </div>

                {errorMessage && (
                    <div className="mb-6">
                        <ErrorPanel
                            message={errorMessage}
                            isVisible={true}
                            hideCloseIcon={true}
                            renderMarkdown={isMarkdown}
                        />
                    </div>
                )}

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (allAnswered) onSubmit(answers as number[]);
                    }}
                >
                    <Grid container direction="column" spacing={4}>
                        {questions.map((q, idx) => (
                            <React.Fragment key={idx}>
                                <div className={"font-semibold w-full"}>
                                    {q}
                                </div>
                                <FormControl
                                    component="fieldset"
                                    sx={{width: "100%", maxWidth: 700, mx: "auto", mb: 0}}
                                >
                                    <RadioGroup
                                        row
                                        value={answers[idx] ?? ''}
                                        onChange={e => handleChange(idx, Number(e.target.value))}
                                        sx={{width: '100%'}}
                                    >
                                        <div className="flex w-full justify-between items-start">
                                            {likertMarks.map(mark => (
                                                <div
                                                    key={mark.value}
                                                    className="flex flex-col items-center flex-1 min-w-[120px]"
                                                >
                                                    <Radio
                                                        disabled={submitLoading}
                                                        value={mark.value}
                                                        checked={answers[idx] === mark.value}
                                                        onChange={e => handleChange(idx, Number(e.target.value))}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        className="mt-1 text-center whitespace-nowrap"
                                                    >
                                                        {mark.label}
                                                    </Typography>
                                                </div>
                                            ))}
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                {!allAnswered && touched[idx] && answers[idx] === null && (
                                    <Typography color="error" variant="body2" sx={{mt: 1}}>
                                        Please select an answer.
                                    </Typography>
                                )}
                                {/* Separator */}
                                <div className="w-full flex justify-center my-1 border border-gray-200"></div>
                            </React.Fragment>
                        ))}
                    </Grid>

                    <Grid container justifyContent="center" sx={{mt: 4}}>
                        <button
                            type="submit"
                            disabled={!allAnswered || submitLoading}
                            className="flex items-center px-4 py-3 rounded-lg
                            text-base font-semibold bg-blue-600 text-white border border-blue-700
                            hover:bg-blue-700 hover:text-white transition-colors shadow-md disabled:opacity-50
                            disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer"
                        >
                            {submitLoading ? (
                                <CircularProgress size={28} color="inherit"/>
                            ) : (
                                <>
                                    <span>Submit</span>
                                    <Send size={20} className="ml-2"/>
                                </>
                            )}
                        </button>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};
