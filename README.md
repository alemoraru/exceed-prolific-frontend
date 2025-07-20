# EXCEED Prolific Frontend

This repository contains the frontend code for the EXCEED Prolific application, a study aimed at investigating code
understanding and error correction using Python code snippets and error messages. The frontend is built with Next.js and
React, providing a survey interface for participants to provide their experience with Python, answer MCQs, and
participate in code debugging tasks.

---

## 🧩 Stack Overview

- **TypeScript**
- **React** (with Next.js App Router)
- **Next.js** for SSR and routing
- **Tailwind CSS** for styling
- **Docker** for containerization (optional)

---

## ⚡ QuickStart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alemoraru/exceed-prolific-frontend.git
   cd exceed-prolific-frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to use the survey.

> Note: The frontend expects the backend API to be running and accessible. See
> the [backend README](https://github.com/alemoraru/exceed-prolific-backend) for setup instructions.

---

## ⚙️ Environment Variables

| Variable                 | Description                              | Example Value         |
|--------------------------|------------------------------------------|-----------------------|
| NEXT_PUBLIC_BACKEND_HOST | Backend API base URL (for REST requests) | http://localhost:8000 |

Set environment variables in a `.env.local` file in the project root. Make sure to not commit this file to version
control; it is already included in the `.gitignore`.

---

## 📝 Notes

- The frontend is designed to work with the EXCEED Prolific
  backend ([EXCEED Prolific Backend](https://github.com/amoraru/exceed-prolific-backend)).
- Error messages and code snippets are fetched from the backend.
- The survey flow includes consent, experience, MCQs, and code debugging tasks.
- Cheating detection and progress tracking are implemented client-side.

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/get-started) (optional, for containerized deployment)
- Backend API running and accessible (see backend README)

---

## 🤝 Contributing

This project was developed as part of the EXCEED MSc Thesis project at Technische Universiteit Delft. As such,
contributions of any sort will not be accepted. This repository is provided for replication and educational purposes
ONLY. Since it was used to orchestrate the deployment of our study on Prolific, it is NOT intended for further
development or contributions.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
