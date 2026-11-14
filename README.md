# ScamShield — AI-Powered Scam Detection & Cybercrime Incident Response

ScamShield is an intelligent cybersecurity web application designed to help users identify, analyze, and respond to online fraud, phishing attempts, and digital scams in real-time. Powered by Google Gemini AI, it evaluates suspicious messages, payment demands, screenshots, and audio recordings against prevalent Indian cybercrime patterns and provides actionable reporting tools.

---

## Key Features

- **Multimodal Fraud Detection**:
  - **Text Analysis**: Paste suspicious SMS alerts, WhatsApp messages, Telegram chats, emails, or job offers.
  - **Screenshot Inspection**: Upload screenshots of payment apps, spoofed banking sites, suspicious SMS threads, or investment platforms.
  - **Audio Recording Analysis**: Upload recorded scam calls to analyze spoken threats, fake authority impersonation, or OTP demands.

- **Indian Cybercrime Pattern Recognition**:
  - **Digital Arrest**: Police, CBI, ED, customs, or court video-call extortion schemes.
  - **Investment & Trading Fraud**: High-return stock tips, Telegram VIP channels, and rigged withdrawal apps.
  - **KYC & Account Phishing**: Fake SMS warnings threatening bank, PAN, or SIM suspension.
  - **UPI Collect Scams**: QR codes or collect requests masquerading as payments or refunds.
  - **Work-From-Home & Fake Jobs**: Social media tasks and prepaid registration deposits.
  - **Loan App Extortion**: Harassment and unauthorized contact permissions.
  - **Courier / Delivery Scams**: Fake customs fees and package delivery alerts.

- **Full Bilingual Support (English & हिन्दी)**:
  - Instant one-click toggle across the entire application.
  - Automatically translates verdicts, risk scoring, red flags, extracted fields, safety advice, and official complaints into clear, everyday spoken Hindi.

- **Automated Incident Extraction**:
  - Automatically detects financial amounts (₹ INR), transaction IDs (UTR/ref), suspect phone numbers, UPI/bank accounts, suspect URLs/APKs, and contact channels.

- **Official Case File Generator (1930 & Banking Dispute)**:
  - When financial loss is detected, generates ready-to-use complaint files:
    1. **1930 Helpline Phone Script**: Step-by-step spoken script to report incidents over the phone.
    2. **cybercrime.gov.in Complaint Draft**: Formal, chronological narrative for the national cybercrime portal.
    3. **Official Bank Fraud Notice Email**: Ready-to-send dispute letter requesting account freezes and transaction reversal.
    4. **Evidence Checklist**: Essential screenshots, chat logs, and transaction proofs to preserve.

- **Session History & Privacy-First Architecture**:
  - Stores scan summaries locally in the user session with verdict filtering.
  - Strict authentication: protected endpoints using HTTP-only JWT cookies.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS (Minimalist, accessible, responsive design)
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch with credential handling

### Backend
- **Runtime**: Node.js & Express.js (ES Modules)
- **Database**: MongoDB with Mongoose (User accounts & credentials)
- **Authentication**: JSON Web Tokens (JWT) stored in secure `httpOnly` cookies
- **File Uploads**: Multer (In-memory buffer processing for audio & images)
- **AI Engine**: Google Gemini API via `@google/genai` (`gemini-3.5-flash`)

---

## Project Structure

```
Scam-detection/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controller/      # Auth, Analyze, and Case File controllers
│   │   ├── middleware/      # Auth protection & Multer upload middleware
│   │   ├── models/          # User and Incident data models
│   │   ├── prompts/         # Structured system prompts for Gemini AI
│   │   ├── routes/          # Express route definitions
│   │   ├── services/        # AI service & case file generator logic
│   │   ├── app.js           # Express app setup and CORS configuration
│   │   └── server.js        # Server entry point
│   ├── .env                 # Backend environment variables
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components (Navbar, Detect, Results, History, etc.)
│   │   ├── services/        # API client for backend communication
│   │   ├── App.jsx          # Root application component and routing
│   │   ├── main.jsx         # React DOM entry
│   │   └── index.css        # Global CSS & Tailwind styling
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or newer)
- MongoDB instance (local or MongoDB Atlas)
- Google Gemini API Key ([Get one here](https://aistudio.google.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/scam-detection.git
cd scam-detection
```

### 2. Configure Backend
Navigate to the `Backend` directory and install dependencies:
```bash
cd Backend
npm install
```

Create a `.env` file in `Backend/` with the following configuration:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash
CLIENT_ORIGIN=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```
The server will run at `http://localhost:3000`.

### 3. Configure Frontend
Open a new terminal window, navigate to the `Frontend` directory, and install dependencies:
```bash
cd Frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
The application will be live at `http://localhost:5173`.

---

## How to Use the Web Application

### Step 1: Landing Page & Account Registration
1. Open `http://localhost:5173` in your browser.
2. Unauthenticated visitors land on the **Overview** page with product explanations and an interactive threat preview card.
3. Click **Sign In** in the top navigation bar.
4. If you are a new user, switch to **Sign Up**, enter your name, email, and password, and register. Once signed in, you will be redirected to the **Detect** page.

### Step 2: Analyzing a Suspicious Message or Alert
1. In the top navigation bar, click on **Detect**.
2. **Text Input**: Paste the suspicious SMS, WhatsApp message, Telegram tip, or email into the main input area.
3. **Optional Attachments**:
   - Click **Attach Screenshot** to upload a PNG or JPG image (e.g., payment screenshot, fake APK notification).
   - Click **Attach Audio Call Recording** to upload an audio file (e.g., recorded extortion call).
4. Click the **Analyze** button.

### Step 3: Reviewing Detection Results
Once analysis completes, the results view provides:
- **Verdict Banner**: Indicates classification (`SCAM DETECTED`, `SUSPICIOUS ACTIVITY`, `LIKELY SAFE`, or `NOT ENOUGH INFO`).
- **Scam Type**: Prevalent pattern identified (e.g., *Digital Arrest*, *KYC Phishing*, *Investment Fraud*).
- **Incident Stage**: Flags whether financial loss has occurred (`Money Transferred / Lost`) or if it was an attempt only.
- **Risk Score & Confidence**: Quantitative threat score from `0` to `100`.
- **Analysis Explanation**: A simple, calm, blame-free summary of why the message is dangerous.
- **Identified Red Flags**: Bulleted indicators exposing fraud techniques (urgency, fake authority, unverified links).
- **Extracted Details**: Identifiers such as amount lost, suspect UPI ID, phone number, and link.
- **Recommended Immediate Actions**: Step-by-step instructions on what to do immediately.

### Step 4: Switching to Hindi (हिन्दी)
- At the top of the **Detection Analysis** section, click the **हिन्दी** button.
- The entire result card—including the classification banner, pattern name, red flags, extracted fields, and immediate safety steps—will dynamically switch to everyday spoken Hindi.

### Step 5: Generating an Official Case File (When Money Was Transferred)
1. If the incident involves financial loss (`MONEY_LOST`), a **Generate Official Case File** banner will appear.
2. Click **Generate Case File** (or **केस फाइल बनाएं** in Hindi).
3. In the modal, fill in optional victim details:
   - Your Full Name
   - Mobile Number
   - Bank / Wallet Name
   - Incident Date & Time
   - Preferred Document Language (`English` or `हिन्दी`)
4. Click **Generate Official Drafts**.
5. The system generates:
   - **1930 Helpline Call Script**: What to say when dialing the national cyber helpline.
   - **cybercrime.gov.in Complaint**: Copy-pasteable legal narrative.
   - **Bank Dispute Email**: Formal email to dispute unauthorized transactions.
   - **Evidence Checklist**: List of items to attach.
6. Use the **Copy** button to copy any draft directly to your clipboard.

### Step 6: Viewing Detection History
1. In the top navigation bar, click on **History**.
2. Filter past scans by status: **All Scans**, **SCAM**, **SUSPICIOUS**, or **SAFE**.
3. Scans that resulted in financial loss display a **Case File Eligible** status badge.
4. Click **View Details** on any entry to review full historical analysis details.
5. Use **Clear History** to purge local scan records at any time.

---

## API Reference

### Authentication Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive HTTP-only JWT cookie | No |
| `GET` | `/api/auth/me` | Retrieve authenticated user profile | Yes |
| `POST` | `/api/auth/logout` | Clear auth cookie and end session | Yes |

### Scam Detection & Incident Reporting
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/analyze` | Analyze text, screenshot, or audio for fraud patterns | Yes |
| `POST` | `/api/casefile` | Generate formal 1930 scripts, complaint text, and bank emails | Yes |

---

## Security & Ethics Considerations

- **Untrusted Input Handling**: All user messages, screenshots, and audio transcriptions are treated as untrusted data and strictly evaluated without executing user-supplied prompt overrides.
- **Privacy by Design**: Sensitive identification fields (bank numbers, passwords) are extracted strictly for victim complaint generation; credentials are never retained for marketing or unauthorized profiling.
- **No False Legal Promises**: ScamShield does not guarantee money recovery or account recovery; it provides structured, sanctioned reporting paths to official law enforcement agencies.

---

## License

This project is licensed under the MIT License.

