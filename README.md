# Lincoln Presence™ 🎓

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![Status](https://img.shields.io/badge/status-stable-green)
![License](https://img.shields.io/badge/license-MIT-blue)

**Lincoln Presence™** is a professional-grade Smart Attendance Management System designed for Lincoln University College, Malaysia. It leverages advanced facial recognition AI to automate student attendance, replacing traditional roll-calls with a secure, real-time digital solution.

---

## 🚀 Key Features

-   **AI Facial Recognition**: Automated student detection using specialized recognition models.
-   **Live Session Monitoring**: Real-time camera feed with instant detection logs and session statistics.
-   **Enterprise Dashboard**: High-level overview of system health, student statistics, and active sessions.
-   **Student Registry**: Centralized management of student profiles, faculty data, and subject enrollments.
-   **Official Reporting**: Generate and export professional PDF attendance reports with instructor signature sections.
-   **Secure Administration**: Role-based access control with a modern, intuitive administrative portal.

---

## 🛠 Tech Stack

### Frontend
-   **Framework**: React.js (v18+)
-   **UI Library**: Ant Design (Antd)
-   **Styling**: Tailwind CSS
-   **State/Routing**: React Router DOM v6
-   **Date Management**: Day.js (UTC/Local synchronization)
-   **Reporting**: jsPDF & jsPDF-AutoTable

### Backend (Integration Ready)
-   **API Client**: Axios (configured with interceptors)
-   **Endpoints**: Standardized RESTful API structure for `/auth`, `/attendance`, `/sessions`, and `/admin`.

---

## 📂 Project Structure

```text
src/
├── api/            # API Service Layer (Axios instances)
├── components/     # UI Components (Dashboard, LiveSession, etc.)
├── assets/         # Static images and icons
├── utils/          # Helper functions and formatting
└── App.js          # Main Application Shell & Layout
```

---

## 📥 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/lincoln-presence.git
    cd lincoln-presence
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory:
    ```env
    REACT_APP_API_BASE_URL=/api
    ```

4.  **Launch the Application**:
    ```bash
    npm start
    ```

---

## 📖 Usage Guide

1.  **Login**: Use administrative credentials to access the portal.
2.  **Dashboard**: Monitor system health and view total student enrollment.
3.  **Start a Session**:
    -   Navigate to **Live Session**.
    -   Select the **Subject** from the dropdown.
    -   Click **Start Session** to activate the AI camera feed.
4.  **Reporting**: Go to **Reports**, filter by date/subject, and click **Export PDF** for official university records.

---

## ⚖️ License

Distributed under the MIT License. Developed for **Lincoln University College, Malaysia**.

© 2026 Lincoln University College. All Rights Reserved.
