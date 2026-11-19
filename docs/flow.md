# System & Logic Flow — VigiLocus

This document maps out the architecture, data flows, and core user journeys for the **VigiLocus CCTV Incident Intelligence & Theft Prevention Platform**.

---

## 1. System Architecture Flowchart (Mermaid.js)

```mermaid
flowchart TD
    %% Node Definitions
    subgraph Ingestion["1. Video Ingestion & Perception Layer"]
        A1["RTSP Camera Streams"] --> Ingest["StreamManager (OpenCV cv2.VideoCapture)"]
        A2["USB Webcams"] --> Ingest
        A3["Demo MP4 Video Loops"] --> Ingest
        Ingest --> FrameBuf["Frame Buffer & Resizer"]
        FrameBuf --> Detector["YOLOv8 Nano Detector (PyTorch CUDA/CPU)"]
        Detector -- Fallback if PyTorch fails --> HOGDetector["OpenCV HOG Descriptor"]
        Detector & HOGDetector --> BBoxes["Detected Person Bounding Boxes"]
    end

    subgraph Tracking["2. Object Tracking & Spatial Zone Layer"]
        BBoxes --> Tracker["Euclidean Centroid Tracker"]
        Tracker --> Tracks["Active Track IDs (TRACK-#0104) + Dwell Timers"]
        Tracks --> FeetExtract["Extract Ground-Contact Foot Coordinates (X_center, Y_bottom)"]
        FeetExtract --> ZoneEngine["Spatial Zone Engine (Ray-Casting Point-in-Polygon)"]
        ZoneEngine --> ZoneResult["Zone Breach Status & Severity (Restricted, Server Room, Perimeter)"]
    end

    subgraph Scoring["3. Contextual Risk Scoring Engine"]
        ZoneResult & Tracks --> RiskEngine["Deterministic Risk Engine (0-100 Weighted Score)"]
        RiskEngine --> Formula["Score = Zone(35) + Auth(30) + Dwell(25) + Time(15) + Behavior(15)"]
        Formula --> RiskEval{"Risk Score Level"}
        RiskEval -- "Risk < 30" --> LowRisk["LOG & IGNORE (Low Noise)"]
        RiskEval -- "Risk >= 30" --> AlertGen["GENERATE ACTIVE ALERT"]
    end

    subgraph Persistence["4. Alert Persistence & Real-Time Push"]
        AlertGen --> DB[("SQLite Database (alerts, incidents, audit_logs)")]
        AlertGen --> WS["WebSocket Broadcaster (/api/ws/alerts)"]
        AlertGen --> GeminiServ["Google Gemini AI Layer (gemini-1.5-flash)"]
        GeminiServ --> AIBrief["Structured AI Incident Brief & Triage Checklist"]
        AIBrief --> DB
    end

    subgraph Frontend["5. Security Operator Command Center (Next.js 14 Dashboard)"]
        WS --> UIAlertStream["Live Alerts Stream Component"]
        DB --> UIMonitoring["Multi-Camera Live Grid View"]
        UIAlertStream --> TriageModal["5-Second Alert Triage Protocol Modal"]
        TriageModal --> GuardAction{"Guard Verification Decision"}
        GuardAction -- "Acknowledge / Dispatch" --> ActionAck["Update Status: INVESTIGATING / RESOLVED"]
        GuardAction -- "False Alarm" --> ActionFalse["Update Status: FALSE_POSITIVE"]
        ActionAck & ActionFalse --> AuditLog["Append to Chronological Audit Timeline"]
        AuditLog --> DB
    end
```

---

## 2. Core Data Flows

### A. Video Detection to Risk Evaluation Flow
```
[CCTV Video Stream]
       │
       ▼
1. StreamManager.read_frame() ────────► Reads raw BGR video frame
       │
       ▼
2. Detector.detect() ─────────────────► Returns Bounding Boxes [x1, y1, x2, y2, conf]
       │
       ▼
3. Tracker.update() ──────────────────► Matches Centroids, assigns TRACK-ID, computes dwell_seconds
       │
       ▼
4. ZoneEngine.evaluate_zones() ───────► Tests ground coordinate against Polygon Vertices (Ray-Casting)
       │
       ▼
5. RiskEngine.compute_risk() ─────────► Evaluates weighted risk rules -> Returns 0-100 Score & Reasons
       │
       ▼
6. DB & WebSocket Broadcast ──────────► Saves to SQLite `alerts` table & emits WebSocket payload
```

### B. Real-Time Alert Push & AI Summarization Flow
```
[New Alert Triggered (Risk >= 30)]
       │
       ├─────────────────────────────────────────┐
       ▼                                         ▼
1. WebSockets (/api/ws/alerts)           2. Gemini AI Service (Background Task)
       │                                         │
       ▼                                         ▼
Broadcast Payload to React Dashboard     `ai_prompts.py` System Instruction
       │                                         │
       ▼                                         ▼
UI Flashes Red Alert Card                Generates structured AI Brief & 5-Step Checklist
       │                                         │
       ▼                                         ▼
Guard Opens Triage Modal ◄─────────────── Merges AI Brief into Triage View
```

---

## 3. Core User Journeys

### Journey 1: Security Operator Surveillance & 5-Second Alert Triage
**Goal**: Monitor multi-camera property feeds and triage elevated security alerts within 5 seconds.

1. **Authentication**: Security Guard logs into VigiLocus SOC Portal (`/login`) using credentials (`guard` / `guard123`). Receives JWT bearer token stored securely.
2. **Dashboard Overview**: Operator opens the Live Feed Dashboard (`/dashboard`). The dashboard displays:
   - Live KPI cards: Active Cameras, People Detected, Active Alerts, System Telemetry.
   - Multi-Camera Monitoring Grid preview (4–16 feeds).
   - Real-time Active Alerts panel sorted by priority.
3. **Automated Threat Detection**: An unrecognized person enters a restricted perimeter zone after hours.
   - Vision Engine detects entity (`TRACK-#0104`).
   - Ground-contact foot coordinate breaches `RESTRICTED_FENCE` polygon.
   - Risk Engine computes: Zone (+35) + Unrecognized (+30) + Night Window (+15) = **80/100 (CRITICAL)**.
4. **Instant Notification**: The backend saves the alert and broadcasts it over WebSockets. The dashboard plays an alert tone and highlights the red alert ribbon.
5. **5-Second UX Triage**: Operator clicks **Triage Alert**:
   - The **Alert Triage Modal** displays:
     - **WHO**: Unrecognized Subject (`TRACK-#0104`)
     - **WHERE**: East Perimeter Gate (`CAM-01`)
     - **WHEN**: 02:14:05 AM (Off-hours)
     - **WHAT**: Spatial Zone Breach & Dwell Time Exceeded
     - **WHY**: Deterministic Risk Score **80/100** (`risk_reasons` array)
     - **WHAT TO DO**: AI Verification Checklist (1. Verify CCTV feed, 2. Check visitor log, 3. Dispatch guard)
6. **Guard Verification & Action**: Operator reviews live stream, clicks **Acknowledge & Dispatch**, enters resolution notes, and saves.
7. **Audit Persistence**: System updates alert status to `INVESTIGATING`, logs entry to `incident_timeline_events`, and appends an immutable `audit_logs` entry.

---

### Journey 2: Security Admin Camera Setup & Spatial Zone Configuration
**Goal**: Connect security camera streams and configure polygon perimeter boundary rules.

1. **Navigate to Camera Management**: Admin accesses `/cameras`.
2. **Connect Stream**: Admin clicks **Add Camera Feed**:
   - Fills in: Camera Name (*"North Storage Bay"*), Zone (*"Perimeter North"*), Stream Type (*RTSP*), Source URL (`rtsp://admin:pass@192.168.1.120:554/stream`).
   - Clicks **Save Camera**. Backend registers record in `cameras` table and initializes `StreamManager`.
3. **Stream Health Verification**: Admin clicks **Test Stream**. System validates RTSP connectivity and reports live status (e.g. *1920x1080 @ 30 FPS*).
4. **Define Spatial Polygon Zone**: Admin clicks **Add Spatial Zone**:
   - Selects camera (*North Storage Bay*).
   - Names zone (*"Loading Dock Restricted Vault"*).
   - Sets zone type (*RESTRICTED*), severity (*CRITICAL*), and max dwell threshold (*15 seconds*).
   - Defines normalized polygon coordinates `[[0.1, 0.2], [0.8, 0.2], [0.8, 0.9], [0.1, 0.9]]`.
5. **Activation**: Spatial Zone Engine immediately enforces boundary monitoring on incoming camera frames.

---

### Journey 3: Resident & Visitor Access Pre-Registration
**Goal**: Pre-register visitors to eliminate false intruder alerts for expected guests.

1. **Access Directory**: Concierge or Resident opens Visitor Directory (`/visitors`).
2. **Pre-Register Guest**: Clicks **Register Expected Visitor**:
   - Inputs Visitor Name (*"Alex Morgan"*), Unit Number (*"Unit 402"*), Resident Host (*"Jane Doe"*), Arrival Window (*Today 2:00 PM - 6:00 PM*), Purpose (*"Contractor Maintenance"*).
3. **Pass Generation**: System creates record in `expected_visitors` table, generates a unique `PASS-XXXX` identifier and digital QR payload.
4. **Gate Arrival & Verification**:
   - Visitor arrives at main gate.
   - When scanned or checked, status updates to `CHECKED_IN`.
   - Vision Engine cross-references `expected_visitors`. Presence of an active pass suppresses unauthorized risk points ($S_{\text{auth}} = 0$).

---

### Journey 4: Security Supervisor Incident Investigation & Analytics Audit
**Goal**: Review crime trends, audit incident resolution timelines, and export evidence reports.

1. **Open Analytics & Heatmaps**: Supervisor opens Analytics (`/analytics`).
   - Reviews monthly threat counts, crime trend graphs, peak incident hours, and property threat heatmaps.
2. **Incident Timeline Inspection**: Supervisor opens Incident Log (`/incidents`):
   - Filters incidents by Severity (*CRITICAL*), Date Range, or Status (*OPEN*).
   - Selects a specific incident (`INC-8042`).
3. **Audit History Review**: System renders the interactive **Chronological Audit Timeline**:
   - `02:14:05 AM` — Object Detected (`TRACK-#0104`)
   - `02:14:07 AM` — Boundary Breach (`RESTRICTED_FENCE`)
   - `02:14:08 AM` — Risk Score Evaluated (80/100)
   - `02:14:15 AM` — Alert Acknowledged by Guard (`guard_john`)
   - `02:18:22 AM` — Incident Resolved with Notes (*"Patrol dispatched. Verified authorized contractor."*)
4. **Evidence Export**: Supervisor clicks **Export Evidence Report** to generate a formatted audit document for management or police submission.
