/**
 * Questions used to assess the readability of error messages.
 */
export interface LikertQuestion {
    question: string;
    scale: string[];
}

export const readabilityQuestions: LikertQuestion[] = [
    {
        question: "Is the message expressed using more words than needed?",
        scale: ["Very Succinct", "Succinct", "Neutral", "Somewhat Verbose", "Very Verbose"]
    },
    {
        question: "Does the message contain jargon and technical terms?",
        scale: ["No Jargon", "Little Jargon", "Neutral", "Some Jargon", "A Lot of Jargon"]
    },
    {
        question: "How clear is the sentence structure of the message?",
        scale: ["Very Clear", "Clear", "Neutral", "Somewhat Unclear", "Very Unclear"]
    },
    {
        question: "How complex is the vocabulary used?",
        scale: ["Very Simple", "Simple", "Neutral", "Somewhat Complex", "Very Complex"]
    }
];

/**
 * Questions used to assess the cognitive load of error messages.
 */
export const cognitiveLoadQuestions: LikertQuestion[] = [
    {
        question: "This error message was inherently difficult to understand.",
        scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
    },
    {
        question: "The wording or formatting of this error message wasted mental effort.",
        scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
    },
    {
        question: "This error message helped me recognize the underlying error concept.",
        scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
    }
];

/**
 * Questions used to assess the authoritativeness of error messages.
 */
export const authoritativenessQuestions: LikertQuestion[] = [
    {
        question: "How respectful (i.e., reader‑centered) is the tone of the error message?",
        scale: ["Very disrespectful", "Disrespectful", "Neutral", "Respectful", "Very respectful"]
    }
];

/**
 * Example questions used within the Survey Instructions component.
 */
export const instructionsQuestions: LikertQuestion[] = [
    {
        question: "I find Python an easy programming language to understand and use.",
        scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
    },
    {
        question: "I find it annoying when I encounter error messages in Python.",
        scale: ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"]
    }
];
