# ATS Resume Checker & Optimization Studio 🚀

An advanced, privacy-first **Applicant Tracking System (ATS) Resume Optimization Studio** designed to help job seekers audit, rework, and tailor their resumes to pass corporate ATS screeners (Workday, Taleo, Greenhouse, Lever, iCIMS, Epic, etc.) with 100% parsing fidelity.

---

## 🌟 Key Capabilities & Features

### 1. ⚡ 1-Click Auto Rework Engine
- **Passive-to-Active Verb Transformation**: Automatically detects and upgrades weak lead phrasing (e.g., *"responsible for"*, *"worked on"*, *"helped with"*) into high-impact power verbs (*"Spearheaded"*, *"Architected"*, *"Orchestrated"*).
- **Metric Quantification**: Injects realistic quantifiable business impact ($ savings, % growth, user scale, team throughput) into unquantified bullet points.
- **Header & Contact Cleanup**: Standardizes phone numbers, email syntax, location strings, and custom LinkedIn handle URLs.

### 2. 🏢 Target Company ATS Presets
Tailor your resume bullets to exact company-specific recruiter evaluation frameworks:
- **Google "XYZ" Formula**: Enforces *Accomplished [X] as measured by [Y] by doing [Z]*.
- **Amazon STAR + Leadership Principles**: Mandates Situation/Task -> Action -> Result structure with implicit Leadership Principle alignment (Customer Obsession, Ownership, Deliver Results).
- **McKinsey & Co. / Strategy Consulting**: Top-down MECE structure highlighting bottom-line financial impact ($ saved/generated) and executive presence.
- **Enterprise Fortune 500 (Workday / Taleo)**: Clean 1-column single-line layout ensuring 100% parsing accuracy on legacy scanners.
- **Healthcare & Clinical Systems (Epic / Cerner)**: Emphasizes licensure (RN, BLS, ACLS), EHR system proficiency, bed counts, and patient safety metrics.
- **Fresher & Graduate Trainee**: Tailored for 0–2 years experience, prioritizing academic honors, capstone projects, and core technical agility.

### 3. 🛡️ Real-Time ATS Best Practices Checklist Drawer
- Slide-out interactive drawer running continuous audits on your resume as you type.
- Checks **8 core compliance rules**:
  1. Graphical Elements & Text Box Avoidance
  2. Standard Section Headings
  3. Consistent Month/Year Date Formatting
  4. Strong Action Verbs
  5. Quantifiable Metrics (50%+ target)
  6. Clean Contact Header Formatting
  7. Safe Standard Bullet Point Symbols
  8. Word Count & Single-Page Density (300–700 words)
- Includes **1-Click Auto-Fix** buttons for instant compliance resolution.

### 4. 🎨 ATS Layout Template Picker with Live Preview
- Toggle seamlessly between **Modern Tech**, **Professional Executive**, and **Minimalist Single-Page** ATS-optimized layout styles.
- Live real-time preview panel updates synchronously as you edit text or swap layout styles.

### 5. 📄 ATS-Safe PDF Export & Printing
- Generates clean, parse-friendly PDF documents via custom `html2pdf.js` integration with automated color-sanitization fallbacks.
- Includes density toggles (Compact 1-Page Maximizer vs. Standard Spacing).

---

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript & Vite
- **Styling & UI**: Tailwind CSS with custom dark luxury design system
- **Animations**: Motion (`motion/react`)
- **Icons**: Lucide React (`lucide-react`)
- **PDF Generation**: `html2pdf.js` with fallback to browser print engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm / yarn / pnpm

### Installation & Local Run

```bash
# Install dependencies
npm install

# Start the development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build
```

---

## 🔒 Privacy & Data Handling
All resume parsing, scoring, and transformation logic is performed **100% locally in your browser**. No personal contact details, work history, or job descriptions are transmitted to external databases.
