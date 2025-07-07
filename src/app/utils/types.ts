/**
 * Interface representing the answers for part 1 of the study.
 */
export interface Part1Answers {
    consent: number | null;
    experience: number;
    mcqAnswers: (number | null)[];
    questions: MCQQuestion[];
    mcqTimes: number[];
}

/**
 * Interface representing a multiple choice question (MCQ)
 * used for part 1 of the study.
 */
export interface MCQQuestion {
    id: string;
    question: string;
    options: string[];
    code?: string;
    error?: string;
}

/**
 * Utility interface for code snippets used in the application,
 * more specifically for part 2 of the study.
 */
export interface CodeSnippet {
    id: string;
    code: string;
    error: string;
}
