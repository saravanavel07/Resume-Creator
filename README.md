# Resume Correct App

A modern ATS-focused resume optimization platform that helps job seekers improve resume quality, align with job descriptions, and generate recruiter-friendly documents with a professional, clean, and ATS-safe output.

This application analyzes resume content, highlights weak points, suggests improvements, and provides a structured workflow for resume writing, optimization, and export.

## Overview

Resume Correct App is designed to help candidates:

- Analyze ATS compatibility and resume quality
- Compare resumes against target job descriptions
- Identify weak phrases and missing content
- Improve bullet points using stronger action verbs and measurable outcomes
- Apply company-specific ATS best practices
- Export polished resumes in ATS-friendly layouts

It combines a React + TypeScript frontend with a local analysis engine and supports both interactive editing and export workflows.

## Key Features

### ATS Resume Analysis
- Real-time scoring of resume strength and ATS compliance
- Detailed feedback on missing keywords, weak language, and formatting issues
- Role-specific evaluation against job descriptions

### Resume Optimization Engine
- Auto-rework suggestions for passive or generic bullet points
- Stronger action verbs and quantified impact language
- Structured recommendation flow for improving weak sections

### Company-Specific ATS Presets
- Tailored resume guidance for different hiring systems and employers
- Preset optimization strategies for major company formats and hiring frameworks
- Better alignment for workday, taleo, and specialized ATS environments

### Resume Builder and Editor
- Editable resume sections for contact details, summary, experience, education, skills, and projects
- Guided improvement workflow for specific ATS issues
- Live updates to reflect changes instantly

### Resume History and Tracking
- Score snapshots over time
- Historical resume analysis for iterative improvement
- Resume refinement through repeated evaluation cycles

### Export and Preview
- ATS-safe preview layouts for polished presentation
- PDF and document-style export support
- Clean formatting suitable for recruiter review and printing

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Express
- Docx export support
- HTML to PDF generation
- Lucide icons
- Motion animations

## Architecture

The app is structured as a full-stack frontend experience with a local analysis engine and server-side entry point:

- `App.tsx` — main application shell and workflow orchestration
- `server.ts` — Express server and API endpoints
- `atsParser.ts` — ATS analysis logic and resume evaluation rules
- `ResumeEditor.tsx` — resume editing experience
- `AnalysisResults.tsx` — scoring dashboard and optimization feedback
- `ATSPreviewExport.tsx` — export and preview module
- `sampleResumes.ts` — sample data for testing and demonstration
- `resumeTemplates.ts` — resume template definitions

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or bun

### Installation

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

This starts the development server and serves the application locally.

### Production build

```bash
npm run build
```

### Start production build

```bash
npm run start
```

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build frontend and server bundle
npm run start    # Run production server
npm run preview  # Preview the built frontend
npm run clean    # Remove dist artifacts
npm run lint     # Type-check the project
```

## Environment Variables

This project includes an example environment file:

- `env.example`

Example:

```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

## Project Structure

```text
Resume-Creator/
├── App.tsx
├── ATSPreviewExport.tsx
├── AnalysisResults.tsx
├── AutoReworkEngine.tsx
├── AtsBestPracticesDrawer.tsx
├── Navbar.tsx
├── ResumeEditor.tsx
├── ResumeInputTab.tsx
├── ScoreGauge.tsx
├── ScoreHistory.tsx
├── atsParser.ts
├── companyAtsFormats.ts
├── docxExport.ts
├── documentExtract.ts
├── env.example
├── index.css
├── index.html
├── main.tsx
├── metadata.json
├── package.json
├── resumeTemplates.ts
├── sampleResumes.ts
├── scoreHistory.ts
├── server.ts
├── tsconfig.json
├── types.ts
├── vite.config.ts
├── README.md
└── bun.lock
```

## Privacy and Data Handling

The application is designed with privacy in mind. Resume parsing, scoring, and optimization logic can be run locally in the browser, helping users work on personal career data without exposing sensitive resume information unnecessarily.

## Why This Project Matters

Many job applicants struggle with resumes that are technically complete but not optimized for ATS or recruiter review. This project addresses that gap by helping users:

- improve keyword alignment with job descriptions
- reduce common ATS errors
- write stronger impact-focused bullet points
- present information in a cleaner, recruiter-friendly format

## License

This project does not currently include an explicit license file. Please check with the repository owner before using it for commercial or production distribution.

## Contributing

Contributions are welcome. You can help by:

- improving ATS evaluation logic
- refining UI/UX for better resume editing flow
- adding more ATS-specific templates
- enhancing export quality and formatting
- expanding the document parser and analysis features

## Contact

For questions, suggestions, or collaboration opportunities, please connect via the repository owner or project maintainer on GitHub.

---

Built with a focus on ATS compliance, resume clarity, and job-ready career presentation.
