# Online Voting System - Biometric Security & Administration

A sleek, responsive, and secure college-level digital voting system. Built with Vanilla HTML5, CSS3, and JavaScript featuring an **Admin Allowed-Students Management Portal**, **Student ID-gated Biometric Authentication**, **Anti-Spoofing Liveness Challenge Engine**, **SHA-256 Biometric Vector Encryption**, **Audit Logging**, and **Voted Status Lifecycle Enforcement**.

---

## 🚀 Key Features

1. **🛡️ Admin "Allowed Students" Registry (`admin.html`)**:
   - Institutional student management with unique **Student ID / Enrollment Number** (e.g. `STU-2026-001`).
   - Fields: Full Legal Name, Department, Institutional Email, Cryptographic Biometric Hash/Vector, Account Status (`Active`, `Blocked`, `Voted`).
   - Dynamic search by ID/Name/Email, Department filtering, and Status filtering.
   - Quick Status toggling (`Active` $\leftrightarrow$ `Blocked`), student editing, and biometric template re-enrollment.

2. **🔐 Biometric Face Authentication & Anti-Spoofing Liveness (`index.html`)**:
   - **Mandatory Student ID Input**: Live verification indicator checks status in the allowed students database as the user types.
   - **Anti-Spoof Liveness Challenge**: Live eye-blink / head movement challenge prevents photo/screen spoofing.
   - **Facial Descriptor Comparison**: Compares the live face feature vector against the registered student's template using cosine distance.
   - **Strict Access Control**: Rejects unregistered IDs, blocked accounts, already-voted students, spoof attempts, and biometric mismatches (<85% confidence).

3. **📜 Immutable Security Audit Trail**:
   - Real-time logging of every login attempt, liveness challenge result, biometric match score, and specific failure reason.
   - One-click export to **CSV** or **JSON** for election auditing and transparency.

4. **🗳️ Voter Status & Single Ballot Enforcement (`vote.html`)**:
   - Authenticated student's ID, Department, and Biometric Token displayed on ballot header.
   - Upon ballot submission, the student's status immediately updates to **`Voted`** with a timestamp, permanently locking future login and vote casting.

5. **📊 Real-Time Election Analytics (`results.html`)**:
   - Turnout percentage automatically calculated against the Allowed Students database.
   - Live leader spotlight, ranked leaderboard, and animated progress bars.

---

## 📁 Project Structure

```
SYSTEM/
├── admin.html       # Admin Portal: Allowed Students Registry, Status Management & Audit Logs
├── index.html       # Voter Login: Student ID Verification, Liveness Challenge & Face Scan
├── vote.html        # Candidate Ballot: Official Candidate Selection & Ballot Submission
├── results.html     # Live Analytics: Real-Time Totals, Winner Spotlight & Turnout Metrics
├── style.css        # Master Design System (Admin Tables, Badges, Liveness HUD & Modals)
├── script.js        # Core Engine: Database Service, Biometric Vector Crypto, Liveness & Audit
└── README.md        # Comprehensive Documentation
```

---

## 🗄️ Database Schema Specification

```sql
-- 1. Allowed Students Master Table
CREATE TABLE allowed_students (
    student_id VARCHAR(64) PRIMARY KEY,          -- Unique ID (e.g. STU-2026-001)
    name VARCHAR(128) NOT NULL,                  -- Student Full Legal Name
    department VARCHAR(100) NOT NULL,            -- Academic Department
    email VARCHAR(255) UNIQUE NOT NULL,          -- University Email Address
    face_embedding_hash VARCHAR(128) NOT NULL,   -- SHA-256 Biometric Vector Signature Hash
    face_embedding_vector TEXT NOT NULL,         -- 128-d Geometric Landmark Vector
    status VARCHAR(20) DEFAULT 'Active'          -- 'Active' | 'Blocked' | 'Voted'
        CHECK (status IN ('Active', 'Blocked', 'Voted')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    voted_at TIMESTAMP WITH TIME ZONE NULL
);

-- 2. Security Audit & Login Attempts Log Table
CREATE TABLE login_audit_logs (
    id VARCHAR(64) PRIMARY KEY,                  -- Log UUID
    student_id VARCHAR(64) NOT NULL,             -- Attempted Student ID
    student_name VARCHAR(128) NULL,              -- Resolved Student Name
    event_type VARCHAR(50) NOT NULL,             -- 'LOGIN_ATTEMPT' | 'LIVENESS_FAILED' | 'LOGIN_SUCCESS' | 'LOGIN_DENIED' | 'VOTE_CAST'
    result VARCHAR(20) NOT NULL,                 -- 'SUCCESS' | 'DENIED' | 'FAILED'
    failure_reason VARCHAR(255) NULL,            -- e.g. 'UNREGISTERED_ID', 'ACCOUNT_BLOCKED', 'ALREADY_VOTED', 'BIOMETRIC_MISMATCH'
    confidence_score NUMERIC(5, 2) NULL,         -- Match Confidence (e.g. 98.4%)
    ip_address VARCHAR(45) DEFAULT '127.0.0.1',  -- Voter Client IP
    user_agent TEXT NULL,                        -- Client Browser Signature
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚡ Quick Start / How to Run

No server installations required!

### Method 1: Direct Browser Opening
Open **`index.html`** or **`admin.html`** in Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari.

### Method 2: Local HTTP Server (Optional)
```bash
# Using Python
python -m http.server 8000
# Then open http://localhost:8000/index.html or http://localhost:8000/admin.html
```

---

## 🧪 Pre-Configured Test Profiles & Edge Cases

### Demo Profiles
| Student ID | Student Name | Department | Status | Test Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `STU-2026-001` | **Sophia Miller** | Computer Science | **Active** | Standard eligible voter (Passes verification) |
| `STU-2026-002` | **Alexander Wright** | Information Tech | **Voted** | Duplicate vote prevention (Access locked) |
| `STU-2026-003` | **Rahul Sharma** | Mechanical Eng | **Blocked** | Administrative block enforcement |
| `STU-2026-004` | **Zoya Patel** | Electronics & Comm | **Active** | Standard eligible voter (Passes verification) |

### Test Verification Scenarios (Inside Face Scanner Modal)
- **✅ Valid Face Match**: Normal face verification $\rightarrow$ Liveness passes $\rightarrow$ Biometric vector matches student template $\rightarrow$ Ballot unlocked.
- **❌ Biometric Mismatch**: Simulates captured face vector belonging to a different person $\rightarrow$ Confidence falls below 85% $\rightarrow$ Denied with `BIOMETRIC_MISMATCH`.
- **👁️ Spoof / Liveness Fail**: Simulates failed blink challenge $\rightarrow$ Denied with `LIVENESS_FAILED`.
- **🚫 Blocked ID**: Denied with `ACCOUNT_BLOCKED`.
- **🔒 Already Voted**: Denied with `ALREADY_VOTED`.
- **⚠️ Unregistered ID**: Denied with `UNREGISTERED_STUDENT_ID`.
- **🌙 Poor Lighting**: Luminance < 35 $\rightarrow$ Warning alert.
- **👤 No Face**: Empty frame $\rightarrow$ Alignment retry alert.
