# KisanFlow (किसानफ्लो) 🌾
### Smart Farmer Registration, Virtual Queue and Agricultural Procurement Management System

**Smart India Hackathon (SIH 2026)**
* **Team:** Tech Titans
* **Problem Statement:** SIH26032
* **Theme:** Smart Automation
* **Project Name:** KisanFlow

---

## 1. Project Overview & Philosophy

Every harvest season across India, millions of farmers transport truckloads of produce to Agricultural Produce Market Committee (APMC) and Food Corporation of India (FCI) mandis, only to endure 24 to 72 hours of grueling physical queueing under extreme outdoor weather. This results in severe yard congestion, perishability losses, distress selling to middlemen, and lack of real-time visibility into weights, rates, and payments.

**KisanFlow** is a mobile-first, multilingual Progressive Web Application (PWA) specifically engineered for Indian farmers. It redefines agricultural procurement with the core philosophy:

> **"Register → Get Token → Track Queue → Sell Crop → Get Paid"**
> *(नोंदणी करा → टोकन घ्या → रांग पहा → पीक विका → पैसे मिळवा)*

### Key Principles
* **Mobile-First for Indian Farmers:** High readability, large touch targets, natural leaf-green aesthetic, warm cream backgrounds, and thumb-friendly controls.
* **Multilingual from Core:** Full native support for **मराठी (Marathi)**, **हिंदी (Hindi)**, and **English**.
* **Zero Guesswork Queueing:** Real-time virtual queue position tracking (`#12 → #11 → #10`) with automated wait-time recalculations.
* **Transparent Multi-Factor AI Recommendations:** Evaluates distance, queue length, waiting times, official MSP prices, and yard intake capacities without hiding factors.
* **Audit-Proof Transparent Procurement:** Stepper progression from document verification to digital weighbridge scale readings, automated MSP receipts, and direct bank credit via Direct Benefit Transfer (DBT).

---

## 2. System Architecture

```mermaid
flowchart TD
    subgraph ClientLayer [Client Applications & Roles]
        F[Farmer Mobile PWA\n(React + TypeScript + Tailwind)]
        O[Procurement Officer Desk\n(Verification, Scale, DBT)]
        A[Government Command Dashboard\n(Congestion, Analytics, Counters)]
    end

    subgraph Gateway [API & Real-time Layer]
        API[FastAPI Backend\n(REST API Endpoints)]
        WS[WebSocket Manager\n(Rooms: center, farmer, admin)]
    end

    subgraph Services [Business & AI Logic]
        AUTH[Auth Service\nJWT + Mock OTP]
        QUEUE[Queue Engine\n(Sorted FIFO Calculation)]
        REC[Transparent Recommendation\nMulti-Factor Scoring Engine]
        ML[AI Prediction Service\n(Scikit-Learn RandomForest)]
        PROC[Procurement Pipeline\nAudit Logs & Stages]
        NOTIF[Notification Service\nIn-App + Simulated SMS & Voice]
    end

    subgraph DataLayer [Storage & Cache]
        DB[(PostgreSQL / SQLite\nSQLAlchemy ORM)]
        REDIS[(Redis Cache & Sorted Sets\nFallback In-Memory)]
    end

    F <--> Gateway
    O <--> Gateway
    A <--> Gateway

    Gateway <--> Services
    Services <--> DataLayer
```

---

## 3. The 16 Dedicated Farmer Screens

1. **Welcome / Landing:** Agricultural hero illustration, core slogan, SIH 2026 badges, 1-click demo launchers.
2. **Language Selection:** High-contrast selectable cards for Marathi, Hindi, and English.
3. **Farmer Registration / Login:** 2-step simplified onboarding (Farmer ID, Mobile, Village, Crop) with 1-click demo autofill.
4. **Farmer Home Dashboard:** Personalized greeting (*"नमस्कार, रामभाऊ 👋"*), active token hero card, speech audio assistance button, quick actions, today's MSP prices, recent activity.
5. **Find Procurement Center:** Nearby APMC yards, distance in km, queue lengths, operational counters, status badges (Low / Moderate / High load), and map preview.
6. **Smart Recommendation:** Transparent 5-factor scoring visual bars (Distance 40%, Queue 25%, Wait 20%, Price 10%, Capacity 5%) and comparative yard matrix.
7. **Token Booking:** Crop selection, interactive quantity slider (Quintals), date selection, and time slots (09:00 - 10:00 AM, 10:00 - 11:00 AM, etc.).
8. **Digital Token:** Official pass card with high-contrast QR code, Token ID (`KF-2026-000123`), queue position `#12`, farmers ahead `11`, estimated wait, and Web Share API.
9. **Live Queue:** Animated turn number (`12 → 11 → 10`), queue progress visualization, 4 live counter monitors, and position update notifications.
10. **Procurement Tracking:** 6-stage audit stepper (*Registration ✓ → Verification ✓ → Weighing ● → Procurement ○ → Receipt ○ → Payment ○*).
11. **Electronic Weighing:** Certified weighbridge scale display with live LED number stabilization, expected vs. actual weight comparison, and confirmation.
12. **Procurement Complete:** Success celebration with confetti, total payable amount (`₹83,905`), rate (`₹2,425/Q`), and digital receipt popup.
13. **Payment Tracking:** Direct Benefit Transfer (DBT) progression, UTR transaction reference, Aadhaar-linked bank confirmation.
14. **Notifications Center:** Time-stamped alerts for queue shifts, counter activations, and bank credit updates.
15. **Procurement History:** Past transaction records with quantity, dates, APMC centers, and PDF receipt downloads.
16. **Farmer Profile:** Personal details, registered crops, language switcher, 24x7 Kisan Call Center helpline (`1800-180-1551`), and logout.

---

## 4. Multi-Role Demonstrations

### 👮 Procurement Officer Dashboard (`/officer`)
* Assigned APMC center overview with live counters.
* Search token and farmer records.
* Step-by-step stage advancement:
  * **Step 1:** Verify farmer documents & 7/12 land extract.
  * **Step 2:** Log electronic weighbridge reading (`34.6 Q`).
  * **Step 3:** Accept crop & generate digital receipt (`RCPT-2026-00123`).
  * **Step 4:** Mark DBT payment completed (`₹83,905`).
* Advance counter to call next waiting token.
* **Simulate Voice Announcement:** Loudspeaker announcement in Marathi (*"लक्ष द्या: शेतकरी बांधव राजेश पवार..."*) using browser Speech Synthesis.

### 🏛️ Government Command Center (`/admin`)
* Real-time monitoring across all APMC centers in the state.
* Top KPIs: Total Centers, Active Queues, Tokens Today, Completed Procurement, Average Wait.
* **AI Congestion Detection:** Automatically detects when `queue_length / active_counters > 8.0`.
* **Counter Optimization:** 1-click *"Activate Counter 3"* which immediately recalibrates all wait times and broadcasts updates over WebSockets.
* Interactive analytics charts powered by Recharts (Hourly throughput, Wait trend line, Center queue comparison, Crop distribution).

---

## 5. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, QRCode.react, Canvas Confetti |
| **Backend** | Python 3.11 / 3.13, FastAPI, Pydantic v2, SQLAlchemy 2.0, Uvicorn |
| **Database** | PostgreSQL (Production Docker) / SQLite (Zero-friction local development) |
| **Real-Time** | WebSockets (room-based broadcasting), Redis Sorted Sets (with in-memory fallback) |
| **AI / ML** | Scikit-learn (`RandomForestRegressor`), NumPy, Pandas, Joblib |
| **Deployment** | Docker, Docker Compose, Nginx |

---

## 6. Demo Credentials (SIH Evaluator Ready)

| Role | Username / ID | Password / OTP | Demo Persona |
|---|---|---|---|
| **👨‍🌾 Farmer** | `FARM1001` | `123456` (Mock OTP) | Rajesh Baburao Pawar (Pune) |
| **👮 Officer** | `OFF1001` | `officer123` | Sanjay Deshmukh (Pune APMC Yard) |
| **🏛️ Admin** | `ADMIN001` | `admin123` | Vikramaditya Shinde (Agri Commissioner) |

> **Pro Tip:** Use the sticky **SIH Evaluator Bar** at the top of the interface for 1-click persona switching!

---

## 7. Complete End-to-End SIH Demo Sequence

To demonstrate the complete workflow to an evaluator:

1. **Open Application** at `http://localhost:5173`.
2. Click **👨‍🌾 Farmer** on the Evaluator Bar (logs in as Rajesh Pawar).
3. On the **Home Dashboard**, note active token `KF-2026-000123` (Position `#12`, `11` ahead, `25 min` wait).
4. Click **🔊 ऐका (Listen)** to hear the automated voice briefing.
5. Click **View Queue** to inspect the live queue screen and active counter statuses.
6. Open a new tab or switch role to **👮 Officer**.
7. In the Officer Desk, click **Verify Farmer** → stage advances to Weighing.
8. Enter actual weight `34.6 Q` and click **Log Weight & Procure**.
9. Click **Complete Procurement** → Receipt `RCPT-2026-00123` generated.
10. Click **Mark DBT Payment Completed** → Payout of `₹83,905` finalized.
11. Return to the Farmer tab: Notice the screen has updated in real-time to **Procurement Complete** with confetti and **Payment Tracking**!
12. Switch to **🏛️ Admin**: Observe the **AI Congestion Alert** at Pune APMC Yard. Click **Activate Counter 3** to demonstrate real-time queue wait-time reduction.

---

## 8. Local Setup & Running

### Prerequisites
* Node.js v18+ & npm
* Python 3.10+

### Option A: Local Dev (Quickest)

**1. Start Backend:**
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python -m app.main
```
Backend will initialize tables, auto-seed demo data, train the baseline ML model, and listen at `http://localhost:8000` (API documentation at `http://localhost:8000/docs`).

**2. Start Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

### Option B: Docker Compose (Full Cloud Simulation)
```bash
docker compose up --build
```
* Frontend: `http://localhost:3000`
* Backend API: `http://localhost:8000`
* API Docs: `http://localhost:8000/docs`
* PostgreSQL: `localhost:5432`
* Redis: `localhost:6379`

---

## 9. Prototype Transparency
All external integrations are architected behind modular service interfaces:
* **MockOTPService:** Uses mock OTP `123456` (Ready for Twilio SMS).
* **MockVoiceService / Web Speech API:** Voice announcements in Marathi and Hindi (Ready for Twilio Voice).
* **MockMapsService:** Haversine coordinate distance calculation (Ready for Google Maps Distance Matrix API).
* **AI Prediction:** Scikit-Learn `RandomForestRegressor` trained on historical queue data with transparent fallback to standard queue formula.

---
*Developed with pride by **Team Tech Titans** for **Smart India Hackathon 2026**.*
