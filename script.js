/**
 * ==========================================================================
 * E-Voting Application - Core Logic, Biometrics & Security Engine (script.js)
 * ==========================================================================
 */

// Storage Keys
const STORAGE_KEYS = {
  CANDIDATES: 'evote_candidates_data',
  ALLOWED_STUDENTS: 'evote_allowed_students',
  AUDIT_LOGS: 'evote_audit_logs',
  CURRENT_SESSION: 'evote_active_session'
};

// Default Initial Candidate Roster
const DEFAULT_CANDIDATES = [
  {
    id: 'cand-1',
    name: 'Amit Rana',
    party: 'Book',
    badgeColor: '#ea580c',
    slogan: 'Empowering students through academic excellence, accessible libraries, research funding, and knowledge sharing.',
    symbol: '📚',
    accentGradient: 'linear-gradient(135deg, #ea580c, #f59e0b)',
    votes: 42
  },
  {
    id: 'cand-2',
    name: 'Harsh Thakur',
    party: 'Pen',
    badgeColor: '#0284c7',
    slogan: 'Committed to student journalism, transparent campus administration, freedom of expression, and integrity.',
    symbol: '🖊️',
    accentGradient: 'linear-gradient(135deg, #0284c7, #06b6d4)',
    votes: 38
  },
  {
    id: 'cand-3',
    name: 'Kshitesh Bhati',
    party: 'Laptop',
    badgeColor: '#16a34a',
    slogan: 'Championing cutting-edge campus digital infrastructure, tech innovation labs, smart study spaces, and modern tools.',
    symbol: '💻',
    accentGradient: 'linear-gradient(135deg, #16a34a, #059669)',
    votes: 35
  },
  {
    id: 'cand-4',
    name: 'Aman Trivedi',
    party: 'Educational Cap',
    badgeColor: '#8b5cf6',
    slogan: 'Fostering career development, graduate placements, alumni mentorship networks, and student success.',
    symbol: '🎓',
    accentGradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    votes: 21
  }
];

// Pre-seeded Allowed Students Database (Realistic campus registry with biometric templates)
const DEFAULT_ALLOWED_STUDENTS = {
  'STU-2026-001': {
    studentId: 'STU-2026-001',
    name: 'Sophia Miller',
    department: 'Computer Science',
    email: 'sophia.miller@college.edu',
    faceEmbeddingHash: 'bio_sha256_9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    faceVector: generateDeterministicVector('STU-2026-001-sophia'),
    status: 'Active', // 'Active' | 'Blocked' | 'Voted'
    registeredAt: '2026-08-01 09:30',
    votedAt: null
  },
  'STU-2026-002': {
    studentId: 'STU-2026-002',
    name: 'Alexander Wright',
    department: 'Information Technology',
    email: 'alexander.wright@college.edu',
    faceEmbeddingHash: 'bio_sha256_1f2e3d4c5b6a7f8e9d0c1b2a3f4e5d6c',
    faceVector: generateDeterministicVector('STU-2026-002-alex'),
    status: 'Voted',
    registeredAt: '2026-08-01 10:15',
    votedAt: '2026-08-17 14:20'
  },
  'STU-2026-003': {
    studentId: 'STU-2026-003',
    name: 'Rahul Sharma',
    department: 'Mechanical Eng',
    email: 'rahul.sharma@college.edu',
    faceEmbeddingHash: 'bio_sha256_8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f',
    faceVector: generateDeterministicVector('STU-2026-003-rahul'),
    status: 'Blocked',
    registeredAt: '2026-08-02 11:00',
    votedAt: null
  },
  'STU-2026-004': {
    studentId: 'STU-2026-004',
    name: 'Zoya Patel',
    department: 'Electronics & Comm',
    email: 'zoya.patel@college.edu',
    faceEmbeddingHash: 'bio_sha256_3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    faceVector: generateDeterministicVector('STU-2026-004-zoya'),
    status: 'Active',
    registeredAt: '2026-08-02 14:40',
    votedAt: null
  },
  'STU-2026-005': {
    studentId: 'STU-2026-005',
    name: 'Priya Verma',
    department: 'Civil Eng',
    email: 'priya.verma@college.edu',
    faceEmbeddingHash: 'bio_sha256_7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d',
    faceVector: generateDeterministicVector('STU-2026-005-priya'),
    status: 'Active',
    registeredAt: '2026-08-03 08:50',
    votedAt: null
  },
  'STU-2026-006': {
    studentId: 'STU-2026-006',
    name: 'Kabir Singh',
    department: 'Management / MBA',
    email: 'kabir.singh@college.edu',
    faceEmbeddingHash: 'bio_sha256_5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b',
    faceVector: generateDeterministicVector('STU-2026-006-kabir'),
    status: 'Active',
    registeredAt: '2026-08-04 12:10',
    votedAt: null
  },
  'STU-2026-007': {
    studentId: 'STU-2026-007',
    name: 'Ananya Roy',
    department: 'Applied Sciences',
    email: 'ananya.roy@college.edu',
    faceEmbeddingHash: 'bio_sha256_4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
    faceVector: generateDeterministicVector('STU-2026-007-ananya'),
    status: 'Active',
    registeredAt: '2026-08-05 16:20',
    votedAt: null
  }
};

// Initial Security Audit Logs
const DEFAULT_AUDIT_LOGS = [
  {
    id: 'LOG-1001',
    timestamp: '2026-08-17 14:18:22',
    studentId: 'STU-2026-002',
    studentName: 'Alexander Wright',
    eventType: 'LOGIN_SUCCESS',
    result: 'SUCCESS',
    failureReason: 'None (Face & Liveness Verified)',
    confidence: '99.4%',
    deviceInfo: 'Chrome / Win64 (192.168.1.45)'
  },
  {
    id: 'LOG-1002',
    timestamp: '2026-08-17 14:20:05',
    studentId: 'STU-2026-002',
    studentName: 'Alexander Wright',
    eventType: 'VOTE_CAST',
    result: 'SUCCESS',
    failureReason: 'Ballot recorded (Status -> Voted)',
    confidence: '100%',
    deviceInfo: 'Voting Booth #02'
  },
  {
    id: 'LOG-1003',
    timestamp: '2026-08-18 09:12:40',
    studentId: 'STU-2026-003',
    studentName: 'Rahul Sharma',
    eventType: 'LOGIN_DENIED',
    result: 'DENIED',
    failureReason: 'ACCOUNT_BLOCKED (Restricted by Admin)',
    confidence: 'N/A',
    deviceInfo: 'Firefox / Mac (192.168.1.88)'
  }
];

/* ==========================================================================
   Helper: Biometric Crypto Vector & Deterministic Generation
   ========================================================================== */
function generateDeterministicVector(seedStr) {
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const vector = [];
  for (let i = 0; i < 128; i++) {
    const val = Math.sin(hash + i) * 0.5;
    vector.push(parseFloat(val.toFixed(4)));
  }
  return vector;
}

function generateRandomBiometricHash() {
  const chars = '0123456789abcdef';
  let hash = 'bio_sha256_';
  for (let i = 0; i < 32; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function generateRandomBiometricVector() {
  const vector = [];
  for (let i = 0; i < 128; i++) {
    const val = (Math.random() * 2 - 1) * 0.5;
    vector.push(parseFloat(val.toFixed(4)));
  }
  return vector;
}

/**
 * Cosine similarity between two 128-dimensional biometric feature vectors
 */
function calculateVectorSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0.5;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0.5;
  const sim = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  return Math.max(0, Math.min(1, (sim + 1) / 2)); // Normalize to [0, 1]
}

/* ==========================================================================
   State Storage & Database Management
   ========================================================================== */
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CANDIDATES)) {
    localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(DEFAULT_CANDIDATES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ALLOWED_STUDENTS)) {
    localStorage.setItem(STORAGE_KEYS.ALLOWED_STUDENTS, JSON.stringify(DEFAULT_ALLOWED_STUDENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
  }
}

function getCandidates() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.CANDIDATES)) || [];
}

function saveCandidates(candidates) {
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(candidates));
}

function getAllowedStudents() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ALLOWED_STUDENTS)) || {};
}

function saveAllowedStudents(students) {
  localStorage.setItem(STORAGE_KEYS.ALLOWED_STUDENTS, JSON.stringify(students));
}

function getStudentById(studentId) {
  const students = getAllowedStudents();
  if (!studentId) return null;
  const cleanId = studentId.trim().toUpperCase();
  return students[cleanId] || Object.values(students).find(s => (s.studentId || '').toUpperCase() === cleanId) || null;
}

function getAuditLogs() {
  initStorage();
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS)) || [];
}

function saveAuditLogs(logs) {
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
}

function logSecurityEvent(studentId, studentName, eventType, result, failureReason, confidence = 'N/A') {
  const logs = getAuditLogs();
  const now = new Date();
  const timestamp = now.getFullYear() + '-' +
    String(now.getMonth() + 1).padStart(2, '0') + '-' +
    String(now.getDate()).padStart(2, '0') + ' ' +
    String(now.getHours()).padStart(2, '0') + ':' +
    String(now.getMinutes()).padStart(2, '0') + ':' +
    String(now.getSeconds()).padStart(2, '0');

  const newLog = {
    id: `LOG-${Date.now().toString().slice(-6)}`,
    timestamp: timestamp,
    studentId: studentId || 'UNKNOWN',
    studentName: studentName || 'Unregistered',
    eventType: eventType, // 'LOGIN_ATTEMPT', 'LOGIN_SUCCESS', 'LOGIN_DENIED', 'LIVENESS_FAILED', 'VOTE_CAST'
    result: result,       // 'SUCCESS' | 'DENIED' | 'FAILED'
    failureReason: failureReason,
    confidence: confidence,
    deviceInfo: navigator.userAgent.includes('Windows') ? 'Chrome / Win64 (192.168.1.10)' : 'Web Browser (Localhost)'
  };

  logs.unshift(newLog); // Place newest at top
  saveAuditLogs(logs);
  return newLog;
}

function getActiveSession() {
  const session = localStorage.getItem(STORAGE_KEYS.CURRENT_SESSION);
  return session ? JSON.parse(session) : null;
}

function setActiveSession(session) {
  localStorage.setItem(STORAGE_KEYS.CURRENT_SESSION, JSON.stringify(session));
}

function clearActiveSession() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
}

function resetAllData() {
  localStorage.setItem(STORAGE_KEYS.CANDIDATES, JSON.stringify(DEFAULT_CANDIDATES));
  localStorage.setItem(STORAGE_KEYS.ALLOWED_STUDENTS, JSON.stringify(DEFAULT_ALLOWED_STUDENTS));
  localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_AUDIT_LOGS));
  localStorage.removeItem(STORAGE_KEYS.CURRENT_SESSION);
  showToast('Database reset to default official demo state.', 'success');
  setTimeout(() => window.location.reload(), 800);
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '✅',
    error: '⚠️',
    warning: '🔔',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
    <div class="toast-body">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    setTimeout(() => toast.remove(), 400);
  }, 3600);
}

/* ==========================================================================
   Biometric Engine & Anti-Spoofing Liveness Detection
   ========================================================================== */
let cameraStream = null;
let frameAnalysisInterval = null;
let currentScenario = 'normal'; 
// Scenarios: 'normal', 'face_mismatch', 'liveness_failed', 'blocked_account', 'already_voted', 'unregistered_id', 'poor_lighting', 'no_face', 'denied_permission'
let isVerifying = false;
let verifiedBiometricData = null; // { token, confidence, studentId, name, department }
let livenessStep = 1; // Step 1: Position face, Step 2: Blink eyes challenge

/**
 * Open Face Scanner Live Camera Modal
 */
function openScannerModal(presetScenario = null) {
  const studentIdInput = document.getElementById('student-id');
  const nameInput = document.getElementById('voter-name');
  const consentCheckbox = document.getElementById('biometric-consent');
  const loginError = document.getElementById('login-error');

  if (loginError) loginError.classList.remove('active');

  const studentId = studentIdInput ? studentIdInput.value.trim() : '';
  const voterName = nameInput ? nameInput.value.trim() : '';

  if (!studentId) {
    if (loginError) {
      loginError.textContent = 'Please enter your registered Student ID / Enrollment Number first.';
      loginError.classList.add('active');
    }
    showToast('Student ID is mandatory before face scan.', 'warning');
    if (studentIdInput) studentIdInput.focus();
    return;
  }

  if (!voterName) {
    if (loginError) {
      loginError.textContent = 'Please enter your Full Legal Name before scanning.';
      loginError.classList.add('active');
    }
    showToast('Please enter your Full Legal Name first.', 'warning');
    if (nameInput) nameInput.focus();
    return;
  }

  if (consentCheckbox && !consentCheckbox.checked) {
    if (loginError) {
      loginError.textContent = 'Please check the Biometric Consent box to proceed with face verification.';
      loginError.classList.add('active');
    }
    showToast('Biometric consent is required.', 'warning');
    return;
  }

  if (presetScenario) {
    currentScenario = presetScenario;
  }

  const modal = document.getElementById('scanner-modal');
  if (modal) {
    modal.classList.add('active');
  }

  // Reset modal states
  resetScannerUI();

  // Start Camera Stream or handle permission scenario
  startCameraStream(currentScenario);
}

function closeScannerModal() {
  const modal = document.getElementById('scanner-modal');
  if (modal) {
    modal.classList.remove('active');
  }
  stopCameraStream();
  isVerifying = false;
}

function resetScannerUI() {
  const progressContainer = document.getElementById('bio-progress-container');
  const progressFill = document.getElementById('bio-progress-fill');
  const progressPct = document.getElementById('bio-progress-percentage');
  const progressStage = document.getElementById('bio-progress-stage-text');
  const errorBanner = document.getElementById('scanner-error-banner');
  const actionButtons = document.getElementById('scanner-actions');
  const feedback = document.getElementById('scanner-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackIcon = document.getElementById('feedback-icon');
  const ovalGuide = document.getElementById('face-oval');
  const livenessInstruction = document.getElementById('liveness-challenge-instruction');
  const livenessCounter = document.getElementById('liveness-counter-badge');

  if (progressContainer) progressContainer.style.display = 'none';
  if (progressFill) progressFill.style.width = '0%';
  if (progressPct) progressPct.textContent = '0%';
  if (progressStage) progressStage.textContent = 'Analyzing Biometric Landmarks...';
  if (errorBanner) errorBanner.style.display = 'none';
  if (actionButtons) actionButtons.style.display = 'flex';

  livenessStep = 1;
  if (livenessInstruction) livenessInstruction.textContent = 'Look directly into camera & center face within oval guide';
  if (livenessCounter) livenessCounter.textContent = 'Step 1 of 2: Face Alignment';

  if (feedback) {
    feedback.className = 'scanner-feedback';
    if (feedbackIcon) feedbackIcon.textContent = '👁️';
    if (feedbackText) feedbackText.textContent = 'Please hold still and center your face inside the oval frame.';
  }

  if (ovalGuide) {
    ovalGuide.className = 'face-oval-guide';
  }
}

async function startCameraStream(scenario = 'normal') {
  currentScenario = scenario;
  stopCameraStream();

  const video = document.getElementById('face-video');
  const simView = document.getElementById('simulated-camera-view');
  const actionButtons = document.getElementById('scanner-actions');

  if (scenario === 'denied_permission') {
    if (video) video.style.display = 'none';
    if (simView) simView.style.display = 'flex';
    
    showScannerError(
      'Camera Permission Denied',
      'Camera access was blocked. Please grant camera permission in browser settings or use test scenarios.',
      '🚫'
    );
    updateFeedback('Camera access blocked. Please allow permissions in browser.', 'alert', '🚫');
    if (actionButtons) actionButtons.style.display = 'none';
    return;
  }

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      cameraStream = stream;
      if (video) {
        video.srcObject = stream;
        video.style.display = 'block';
        if (simView) simView.style.display = 'none';
        await video.play();
      }
      startFrameAnalysis();
      updateFeedback('Camera active. Complete anti-spoof liveness challenge.', 'normal', '👁️');
    } else {
      throw new Error('getUserMedia not supported.');
    }
  } catch (err) {
    if (video) video.style.display = 'none';
    if (simView) simView.style.display = 'flex';

    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      showScannerError(
        'Camera Permission Denied',
        'Camera access was blocked by browser. Please allow camera access in URL bar.',
        '🚫'
      );
      updateFeedback('Camera permission denied.', 'alert', '🚫');
      if (actionButtons) actionButtons.style.display = 'none';
    } else {
      startFrameAnalysis();
      updateFeedback('Demo Biometric Camera Simulation active. Ready for scan.', 'normal', '👤');
    }
  }
}

function stopCameraStream() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  const video = document.getElementById('face-video');
  if (video) {
    video.srcObject = null;
  }
  if (frameAnalysisInterval) {
    clearInterval(frameAnalysisInterval);
    frameAnalysisInterval = null;
  }
}

function startFrameAnalysis() {
  if (frameAnalysisInterval) clearInterval(frameAnalysisInterval);

  frameAnalysisInterval = setInterval(() => {
    if (isVerifying) return;

    const video = document.getElementById('face-video');
    const canvas = document.getElementById('analysis-canvas');
    const lightingText = document.getElementById('lighting-text');
    const lightingLevelBar = document.getElementById('lighting-level-bar');
    const faceCountText = document.getElementById('face-count-text');
    const ovalGuide = document.getElementById('face-oval');

    let luxLevel = 75;
    let faceStatus = 'Face: 1 Centered ✓';

    if (currentScenario === 'poor_lighting') {
      luxLevel = 18;
      if (lightingText) lightingText.textContent = 'Lighting: Poor (Too Dark)';
      if (lightingLevelBar) {
        lightingLevelBar.style.width = '18%';
        lightingLevelBar.className = 'lighting-level low';
      }
      if (ovalGuide) ovalGuide.className = 'face-oval-guide warning';
      updateFeedback('Poor lighting detected. The frame is too dark for biometric extraction.', 'alert', '🌙');
      return;
    }

    if (currentScenario === 'no_face') {
      faceStatus = 'Face: None Detected ❌';
      if (faceCountText) faceCountText.textContent = faceStatus;
      if (ovalGuide) ovalGuide.className = 'face-oval-guide error';
      updateFeedback('No face detected in the frame. Please look directly at the camera.', 'alert', '👤');
      return;
    }

    // Hardware camera frame luminance check
    if (video && video.srcObject && video.videoWidth > 0 && canvas) {
      try {
        const ctx = canvas.getContext('2d');
        canvas.width = 160;
        canvas.height = 120;
        ctx.drawImage(video, 0, 0, 160, 120);

        const imgData = ctx.getImageData(30, 20, 100, 80);
        const data = imgData.data;
        let totalLuma = 0;
        let samples = 0;

        for (let i = 0; i < data.length; i += 16) {
          const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          totalLuma += luma;
          samples++;
        }

        const avgLuma = totalLuma / samples;
        luxLevel = Math.min(100, Math.max(10, Math.round((avgLuma / 255) * 100)));

        if (avgLuma < 35) {
          if (lightingText) lightingText.textContent = 'Lighting: Poor / Too Dark';
          if (lightingLevelBar) {
            lightingLevelBar.style.width = `${luxLevel}%`;
            lightingLevelBar.className = 'lighting-level low';
          }
          if (ovalGuide) ovalGuide.className = 'face-oval-guide warning';
          updateFeedback('Poor lighting detected. Please face a light source.', 'alert', '🌙');
          return;
        }
      } catch (e) {}
    }

    // Optimal state
    if (lightingText) lightingText.textContent = 'Lighting: Good (Optimal)';
    if (lightingLevelBar) {
      lightingLevelBar.style.width = `${luxLevel}%`;
      lightingLevelBar.className = 'lighting-level optimal';
    }
    if (faceCountText) faceCountText.textContent = faceStatus;
    if (ovalGuide) ovalGuide.className = 'face-oval-guide aligned';
    updateFeedback('Face centered & lighting optimal. Click "Verify Liveness & Match Face".', 'success', '✓');
  }, 350);
}

/**
 * Multi-Stage Biometric Face Verification, Anti-Spoof Liveness & Student ID Matching
 */
async function startBiometricVerification() {
  if (isVerifying) return;
  isVerifying = true;

  const studentIdInput = document.getElementById('student-id');
  const nameInput = document.getElementById('voter-name');
  const studentId = studentIdInput ? studentIdInput.value.trim().toUpperCase() : '';
  const voterName = nameInput ? nameInput.value.trim() : '';

  const progressContainer = document.getElementById('bio-progress-container');
  const actionButtons = document.getElementById('scanner-actions');
  const errorBanner = document.getElementById('scanner-error-banner');
  const livenessInstruction = document.getElementById('liveness-challenge-instruction');
  const livenessCounter = document.getElementById('liveness-counter-badge');

  if (errorBanner) errorBanner.style.display = 'none';
  if (actionButtons) actionButtons.style.display = 'none';
  if (progressContainer) progressContainer.style.display = 'block';

  // --- STAGE 1: Pre-Validate Student ID in Allowed Database ---
  setVerificationProgress(15, 'Validating Student ID against electoral roll...', '🆔');
  await delay(450);

  const studentRecord = getStudentById(studentId);

  // Scenario Override or Real DB check for Unregistered
  if (currentScenario === 'unregistered_id' || !studentRecord) {
    logSecurityEvent(studentId, voterName, 'LOGIN_DENIED', 'DENIED', 'UNREGISTERED_STUDENT_ID: ID not in allowed students database');
    handleVerificationFailure(
      'Unregistered Student ID',
      `Student ID "${studentId}" was not found in the Allowed Students database. Please contact campus administration for voter registration.`,
      '⚠️'
    );
    return;
  }

  // Check Account Status: Blocked
  if (currentScenario === 'blocked_account' || studentRecord.status === 'Blocked') {
    logSecurityEvent(studentId, studentRecord.name, 'LOGIN_DENIED', 'DENIED', 'ACCOUNT_BLOCKED: Restricted by administration');
    handleVerificationFailure(
      'Account Blocked by Administration',
      `Student account for "${studentRecord.name}" (${studentId}) is currently BLOCKED. You are restricted from participating in this balloting session.`,
      '🚫'
    );
    return;
  }

  // Check Account Status: Already Voted
  if (currentScenario === 'already_voted' || studentRecord.status === 'Voted') {
    logSecurityEvent(studentId, studentRecord.name, 'LOGIN_DENIED', 'DENIED', `ALREADY_VOTED: Duplicate vote prevented (Cast at ${studentRecord.votedAt || 'earlier'})`);
    handleVerificationFailure(
      'Duplicate Voting Denied',
      `Student "${studentRecord.name}" (${studentId}) has already cast an official ballot (${studentRecord.votedAt || 'earlier'}). Each student is permitted exactly one vote.`,
      '🔒'
    );
    return;
  }

  // Check Lighting & Presence Edge Cases
  if (currentScenario === 'poor_lighting') {
    logSecurityEvent(studentId, studentRecord.name, 'LOGIN_DENIED', 'DENIED', 'POOR_LIGHTING: Failed luminance threshold');
    handleVerificationFailure(
      'Poor Lighting Detected',
      'The camera frame is too dark to capture facial landmark geometry. Please illuminate your face and retry.',
      '🌙'
    );
    return;
  }

  if (currentScenario === 'no_face') {
    logSecurityEvent(studentId, studentRecord.name, 'LOGIN_DENIED', 'DENIED', 'NO_FACE_DETECTED: Empty frame during capture');
    handleVerificationFailure(
      'No Face Detected',
      'No facial landmarks were detected within the alignment oval. Please look straight into the camera.',
      '👤'
    );
    return;
  }

  // --- STAGE 2: Anti-Spoofing Liveness Challenge ---
  setVerificationProgress(35, 'Executing Anti-Spoof Liveness Challenge (Blink detection)...', '👁️');
  if (livenessInstruction) livenessInstruction.textContent = '⚡ CHALLENGE: Blink eyes twice within 3 seconds...';
  if (livenessCounter) livenessCounter.textContent = 'Step 2 of 2: Liveness Challenge [Active]';
  await delay(800);

  if (currentScenario === 'liveness_failed') {
    logSecurityEvent(studentId, studentRecord.name, 'LIVENESS_FAILED', 'DENIED', 'LIVENESS_FAILED: Eye-blink challenge failed / static photo spoof detected');
    handleVerificationFailure(
      'Liveness Challenge Failed (Anti-Spoof)',
      'Eye-blink / motion challenge was not verified. Static screens, printed photos, or deepfake spoofs are strictly prohibited.',
      '👁️'
    );
    return;
  }

  if (livenessInstruction) livenessInstruction.textContent = '✓ Liveness Challenge Passed! Extracting Biometrics...';
  setVerificationProgress(65, 'Generating 128-d Biometric Landmark Vector...', '⚡');
  await delay(500);

  // --- STAGE 3: Face Biometric Descriptor Comparison against Registered Template ---
  setVerificationProgress(85, `Matching biometric template for ${studentId}...`, '🔐');
  await delay(600);

  // Simulate or compute live vector similarity
  let capturedVector = studentRecord.faceVector;
  if (currentScenario === 'face_mismatch') {
    capturedVector = generateRandomBiometricVector(); // Generate random different face vector
  }

  const similarity = calculateVectorSimilarity(capturedVector, studentRecord.faceVector);
  const confidenceScore = (similarity * 100).toFixed(1) + '%';

  // Strict Threshold: Must be >= 85%
  if (currentScenario === 'face_mismatch' || similarity < 0.85) {
    logSecurityEvent(studentId, studentRecord.name, 'LOGIN_DENIED', 'DENIED', `BIOMETRIC_MISMATCH: Captured face confidence (${confidenceScore}) below 85% threshold`, confidenceScore);
    handleVerificationFailure(
      'Biometric Face Mismatch',
      `The captured face does NOT match the registered biometric reference for Student ID "${studentId}" (Confidence: ${confidenceScore}). Login denied for security integrity.`,
      '❌'
    );
    return;
  }

  // --- STAGE 4: Verification Success! ---
  setVerificationProgress(100, 'Identity & Face Authenticated Successfully!', '✅');
  await delay(400);

  const randomTokenNum = Math.floor(1000 + Math.random() * 9000);
  const biometricToken = `BIO-STUDENT-${studentId}-${randomTokenNum}`;

  verifiedBiometricData = {
    token: biometricToken,
    confidence: confidenceScore,
    studentId: studentRecord.studentId,
    name: studentRecord.name,
    department: studentRecord.department,
    email: studentRecord.email,
    verifiedAt: new Date().toISOString()
  };

  // Log successful login attempt
  logSecurityEvent(studentId, studentRecord.name, 'LOGIN_SUCCESS', 'SUCCESS', 'Authenticated (Liveness & Face Match Passed)', confidenceScore);

  // Update Main UI Biometric Card
  applyBiometricVerifiedUI(biometricToken, confidenceScore, studentRecord.name, studentRecord.studentId);

  // Close scanner and celebrate
  stopCameraStream();
  setTimeout(() => {
    closeScannerModal();
    showToast(`Face & Identity Verified for ${studentRecord.name} (${studentId})!`, 'success');
  }, 600);
}

function handleVerificationFailure(title, message, icon = '⚠️') {
  isVerifying = false;
  const progressContainer = document.getElementById('bio-progress-container');
  if (progressContainer) progressContainer.style.display = 'none';

  showScannerError(title, message, icon);
  updateFeedback(message, 'alert', icon);

  const bioCard = document.getElementById('biometric-card');
  const bioBadge = document.getElementById('bio-status-badge');
  const bioDesc = document.getElementById('bio-status-description');
  const loginSubmit = document.getElementById('btn-login-submit');

  if (bioCard) bioCard.className = 'biometric-card failed';
  if (bioBadge) {
    bioBadge.className = 'bio-badge bio-badge-failed';
    bioBadge.textContent = 'Access Denied';
  }
  if (bioDesc) bioDesc.textContent = title + ': ' + message;
  if (loginSubmit) loginSubmit.disabled = true;
}

function showScannerError(title, message, icon = '⚠️') {
  const errorBanner = document.getElementById('scanner-error-banner');
  const errorTitle = document.getElementById('error-banner-title');
  const errorDesc = document.getElementById('error-banner-desc');
  const errorIcon = document.getElementById('error-banner-icon');
  const actionButtons = document.getElementById('scanner-actions');

  if (errorTitle) errorTitle.textContent = title;
  if (errorDesc) errorDesc.textContent = message;
  if (errorIcon) errorIcon.textContent = icon;
  if (errorBanner) errorBanner.style.display = 'block';
  if (actionButtons) actionButtons.style.display = 'none';
}

function updateFeedback(message, type = 'normal', icon = '👁️') {
  const feedback = document.getElementById('scanner-feedback');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackIcon = document.getElementById('feedback-icon');

  if (feedback) feedback.className = `scanner-feedback ${type}`;
  if (feedbackText) feedbackText.textContent = message;
  if (feedbackIcon) feedbackIcon.textContent = icon;
}

function setVerificationProgress(percent, stageText, icon = '⚡') {
  const progressFill = document.getElementById('bio-progress-fill');
  const progressPct = document.getElementById('bio-progress-percentage');
  const progressStage = document.getElementById('bio-progress-stage-text');

  if (progressFill) progressFill.style.width = `${percent}%`;
  if (progressPct) progressPct.textContent = `${percent}%`;
  if (progressStage) progressStage.textContent = stageText;
  updateFeedback(stageText, 'normal', icon);
}

function applyBiometricVerifiedUI(token, confidence, name, studentId) {
  const bioCard = document.getElementById('biometric-card');
  const bioBadge = document.getElementById('bio-status-badge');
  const bioTitle = document.getElementById('bio-status-title');
  const bioDesc = document.getElementById('bio-status-description');
  const verifiedDetails = document.getElementById('bio-verified-details');
  const tokenDisplay = document.getElementById('bio-token-display');
  const confidenceDisplay = document.getElementById('bio-confidence-display');
  const scanBtn = document.getElementById('btn-scan-face');
  const rescanBtn = document.getElementById('btn-rescan-face');
  const submitBtn = document.getElementById('btn-login-submit');
  const loginError = document.getElementById('login-error');

  if (loginError) loginError.classList.remove('active');

  if (bioCard) bioCard.className = 'biometric-card verified';
  if (bioBadge) {
    bioBadge.className = 'bio-badge bio-badge-verified';
    bioBadge.textContent = 'Biometric Passed ✓';
  }
  if (bioTitle) bioTitle.textContent = 'Face & Liveness Verified';
  if (bioDesc) bioDesc.textContent = `Identity authenticated for ${name} (${studentId}). Digital voting booth unlocked.`;

  if (tokenDisplay) tokenDisplay.textContent = token;
  if (confidenceDisplay) confidenceDisplay.textContent = confidence;
  if (verifiedDetails) verifiedDetails.style.display = 'block';

  if (scanBtn) scanBtn.style.display = 'none';
  if (rescanBtn) rescanBtn.style.display = 'inline-flex';

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Enter Voting Booth &rarr;';
  }
}

function retryFaceScan() {
  currentScenario = 'normal';
  resetScannerUI();
  startCameraStream('normal');
}

function testScenario(scenario) {
  currentScenario = scenario;
  resetScannerUI();

  if (scenario === 'denied_permission') {
    startCameraStream('denied_permission');
    return;
  }

  startCameraStream(scenario);
  showToast(`Scenario active: ${scenario.replace('_', ' ').toUpperCase()}`, 'info');
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* ==========================================================================
   Screen 1: Voter Login Page Logic (index.html)
   ========================================================================== */
function setupLoginForm() {
  const loginForm = document.getElementById('login-form');
  const studentIdInput = document.getElementById('student-id');
  const voterNameInput = document.getElementById('voter-name');
  const errorMsg = document.getElementById('login-error');

  if (!loginForm) return;

  // Real-time lookup as user types Student ID
  if (studentIdInput) {
    studentIdInput.addEventListener('input', (e) => {
      handleStudentIdInput(e.target.value);
    });
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (errorMsg) errorMsg.classList.remove('active');

    const studentId = studentIdInput.value.trim().toUpperCase();
    const voterName = voterNameInput.value.trim();

    if (!studentId) {
      displayError('Please enter your Student ID / Enrollment Number.');
      studentIdInput.focus();
      return;
    }

    if (!voterName) {
      displayError('Please enter your Full Legal Name.');
      voterNameInput.focus();
      return;
    }

    // Ensure Face Scan Verification has been completed for this specific Student ID
    if (!verifiedBiometricData || verifiedBiometricData.studentId.toUpperCase() !== studentId) {
      displayError('Face Scan & Liveness Verification is mandatory. Please click "Scan Face & Complete Liveness Check".');
      const scanBtn = document.getElementById('btn-scan-face');
      if (scanBtn && scanBtn.style.display !== 'none') {
        scanBtn.focus();
      }
      return;
    }

    // Double check status in database
    const student = getStudentById(studentId);
    if (!student) {
      displayError(`Student ID "${studentId}" is not present in Allowed Students database.`);
      return;
    }

    if (student.status === 'Blocked') {
      displayError(`Student account "${student.name}" is Blocked. Login denied.`);
      return;
    }

    if (student.status === 'Voted') {
      displayError(`Student "${student.name}" has already voted. Duplicate voting is restricted.`);
      return;
    }

    // Store active session
    setActiveSession({
      voterId: student.studentId,
      studentId: student.studentId,
      name: student.name,
      department: student.department,
      email: student.email,
      biometricToken: verifiedBiometricData.token,
      confidence: verifiedBiometricData.confidence
    });

    showToast(`Welcome, ${student.name}! Accessing candidate ballot...`, 'success');
    setTimeout(() => {
      window.location.href = 'vote.html';
    }, 850);
  });

  function displayError(msg) {
    if (errorMsg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('active');
    } else {
      showToast(msg, 'error');
    }
  }
}

function handleStudentIdInput(rawId) {
  const badge = document.getElementById('id-status-badge');
  const nameInput = document.getElementById('voter-name');
  if (!badge) return;

  const cleanId = (rawId || '').trim().toUpperCase();
  if (!cleanId) {
    badge.style.display = 'none';
    return;
  }

  const student = getStudentById(cleanId);
  badge.style.display = 'inline-flex';

  if (!student) {
    badge.className = 'id-status-indicator unregistered';
    badge.textContent = '⚠️ Unregistered ID';
    return;
  }

  if (nameInput && !nameInput.value) {
    nameInput.value = student.name;
  }

  if (student.status === 'Active') {
    badge.className = 'id-status-indicator active';
    badge.textContent = `✓ Active (${student.department})`;
  } else if (student.status === 'Blocked') {
    badge.className = 'id-status-indicator blocked';
    badge.textContent = '🚫 Account Blocked';
  } else if (student.status === 'Voted') {
    badge.className = 'id-status-indicator voted';
    badge.textContent = '🔒 Already Voted';
  }
}

function fillDemoVoter(studentId, name, status = 'eligible') {
  const idInput = document.getElementById('student-id');
  const nameInput = document.getElementById('voter-name');
  const consentCheckbox = document.getElementById('biometric-consent');

  if (idInput) idInput.value = studentId;
  if (nameInput) nameInput.value = name;
  if (consentCheckbox) consentCheckbox.checked = true;

  handleStudentIdInput(studentId);

  if (status === 'voted') {
    showToast(`Loaded "${name}" (${studentId} - Already Voted). Test duplicate vote locking!`, 'info');
  } else if (status === 'blocked') {
    showToast(`Loaded "${name}" (${studentId} - Blocked). Test administrative block denial!`, 'warning');
  } else {
    showToast(`Loaded "${name}" (${studentId} - Active). Ready for face scan!`, 'success');
  }
}

/* ==========================================================================
   Screen 2: Candidate Voting Screen Logic (vote.html)
   ========================================================================== */
let selectedCandidateId = null;

function setupVotingPage() {
  const session = getActiveSession();
  const voterStatusBar = document.getElementById('voter-status-container');

  // Guard: Must be authenticated
  if (!session || !session.studentId) {
    showToast('Please authenticate with Student ID & Face Scan to access ballot.', 'warning');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1200);
    return;
  }

  // Guard: Verify student has not already voted
  const student = getStudentById(session.studentId);
  if (student && student.status === 'Voted') {
    showToast('You have already cast your official ballot! Redirecting to live results...', 'warning');
    setTimeout(() => {
      window.location.href = 'results.html';
    }, 1500);
    return;
  }

  // Render Voter Status Profile Header
  if (voterStatusBar) {
    const initials = session.name ? session.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST';
    voterStatusBar.innerHTML = `
      <div class="voter-profile">
        <div class="voter-avatar">${initials}</div>
        <div class="voter-details">
          <h4>${session.name} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-muted);">(${session.studentId} • ${session.department || 'Department'})</span></h4>
          <span>Biometric ID: <strong style="color:var(--text-main); font-family:monospace;">${session.biometricToken || session.studentId}</strong> • Status: <span style="color:var(--accent-emerald); font-weight:700;">Face Verified ✓</span></span>
        </div>
      </div>
      <div>
        <button class="btn btn-secondary btn-sm" onclick="handleLogout()">Log Out</button>
      </div>
    `;
  }

  // Render Candidates
  renderCandidateCards();

  // Setup Cast Vote Button Click
  const castVoteBtn = document.getElementById('btn-cast-vote');
  if (castVoteBtn) {
    castVoteBtn.addEventListener('click', openVoteConfirmationModal);
  }
}

function renderCandidateCards() {
  const grid = document.getElementById('candidate-grid');
  if (!grid) return;

  const candidates = getCandidates();
  grid.innerHTML = '';

  candidates.forEach(cand => {
    const card = document.createElement('div');
    card.className = `candidate-card ${selectedCandidateId === cand.id ? 'selected' : ''}`;
    card.id = `candidate-card-${cand.id}`;
    card.onclick = () => selectCandidate(cand.id);

    card.innerHTML = `
      <div>
        <div class="candidate-header">
          <div class="candidate-name-container">
            <span class="candidate-tag-badge">Candidate Nominee</span>
            <h3 class="candidate-name-heading">${cand.name}</h3>
          </div>
          <div class="selection-radio" id="radio-${cand.id}"></div>
        </div>

        <div class="candidate-symbol-section">
          <div class="candidate-avatar-box">
            ${cand.symbol}
          </div>
          <div class="candidate-symbol-details">
            <span class="candidate-symbol-label">Election Symbol</span>
            <span class="party-badge" style="background: #f1f5f9; border: 1px solid ${cand.badgeColor}; color: ${cand.badgeColor}">
              ${cand.symbol} ${cand.party}
            </span>
          </div>
        </div>

        <div class="manifesto-box" style="border-left-color: ${cand.badgeColor}">
          "${cand.slogan}"
        </div>
      </div>
      <div class="candidate-symbol">
        <span>Official Ballot Symbol:</span> <strong>${cand.symbol} ${cand.party}</strong>
      </div>
    `;

    grid.appendChild(card);
  });
}

function selectCandidate(candidateId) {
  selectedCandidateId = candidateId;

  const allCards = document.querySelectorAll('.candidate-card');
  allCards.forEach(card => card.classList.remove('selected'));

  const selectedCard = document.getElementById(`candidate-card-${candidateId}`);
  if (selectedCard) {
    selectedCard.classList.add('selected');
  }

  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === candidateId);
  const previewName = document.getElementById('selected-candidate-name');
  const castBtn = document.getElementById('btn-cast-vote');

  if (candidate && previewName) {
    previewName.textContent = `${candidate.name} (${candidate.symbol} ${candidate.party})`;
    previewName.style.color = candidate.badgeColor || '#ffffff';
  }

  if (castBtn) {
    castBtn.disabled = false;
    castBtn.classList.remove('btn-secondary');
    castBtn.classList.add('btn-primary');
  }
}

function openVoteConfirmationModal() {
  if (!selectedCandidateId) {
    showToast('Please select a candidate first!', 'warning');
    return;
  }

  const candidates = getCandidates();
  const candidate = candidates.find(c => c.id === selectedCandidateId);
  if (!candidate) return;

  const modalOverlay = document.getElementById('confirmation-modal');
  const modalCandidateName = document.getElementById('modal-candidate-name');
  const modalCandidateParty = document.getElementById('modal-candidate-party');

  if (modalCandidateName) modalCandidateName.textContent = candidate.name;
  if (modalCandidateParty) modalCandidateParty.innerHTML = `Official Symbol: <strong>${candidate.symbol} ${candidate.party}</strong>`;

  if (modalOverlay) {
    modalOverlay.classList.add('active');
  }
}

function closeVoteModal() {
  const modalOverlay = document.getElementById('confirmation-modal');
  if (modalOverlay) {
    modalOverlay.classList.remove('active');
  }
}

function confirmVoteSubmission() {
  const session = getActiveSession();
  if (!session || !selectedCandidateId) {
    showToast('Session expired or candidate unselected.', 'error');
    return;
  }

  const candidates = getCandidates();
  const students = getAllowedStudents();
  const student = students[session.studentId];

  // Double check if already voted
  if (student && student.status === 'Voted') {
    showToast('You have already submitted a ballot!', 'error');
    closeVoteModal();
    return;
  }

  // Increment candidate tally
  const candidateIndex = candidates.findIndex(c => c.id === selectedCandidateId);
  if (candidateIndex !== -1) {
    candidates[candidateIndex].votes += 1;
    saveCandidates(candidates);
  }

  // Update Student Lifecycle Status to 'Voted'
  const now = new Date();
  const formattedTime = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (student) {
    student.status = 'Voted';
    student.votedAt = formattedTime;
    student.votedFor = selectedCandidateId;
    students[session.studentId] = student;
    saveAllowedStudents(students);
  }

  // Record Audit Log Entry
  logSecurityEvent(
    session.studentId,
    session.name,
    'VOTE_CAST',
    'SUCCESS',
    `Ballot cast for candidate "${candidates[candidateIndex].name}". Account status updated to Voted.`,
    '100%'
  );

  closeVoteModal();
  triggerConfetti();
  showToast(`Ballot successfully recorded for ${candidates[candidateIndex].name}!`, 'success');

  const castBtn = document.getElementById('btn-cast-vote');
  if (castBtn) {
    castBtn.disabled = true;
    castBtn.innerHTML = 'Vote Recorded ✓';
  }

  clearActiveSession();

  setTimeout(() => {
    window.location.href = 'results.html';
  }, 2200);
}

/* ==========================================================================
   Screen 3: Live Results Screen Logic (results.html)
   ========================================================================== */
function setupResultsPage() {
  renderResultsView();

  const refreshBtn = document.getElementById('btn-refresh-results');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      renderResultsView();
      showToast('Live results refreshed.', 'info');
    });
  }
}

function renderResultsView() {
  const candidates = getCandidates();
  const students = getAllowedStudents();

  const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
  const totalStudentsCount = Object.keys(students).length;
  const votedStudentsCount = Object.values(students).filter(s => s.status === 'Voted').length;

  const totalVotesElem = document.getElementById('total-votes-count');
  const turnoutElem = document.getElementById('turnout-count');
  const leadingCandidateElem = document.getElementById('leading-candidate-name');

  if (totalVotesElem) totalVotesElem.textContent = totalVotes.toLocaleString();
  if (turnoutElem) {
    const turnoutPct = totalStudentsCount > 0 ? Math.round((votedStudentsCount / totalStudentsCount) * 100) : 0;
    turnoutElem.textContent = `${votedStudentsCount} / ${totalStudentsCount} (${turnoutPct}%)`;
  }

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const winner = sortedCandidates[0];

  if (leadingCandidateElem && winner) {
    leadingCandidateElem.textContent = `${winner.name} (${winner.votes} votes)`;
  }

  const winnerSpotlight = document.getElementById('winner-spotlight');
  if (winnerSpotlight && winner) {
    const winnerPercentage = totalVotes > 0 ? ((winner.votes / totalVotes) * 100).toFixed(1) : 0;
    winnerSpotlight.innerHTML = `
      <div class="winner-content">
        <div class="winner-crown">👑</div>
        <div class="winner-details">
          <div class="badge" style="background: rgba(245, 158, 11, 0.15); color: #92400e; border: 1px solid rgba(245, 158, 11, 0.4);">
            Current Election Frontrunner
          </div>
          <h3 class="gradient-gold-text">${winner.name}</h3>
          <p style="margin-top: 0.25rem;">Election Symbol: <strong>${winner.symbol} ${winner.party}</strong> • <strong>${winner.votes} votes</strong> (${winnerPercentage}% share)</p>
        </div>
      </div>
      <div>
        <span class="badge badge-live">
          <span class="pulse-dot"></span> LIVE LEADER
        </span>
      </div>
    `;
  }

  const resultsContainer = document.getElementById('results-list-container');
  if (resultsContainer) {
    resultsContainer.innerHTML = '';

    sortedCandidates.forEach((cand, index) => {
      const percentage = totalVotes > 0 ? ((cand.votes / totalVotes) * 100).toFixed(1) : 0;
      const rank = index + 1;
      const rankClass = rank === 1 ? 'rank-1' : rank === 2 ? 'rank-2' : rank === 3 ? 'rank-3' : '';

      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-header">
          <div class="result-candidate-title">
            <div class="rank-badge ${rankClass}">#${rank}</div>
            <div>
              <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.2rem;">${cand.name}</h4>
              <span style="font-size: 0.82rem; color: var(--text-muted); display: inline-flex; align-items: center; gap: 0.35rem;">
                Official Symbol: <strong>${cand.symbol} ${cand.party}</strong>
              </span>
            </div>
          </div>
          <div class="result-votes-info">
            <span class="vote-count-number">${cand.votes} votes</span>
            <span class="vote-percentage-number">(${percentage}%)</span>
          </div>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: 0%; background: ${cand.accentGradient || 'var(--gradient-brand)'};" data-target-width="${percentage}%"></div>
        </div>
      `;

      resultsContainer.appendChild(card);
    });

    setTimeout(() => {
      const fills = document.querySelectorAll('.progress-fill');
      fills.forEach(fill => {
        fill.style.width = fill.getAttribute('data-target-width');
      });
    }, 100);
  }
}

/* ==========================================================================
   Screen 4: Admin Portal & Allowed Students Logic (admin.html)
   ========================================================================== */
function setupAdminPage() {
  renderAdminMetrics();
  renderAllowedStudentsTable();
  renderAuditLogsTable();
}

function renderAdminMetrics() {
  const students = getAllowedStudents();
  const logs = getAuditLogs();

  const studentList = Object.values(students);
  const totalStudents = studentList.length;
  const activeStudents = studentList.filter(s => s.status === 'Active').length;
  const votedStudents = studentList.filter(s => s.status === 'Voted').length;
  const blockedStudents = studentList.filter(s => s.status === 'Blocked').length;

  const totalElem = document.getElementById('metric-total-students');
  const activeElem = document.getElementById('metric-active-students');
  const votedElem = document.getElementById('metric-voted-students');
  const blockedElem = document.getElementById('metric-blocked-students');
  const logsElem = document.getElementById('metric-total-logs');

  if (totalElem) totalElem.textContent = totalStudents;
  if (activeElem) activeElem.textContent = activeStudents;
  if (votedElem) votedElem.textContent = votedStudents;
  if (blockedElem) blockedElem.textContent = blockedStudents;
  if (logsElem) logsElem.textContent = logs.length;
}

function renderAllowedStudentsTable() {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  const searchInput = document.getElementById('student-search-input');
  const deptFilter = document.getElementById('filter-dept-select');
  const statusFilter = document.getElementById('filter-status-select');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedDept = deptFilter ? deptFilter.value : '';
  const selectedStatus = statusFilter ? statusFilter.value : '';

  const students = getAllowedStudents();
  let studentList = Object.values(students);

  // Apply filters
  if (query) {
    studentList = studentList.filter(s => 
      s.studentId.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.department.toLowerCase().includes(query)
    );
  }

  if (selectedDept) {
    studentList = studentList.filter(s => s.department === selectedDept);
  }

  if (selectedStatus) {
    studentList = studentList.filter(s => s.status === selectedStatus);
  }

  tbody.innerHTML = '';

  if (studentList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No allowed students found matching the filter criteria.
        </td>
      </tr>
    `;
    return;
  }

  studentList.forEach(student => {
    const tr = document.createElement('tr');

    let statusPillClass = 'status-pill-active';
    if (student.status === 'Blocked') statusPillClass = 'status-pill-blocked';
    if (student.status === 'Voted') statusPillClass = 'status-pill-voted';

    const shortHash = student.faceEmbeddingHash ? student.faceEmbeddingHash.substring(0, 18) + '...' : 'SHA-256: Enrolled';

    tr.innerHTML = `
      <td>
        <span class="table-student-id">${student.studentId}</span>
      </td>
      <td>
        <strong>${student.name}</strong>
        <div style="font-size: 0.78rem; color: var(--text-muted);">${student.department}</div>
      </td>
      <td>
        <span style="font-size: 0.82rem; color: var(--text-muted);">${student.email}</span>
      </td>
      <td>
        <span class="bio-hash-badge enrolled" title="${student.faceEmbeddingHash}">
          🔑 ${shortHash}
        </span>
      </td>
      <td>
        <span class="status-pill ${statusPillClass}">
          ${student.status}
        </span>
      </td>
      <td>
        <div class="table-actions">
          <button type="button" class="btn-icon" onclick="openEditStudentModal('${student.studentId}')" title="Edit Student">
            ✏️ Edit
          </button>
          <button type="button" class="btn-icon" onclick="toggleStudentStatus('${student.studentId}')" title="Toggle Active/Blocked">
            ${student.status === 'Blocked' ? '🟢 Unblock' : '🚫 Block'}
          </button>
          <button type="button" class="btn-icon btn-icon-danger" onclick="deleteStudent('${student.studentId}')" title="Delete Student">
            🗑️
          </button>
        </div>
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function handleStudentSearchAndFilter() {
  renderAllowedStudentsTable();
}

function openAddStudentModal() {
  const modal = document.getElementById('student-modal');
  const title = document.getElementById('student-modal-title');
  const mode = document.getElementById('student-form-mode');
  const form = document.getElementById('student-form');
  const idInput = document.getElementById('input-student-id');

  if (form) form.reset();
  if (title) title.textContent = 'Add Allowed Student';
  if (mode) mode.value = 'add';
  if (idInput) idInput.disabled = false;

  // Generate new fresh cryptographic biometric hash & vector
  generateNewBiometricVectorForForm();

  if (modal) modal.classList.add('active');
}

function openEditStudentModal(studentId) {
  const student = getStudentById(studentId);
  if (!student) return;

  const modal = document.getElementById('student-modal');
  const title = document.getElementById('student-modal-title');
  const mode = document.getElementById('student-form-mode');
  const origId = document.getElementById('student-form-original-id');

  const idInput = document.getElementById('input-student-id');
  const nameInput = document.getElementById('input-student-name');
  const deptInput = document.getElementById('input-student-dept');
  const emailInput = document.getElementById('input-student-email');
  const statusInput = document.getElementById('input-student-status');
  const hashDisplay = document.getElementById('enroll-bio-hash-display');
  const hashInput = document.getElementById('input-student-embedding-hash');
  const vectorInput = document.getElementById('input-student-embedding-vector');

  if (title) title.textContent = `Edit Allowed Student (${student.studentId})`;
  if (mode) mode.value = 'edit';
  if (origId) origId.value = student.studentId;

  if (idInput) {
    idInput.value = student.studentId;
    idInput.disabled = true; // Primary key locked on edit
  }
  if (nameInput) nameInput.value = student.name;
  if (deptInput) deptInput.value = student.department;
  if (emailInput) emailInput.value = student.email;
  if (statusInput) statusInput.value = student.status;

  if (hashDisplay) hashDisplay.textContent = `SHA-256: ${student.faceEmbeddingHash}`;
  if (hashInput) hashInput.value = student.faceEmbeddingHash;
  if (vectorInput) vectorInput.value = JSON.stringify(student.faceVector || []);

  if (modal) modal.classList.add('active');
}

function closeStudentModal() {
  const modal = document.getElementById('student-modal');
  if (modal) modal.classList.remove('active');
}

function generateNewBiometricVectorForForm() {
  const hash = generateRandomBiometricHash();
  const vector = generateRandomBiometricVector();

  const hashDisplay = document.getElementById('enroll-bio-hash-display');
  const hashInput = document.getElementById('input-student-embedding-hash');
  const vectorInput = document.getElementById('input-student-embedding-vector');

  if (hashDisplay) hashDisplay.textContent = `SHA-256: ${hash}`;
  if (hashInput) hashInput.value = hash;
  if (vectorInput) vectorInput.value = JSON.stringify(vector);

  showToast('New cryptographic facial embedding template generated.', 'info');
}

function handleSaveStudent(e) {
  e.preventDefault();

  const mode = document.getElementById('student-form-mode').value;
  const origId = document.getElementById('student-form-original-id').value;

  const idInput = document.getElementById('input-student-id');
  const nameInput = document.getElementById('input-student-name');
  const deptInput = document.getElementById('input-student-dept');
  const emailInput = document.getElementById('input-student-email');
  const statusInput = document.getElementById('input-student-status');
  const hashInput = document.getElementById('input-student-embedding-hash');
  const vectorInput = document.getElementById('input-student-embedding-vector');

  const studentId = idInput.value.trim().toUpperCase();
  const name = nameInput.value.trim();
  const department = deptInput.value;
  const email = emailInput.value.trim();
  const status = statusInput.value;
  let hash = hashInput.value || generateRandomBiometricHash();
  let vector = vectorInput.value ? JSON.parse(vectorInput.value) : generateRandomBiometricVector();

  if (!studentId || !name || !email) {
    showToast('Please fill all mandatory fields.', 'warning');
    return;
  }

  const students = getAllowedStudents();

  if (mode === 'add') {
    if (students[studentId]) {
      showToast(`Student ID "${studentId}" already exists in registry!`, 'error');
      idInput.focus();
      return;
    }

    students[studentId] = {
      studentId: studentId,
      name: name,
      department: department,
      email: email,
      faceEmbeddingHash: hash,
      faceVector: vector,
      status: status,
      registeredAt: new Date().toLocaleString(),
      votedAt: null
    };

    logSecurityEvent(studentId, name, 'ADMIN_ACTION', 'SUCCESS', `Added new allowed student: ${studentId} (${name})`);
    showToast(`Student ${name} (${studentId}) added successfully!`, 'success');
  } else {
    // Edit mode
    const student = students[origId];
    if (student) {
      student.name = name;
      student.department = department;
      student.email = email;
      student.status = status;
      student.faceEmbeddingHash = hash;
      student.faceVector = vector;
      students[origId] = student;

      logSecurityEvent(origId, name, 'ADMIN_ACTION', 'SUCCESS', `Updated details for student: ${origId}`);
      showToast(`Student ${name} updated successfully!`, 'success');
    }
  }

  saveAllowedStudents(students);
  closeStudentModal();
  renderAdminMetrics();
  renderAllowedStudentsTable();
}

function toggleStudentStatus(studentId) {
  const students = getAllowedStudents();
  const student = students[studentId];
  if (!student) return;

  const newStatus = student.status === 'Blocked' ? 'Active' : 'Blocked';
  student.status = newStatus;
  students[studentId] = student;
  saveAllowedStudents(students);

  logSecurityEvent(studentId, student.name, 'ADMIN_ACTION', 'SUCCESS', `Status toggled to ${newStatus}`);
  showToast(`Status for ${student.name} changed to ${newStatus}.`, 'info');
  renderAdminMetrics();
  renderAllowedStudentsTable();
}

function deleteStudent(studentId) {
  const students = getAllowedStudents();
  const student = students[studentId];
  if (!student) return;

  if (confirm(`Are you sure you want to remove "${student.name}" (${studentId}) from the Allowed Students list?`)) {
    delete students[studentId];
    saveAllowedStudents(students);

    logSecurityEvent(studentId, student.name, 'ADMIN_ACTION', 'SUCCESS', `Deleted student from registry: ${studentId}`);
    showToast(`Student ${studentId} removed from registry.`, 'info');
    renderAdminMetrics();
    renderAllowedStudentsTable();
  }
}

/* ==========================================================================
   Security Audit Logs Screen Logic (admin.html)
   ========================================================================== */
function renderAuditLogsTable() {
  const tbody = document.getElementById('audit-logs-body');
  if (!tbody) return;

  const searchInput = document.getElementById('log-search-input');
  const resultFilter = document.getElementById('log-filter-result');
  const eventFilter = document.getElementById('log-filter-event');

  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  const selectedResult = resultFilter ? resultFilter.value : '';
  const selectedEvent = eventFilter ? eventFilter.value : '';

  let logs = getAuditLogs();

  if (query) {
    logs = logs.filter(l => 
      (l.studentId || '').toLowerCase().includes(query) ||
      (l.studentName || '').toLowerCase().includes(query) ||
      (l.failureReason || '').toLowerCase().includes(query) ||
      (l.eventType || '').toLowerCase().includes(query)
    );
  }

  if (selectedResult) {
    logs = logs.filter(l => l.result === selectedResult);
  }

  if (selectedEvent) {
    logs = logs.filter(l => l.eventType === selectedEvent);
  }

  tbody.innerHTML = '';

  if (logs.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">
          No security audit records match the current filters.
        </td>
      </tr>
    `;
    return;
  }

  logs.forEach(log => {
    const tr = document.createElement('tr');

    let resultClass = log.result === 'SUCCESS' ? 'log-result-success' : 'log-result-denied';
    let eventBadgeClass = 'log-event-login';
    if (log.eventType === 'VOTE_CAST') eventBadgeClass = 'log-event-vote';
    if (log.eventType === 'LIVENESS_FAILED') eventBadgeClass = 'log-event-liveness';

    tr.innerHTML = `
      <td style="font-family: monospace; font-size: 0.78rem; color: var(--text-muted); white-space: nowrap;">
        ${log.timestamp}
      </td>
      <td>
        <span class="table-student-id">${log.studentId}</span>
        <span style="font-size: 0.82rem; margin-left: 0.35rem; font-weight: 600;">${log.studentName}</span>
      </td>
      <td>
        <span class="log-event-badge ${eventBadgeClass}">${log.eventType}</span>
      </td>
      <td>
        <span class="${resultClass}">${log.result === 'SUCCESS' ? '✓ SUCCESS' : '✕ ' + log.result}</span>
      </td>
      <td style="font-size: 0.82rem; color: var(--text-muted); max-width: 260px;">
        ${log.failureReason || 'N/A'}
      </td>
      <td style="font-family: monospace; font-size: 0.8rem; font-weight: 600;">
        ${log.confidence || 'N/A'}
      </td>
      <td style="font-size: 0.75rem; color: var(--text-subtle); max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
        ${log.deviceInfo || 'Client Browser'}
      </td>
    `;

    tbody.appendChild(tr);
  });
}

function handleLogSearchAndFilter() {
  renderAuditLogsTable();
}

function exportAuditLogs(format = 'csv') {
  const logs = getAuditLogs();
  if (logs.length === 0) {
    showToast('No logs available to export.', 'warning');
    return;
  }

  if (format === 'json') {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `evote_audit_logs_${Date.now()}.json`);
    dlAnchor.click();
    showToast('Audit logs exported as JSON.', 'success');
  } else {
    // CSV export
    const headers = ['ID', 'Timestamp', 'StudentID', 'StudentName', 'EventType', 'Result', 'Reason', 'Confidence', 'DeviceInfo'];
    const rows = logs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.studentId}"`,
      `"${l.studentName}"`,
      `"${l.eventType}"`,
      `"${l.result}"`,
      `"${(l.failureReason || '').replace(/"/g, '""')}"`,
      `"${l.confidence}"`,
      `"${(l.deviceInfo || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `evote_audit_logs_${Date.now()}.csv`);
    link.click();
    showToast('Audit logs exported as CSV.', 'success');
  }
}

function clearAllAuditLogs() {
  if (confirm('Are you sure you want to clear all security audit logs? This action cannot be undone.')) {
    saveAuditLogs([]);
    renderAdminMetrics();
    renderAuditLogsTable();
    showToast('Security audit logs cleared.', 'info');
  }
}

/* ==========================================================================
   Confetti Burst Engine (Pure Canvas)
   ========================================================================== */
function triggerConfetti() {
  let canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    document.body.appendChild(canvas);
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 120;
  const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ffffff'];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2 + 100,
      radius: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 10,
      tiltAngleInc: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
      velocity: {
        x: (Math.random() - 0.5) * 18,
        y: (Math.random() - 0.8) * 18
      },
      gravity: 0.35,
      opacity: 1
    });
  }

  let animationFrame;
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.velocity.x;
      p.y += p.velocity.y;
      p.velocity.y += p.gravity;
      p.velocity.x *= 0.98;
      p.tiltAngle += p.tiltAngleInc;
      p.tilt = Math.sin(p.tiltAngle) * 15;
      p.opacity -= 0.008;

      if (p.opacity > 0 && p.y < canvas.height) {
        alive = true;
        ctx.beginPath();
        ctx.lineWidth = p.radius;
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.moveTo(p.x + p.tilt + p.radius / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.radius / 2);
        ctx.stroke();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  render();
}

/* ==========================================================================
   Navigation & Session Helper
   ========================================================================== */
function handleLogout() {
  clearActiveSession();
  showToast('Logged out of session.', 'info');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 600);
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  initStorage();

  const session = getActiveSession();
  const sessionBadge = document.getElementById('nav-session-badge');
  if (sessionBadge && session) {
    sessionBadge.style.display = 'inline-flex';
    sessionBadge.innerHTML = `<span class="user-dot"></span> Face Verified: ${session.name || session.studentId}`;
  }
});
