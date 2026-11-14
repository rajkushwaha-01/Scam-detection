# ScamShield — Scam Detection Web Application

A lightweight, distraction-free web application inspired by minimal workspace design principles for analyzing suspicious text messages, screenshots, and audio recordings to detect fraud patterns.

Built with an original SaaS interface prioritizing whitespace, typography (Inter), simplicity, and utility.

---

## Design System

- **Background:** `#FFFFFF`
- **Primary Text:** `#191919`
- **Secondary Text:** `#737373`
- **Light Background:** `#F7F7F7`
- **Borders:** `#EAEAEA`
- **Primary Blue:** `#2383E2` (Hover: `#1B6EC2`)
- **Navigation:** Strictly horizontal top navigation bar across all pages. **Zero sidebars.**
- **Aesthetic:** Minimalist, utilitarian, trustworthy, clean hairline dividers, flat cards, restrained blue accents.

---

## Architecture

### Frontend (`/Frontend`)
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS 
- **Icons:** Lucide React
- **Pages & Components:**
  - `Navbar.jsx`: Single horizontal navbar with brand logo, minimal center navigation (`Detect`, `History`, `Overview`), and right auth/scan controls. Responsive mobile dropdown without introducing a sidebar.
  - `LandingPage.jsx`: Focused hero headline, concise supporting sentence, primary CTA, visual interface preview, and a 3-step explanation of the detection workflow.
  - `DetectPage.jsx`: Distraction-free scam detection workspace. Large message input, optional screenshot & audio upload, character counter, Clear action, Analyze action with loading state, and genuine Indian scam presets (Digital Arrest, Utility Disconnection, Task Fraud, Banking KYC).
  - `ResultsView.jsx`: Renders real backend inference data: verdict badge (`SCAM`, `SUSPICIOUS`, `SAFE`), risk score (0-100), confidence percentage, bilingual explanation (English & Hindi switchable), identified red flags, extracted suspect artifacts (UPI, phone, URL, amount), and recommended safety actions.
  - `CaseFileModal.jsx`: Generates official cybercrime reporting drafts via `POST /api/casefile` when money was lost (includes 1930 helpline script, cybercrime.gov.in complaint text, and bank dispute email).
  - `HistoryPage.jsx`: Tracks real scans in local session storage with status filters, detailed inspection view, and clean empty state.
  - `AuthModal.jsx`: Clean modal supporting `POST /api/auth/login` and `POST /api/auth/register`.

### Backend (`/Backend`)
- **Server:** Node.js + Express
- **AI Engine:** Google Gemini (`gemini-3.5-flash` / `@google/genai`)
- **Endpoints:**
  - `POST /api/analyze`: Accepts message string and optional `screenshot` and `audio` uploads (max 5MB each).
  - `POST /api/casefile`: Generates structured complaint and bank notices when `incident_stage === "MONEY_LOST"`.
  - `POST /api/auth/register`: User registration with bcrypt & JWT cookies.
  - `POST /api/auth/login`: User login.
  - `GET /api/auth/me`: Authenticated user profile lookup.
  - `GET /api/health`: Health status.

---

## Running the Application

### 1. Start Backend Server
```bash
cd Backend
npm install
npm run dev
# Backend runs on http://localhost:3000
```

### 2. Start Frontend Server
```bash
cd Frontend
npm run dev
# Frontend runs on http://localhost:5173
```
Vite automatically proxies `/api` calls to `http://localhost:3000`.

