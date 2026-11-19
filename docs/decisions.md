# Architecture Decision Records (ADRs) — VigiLocus

This document serves as an Architecture Decision Record (ADR) log for the **VigiLocus CCTV Incident Intelligence & Theft Prevention Platform**. It captures key technical, architectural, and design choices made during development, including context, alternatives considered, and trade-offs.

---

## ADR 001: Hybrid Perception Pipeline (YOLOv8 Nano with OpenCV HOG Fallback)

- **Date**: 2026-08-15
- **Status**: Accepted
- **Deciders**: Core Engineering Team

### Context
Real-time security threat detection requires automated person and object detection across live CCTV feeds. Deployments occur on diverse hardware environments ranging from high-performance CUDA workstations to CPU-only developer laptops and resource-constrained cloud servers (e.g. Render/Vercel). Missing hardware acceleration or binary library incompatibilities must not cause system startup crashes or stream failures.

### Decision
Implement a resilient, hybrid object detection architecture (`backend/app/ai/detector.py` & `device_manager.py`):
1. **Primary Detector**: Ultralytics YOLOv8 Nano (`yolov8n.pt`) loaded via PyTorch, targeting class `0` (`person`).
2. **Device Acceleration**: Automatically detect NVIDIA CUDA capability via `torch.cuda.is_available()`, routing execution to CUDA if present or CPU if unavailable.
3. **Graceful Fallback**: If PyTorch or model loading fails, automatically switch execution to OpenCV's built-in `cv2.HOGDescriptor_getDefaultPeopleDetector()`.

### Alternatives Considered
- **Heavy Vision Models (YOLOv8x / Faster R-CNN)**: High detection accuracy but incapable of real-time multi-stream execution on standard CPU hardware (<2 FPS).
- **Cloud Vision APIs (AWS Rekognition / Google Cloud Vision API)**: High monthly per-frame API costs, bandwidth saturation for continuous video, and high latency network roundtrips (>500ms).

### Consequences
- **Positive**: 100% system availability across all host environments; zero crash risk on bare minimum environments.
- **Positive**: High throughput (~4–15 FPS on CPU, 60+ FPS on CUDA) enabling multi-stream real-time analysis.
- **Negative**: OpenCV HOG fallback has lower detection precision compared to YOLOv8 in low-light conditions.

---

## ADR 002: Euclidean Centroid Tracking vs. Deep Learning Re-ID (DeepSORT)

- **Date**: 2026-08-16
- **Status**: Accepted
- **Deciders**: Computer Vision & AI Engineers

### Context
Evaluating loitering duration and spatial dwell time requires tracking individual entities across consecutive video frames. Re-identifying subjects without generating duplicate alerts on every single frame is critical to prevent security operator fatigue.

### Decision
Implement a high-speed Euclidean Centroid Distance Tracker (`backend/app/ai/tracker.py`). The tracker computes center points of detected bounding boxes, matches them across frames using Euclidean distance matrices, maintains wall-clock dwell timers, and assigns stable identifiers (`TRACK-#XXXX`).

### Alternatives Considered
- **DeepSORT / ByteTrack / BoT-SORT**: Deep learning-based tracking with feature extraction neural networks for visual re-identification.

### Consequences
- **Positive**: Sub-millisecond tracking execution time (~0.2ms per frame), requiring negligible CPU resources.
- **Positive**: Highly reliable for fixed CCTV perspectives where subjects move predictably across entry points and perimeters.
- **Negative**: Does not maintain identity if a subject is fully occluded for extended periods (>5 seconds / 50 frames).

---

## ADR 003: Deterministic 0–100 Contextual Risk Engine vs. Pure LLM Alert Scoring

- **Date**: 2026-08-17
- **Status**: Accepted
- **Deciders**: Product Architecture & Security Operations Lead

### Context
In physical security operations, non-deterministic or hallucinated risk scores can lead to unverified guard dispatches or missed security breaches. Risk scoring must be 100% transparent, explainable, and reproducible for audit and compliance.

### Decision
Implement a deterministic, mathematical weighted scoring formula (`backend/app/ai/risk_engine.py`) that calculates risk scores from 0 to 100:

$$\text{Risk Score} = \min\left(100, S_{\text{zone}} + S_{\text{auth}} + S_{\text{dwell}} + S_{\text{temporal}} + S_{\text{behavior}}\right)$$

Where:
- $S_{\text{zone}}$: Spatial Zone Severity (Restricted = +35, High = +25, Medium = +15)
- $S_{\text{auth}}$: Identity Authorization (Unrecognized = +30, Visitor = +15, Resident = 0)
- $S_{\text{dwell}}$: Dwell Time Exceeded (+25)
- $S_{\text{temporal}}$: Off-Hours / Night Window (+15)
- $S_{\text{behavior}}$: Rapid Motion / Perimeter Crossing (+15)

Risk levels are categorized deterministically: `LOW` (0–29), `MEDIUM` (30–59), `HIGH` (60–79), and `CRITICAL` (80–100).

### Alternatives Considered
- **Direct LLM Alert Scoring**: Sending raw detection frames/events directly to an LLM to generate risk scores on the fly.

### Consequences
- **Positive**: 100% reproducible and explainable; generates a explicit array of `risk_reasons` for every alert.
- **Positive**: Zero API latency or cost overhead for threat scoring; compliant with ethical AI standards (never autonomously attributes guilt or criminal intent).
- **Negative**: Requires manual calibration of weight parameters for specific property types.

---

## ADR 004: Dual-Tier AI Layer Architecture (Deterministic Engine + Google Gemini LLM)

- **Date**: 2026-08-18
- **Status**: Accepted
- **Deciders**: AI & Backend Team

### Context
While the deterministic engine reliably flags risk numbers, security guards working fast-paced shifts require natural language incident summaries, 5-second decision support checklists, and conversational log querying.

### Decision
Integrate Google Gemini API (`backend/app/ai/gemini_service.py` using `gemini-1.5-flash` / `gemini-2.0-flash`) as an assistance layer. Gemini is used exclusively for:
1. Generating concise incident briefs and guard verification checklists (`/api/ai/explain-alert`).
2. Powering the read-only conversational SOC assistant (`/api/ai/chat`).

All Gemini prompts are governed by strict system instructions (`ai_prompts.py`) enforcing ethical boundaries.

### Alternatives Considered
- **On-Premise Open-Weights LLM (Ollama / Llama-3-8B)**: Avoids third-party cloud API dependence, but requires 8GB+ VRAM GPU per edge gateway.
- **No LLM Integration**: Pure text templates; lacks conversational intelligence and natural language decision synthesis.

### Consequences
- **Positive**: Sub-second LLM response times using Gemini Flash models; zero local GPU VRAM requirement for language processing.
- **Positive**: Built-in fallback mechanisms return structured default briefs if the Gemini API key is unconfigured or rate-limited.
- **Negative**: Requires internet connectivity for LLM-enhanced summaries (though core detection and local alerting operate offline).

---

## ADR 005: Ground-Contact Spatial Zone Boundary Engine (Ray-Casting Algorithm)

- **Date**: 2026-08-19
- **Status**: Accepted
- **Deciders**: Computer Vision Lead

### Context
CCTV cameras are installed at elevated angles, causing upper-body bounding boxes to overlap with background zones (e.g. a person walking on a sidewalk whose head overlaps a fence line). Standard rectangular bounding-box overlap checks create false-positive zone breaches.

### Decision
Implement a 2D Ray-Casting Point-in-Polygon algorithm (`backend/app/ai/zone_engine.py`). The engine extracts the **bottom-center foot coordinate** $(x_{\text{center}}, y_{\text{bottom}})$ of each bounding box and evaluates it against normalized polygon vertices.

### Alternatives Considered
- **Bounding Box Intersection over Union (IoU)**: Causes massive false positives due to perspective overlap.
- **Semantic Segmentation (SAM / Mask R-CNN)**: High computational cost (~200ms per frame), rendering multi-camera streaming impossible on standard hardware.

### Consequences
- **Positive**: Extremely fast mathematical evaluation (<0.01ms per detection); eliminates false alerts caused by camera angle perspective overlap.
- **Positive**: Allows operators to draw precise polygon boundaries (e.g., fence lines, vault doors, loading bays).
- **Negative**: Requires accurate camera calibration so foot coordinates correspond to ground plane position.

---

## ADR 006: Operational Mode Isolation (`DEMO_MODE` vs Production Security Control)

- **Date**: 2026-08-20
- **Status**: Accepted
- **Deciders**: Security & DevOps Lead

### Context
Developers need to evaluate local camera streams and UI dashboards without complex environment setup, while production deployments require strict JWT authentication, strict CORS origin controls, and defense against Server-Side Request Forgery (SSRF).

### Decision
Implement a central `DEMO_MODE` flag in `Settings` (`backend/app/config.py`).
- **When `DEMO_MODE=true`**: Synthetic video loops and local webcams initialize automatically; default secret key fallback is permitted; CORS accepts localhost and file origins.
- **When `DEMO_MODE=false`**: System strictly enforces explicit `SECRET_KEY` configuration, blocks non-whitelisted CORS origins, validates RTSP stream URLs against SSRF vulnerabilities (`SEC-M02`), and mandates WebSocket authentication.

### Alternatives Considered
- **Separate Code Bases or Hardcoded Flags**: High maintenance overhead and risk of deploying development settings to production.

### Consequences
- **Positive**: Single unified codebase for local demonstration, CI/CD testing, and production deployment.
- **Positive**: Prevents security misconfigurations in production environments.

---

## ADR 007: Next.js 14 App Router with Tailwind CSS & Real-Time WebSockets UI

- **Date**: 2026-08-21
- **Status**: Accepted
- **Deciders**: Frontend Engineering Lead

### Context
Security control room operators require a high-contrast dark theme, instant multi-stream grid rendering, live WebSockets alert streaming, and responsive page transitions without layout shifts.

### Decision
Build the web application using Next.js 14 App Router, React Client Components, Tailwind CSS for layout utility styling, custom glassmorphic control-room aesthetics, and custom React hooks (`useAlertWebSocket`) for WebSocket event push.

### Alternatives Considered
- **Single Page Application (Vite / CRA)**: Lacks built-in server optimization, SEO capabilities, and route group structure.
- **Heavy Enterprise Component Libraries (Material UI / Ant Design)**: Heavy CSS bundle overhead, rigid default light themes, and slower custom styling workflows.

### Consequences
- **Positive**: Rapid render performance; complete visual control over 24/7 dark-mode control room UI; real-time WebSocket alert updates without polling.
- **Negative**: Requires explicit `'use client'` directives for client-side stateful components.
