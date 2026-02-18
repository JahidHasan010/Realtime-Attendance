# Lincoln Presence™ Project Implementation Plan 📋

## 🔍 1. Project Overview & Scope
The **Lincoln Presence™** project is an automated Smart Attendance Management System designed to modernize student tracking at Lincoln University College, Malaysia. It aims to eliminate manual attendance errors using a high-performance facial recognition AI engine.

## 🏗 2. Technical Architecture Breakdown

### Frontend Layer (React.js + Ant Design)
- **State Management**: Using React `useState` and `useEffect` hooks for local component state.
- **Routing**: Client-side navigation managed via `react-router-dom` v6.
- **UI System**: Built on **Ant Design (Antd)** for enterprise-ready components and **Tailwind CSS** for custom layout utilities.
- **Time/Date Management**: Utilizing `dayjs` with `utc` and `local` plugins to ensure accurate timestamping across regions.

### Service Layer (Axios)
- **API Client**: Centralized Axios instance in `src/api/auth.js` with a base URL configuration.
- **Service Modules**: Dedicated modules for `auth`, `admin`, `attendance`, `sessions`, and `reports` to maintain clean separation of concerns.

## 🔄 3. Core Business Logic & Workflows

### Phase 1: Authentication & Access Control
- [x] Implement administrative login.
- [x] Secure application shell with `AppLayout`.
- [x] Session persistence using `localStorage` for demo/MVP stability.

### Phase 2: AI-Powered Live Session (The Engine)
1. **Camera Feed**: Access device hardware via `navigator.mediaDevices.getUserMedia`.
2. **Recognition Loop**:
    - Trigger a capture every **3 seconds**.
    - Convert video frame to Base64/JPEG using an invisible `canvas`.
    - POST the frame to `/attendance/recognize`.
3. **Dynamic Feedback**:
    - Match API results with student IDs.
    - Update the "Recent Detections" feed instantly with name, ID, and local time.
    - Increment the session's "Total Detections" counter.

### Phase 3: Administrative Control & Registry
- [x] Build the "Student Registry" to view faculty and subject data.
- [x] Implement the "Dashboard" with real-time KPI cards.
- [x] Connect `adminAPI` to fetch system-wide statistics.

### Phase 4: Reporting & Official Documentation
- [x] Build filtering logic by `Subject` and `Date`.
- [x] Implement `PRESENT` vs. `ABSENT` logic by merging student registry data with attendance logs.
- [x] **PDF Generation**:
    - Format official headers (Lincoln University College).
    - Auto-generate grid tables using `jspdf-autotable`.
    - Include official "Instructor Signature" lines for university policy compliance.

## 🚀 4. Future Implementation & Enhancements (Roadmap)

### Short-Term (1-3 Months)
- [ ] **JWT Integration**: Replace basic authentication with secure JWT-based tokens.
- [ ] **Manual Override**: Allow admins to manually mark students as "Present" in the Live Session view.
- [ ] **Error Handling**: Add specialized UI states for "No Students Found" and "API Timeout".

### Mid-Term (3-6 Months)
- [ ] **Multi-Camera Support**: Allow administrators to switch between front/back or external IP cameras.
- [ ] **Student Dashboard**: Create a "Read-Only" portal for students to view their own attendance history.
- [ ] **Bulk Import**: Add a feature to upload `.csv` or `.xlsx` files to the Student Registry.

### Long-Term (Enterprise Grade)
- [ ] **Face Registration Module**: Implement a system to register new students by taking their photos directly in the app.
- [ ] **Email Alerts**: Automatically email students who miss more than 2 consecutive classes.
- [ ] **Deployment**: Optimize the build for Vercel/Netlify with CI/CD pipelines.

---

## 🛠 5. Implementation Notes
- **Time Zones**: Always store timestamps in ISO (UTC) format on the backend. Always convert to `dayjs().local()` on the frontend before display.
- **Performance**: Ensure the `canvas` used for frame capture is disposed of correctly to prevent memory leaks in long sessions.
- **Design Policy**: Maintain the "Professional Blue" (`#1d4ed8`) primary color to align with university branding.
