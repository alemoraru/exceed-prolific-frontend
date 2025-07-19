# EXCEED Prolific Frontend

This is a Next.js web application for a two-part Python error-fixing and experience survey, designed for research and
user studies.

## Features

- **Consent Form**: Participants must provide consent before starting the survey.
- **Part 1: Experience & Knowledge**
    - Python experience slider (years of experience)
    - Eight (8) multiple-choice questions (MCQs), some with code snippets and error messages
- **Part 2: Code Debugging Tasks**
    - Four (4) Python code snippets, each with a 4-step error-fixing workflow
    - Randomized error message style per snippet
- **Unified Progress Bar**: Tracks progress across both parts of the survey
- **Modern UI**: Responsive, clean, and user-friendly interface

## Project Structure

```
src/app/
  components/
    SimpleCodeEditor.tsx             # Python code editor (readonly/editable)
    ErrorMessage.tsx           # Error message display for code tasks
    ExperienceSlider.tsx       # Slider for years of Python experience
    MultipleChoiceQuestion.tsx # Generic MCQ component
    Part1Survey.tsx            # Handles consent, experience, and MCQs
    Part2Survey.tsx            # Handles code debugging tasks
  data/
    questions.ts               # Data for Part 1 MCQs
    snippets.ts                # Data for Part 2 code snippets
  page.tsx                     # Main app entry and survey flow
  globals.css                  # Global styles
  layout.tsx                   # App layout
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the survey.

## Customization

- **Add/modify MCQs:** Edit `src/app/data/questions.ts`.
- **Add/modify code snippets:** Edit `src/app/data/snippets.ts`.
- **UI components:** All survey logic and UI are in `src/app/components/`.

## Technologies Used

- [Next.js](https://nextjs.org/) (App Router)
- [React](https://react.dev/)
- [@uiw/react-codemirror](https://github.com/uiwjs/react-codemirror) for code editing
- [TypeScript](https://www.typescriptlang.org/)
- Tailwind CSS (via global styles)

## License

This project is for research and demonstration purposes. As such, we provide an MIT license for use and modification.
