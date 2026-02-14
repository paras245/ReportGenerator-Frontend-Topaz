# 📊 Report Generator Frontend

A robust, real-time Angular application for generating and monitoring report jobs.

## 🚀 Overview

This application serves as the user interface for the Report Generator system. It allows users to submit new report requests and view the status of their jobs in real-time. The application is built with **Angular 21** and leverages **SignalR** for instant updates, ensuring a responsive and synchronized user experience.

## ✨ Key Features

*   **⚡ Real-Time Monitoring**: Integrates with **SignalR** to push status updates (Pending ➡️ Processing ➡️ Completed) to the client instantly without manual refreshes.
*   **🔄 Robust Synchronization**: Implements a smart polling strategy (5-second interval) alongside SignalR to handle edge cases like network interruptions or backend data deletions, ensuring the UI always reflects the true server state.
*   **🎨 Modern UI/UX**:
    *   **🟢 Live Indicators**: Visual cues (pulsing indicators) to reassure users of active monitoring.
    *   **📱 Responsive Design**: Clean, card-based layouts that adapt to different screen sizes.
    *   **✅ User Feedback**: Comprehensive validation, error handling, and loading states.
*   **🔒 Secure & Scalable**:
    *   **Validation**: Enforces logical constraints (e.g., End Date must be after Start Date) before submission.
    *   **Standalone Architecture**: Utilizes Angular's latest standalone component pattern for better modularity.

## 📁 Project Structure

*   `src/app/components`:
    *   **📝 CreateReportComponent**: Handles report submission with validation and error feedback.
    *   **📋 ReportListComponent**: Displays the real-time job table with distinct status badges.
*   `src/app/services`:
    *   **🌐 ReportService**: Manages standard HTTP REST API communication.
    *   **📡 SignalRService**: Encapsulates WebSocket connection logic and event handling.
*   `src/app/models`: Strongly typed interfaces for `ReportJob`, `CreateReportDto`, and enums.

## 🛠️ Technical Highlights

*   **SignalR Integration**: The `SignalRService` establishes a persistent connection to the backend hub. It handles connection lifecycle events and broadcasts updates via **Angular Signals**.
*   **Angular Signals**: utilized for reactive state management, providing fine-grained updates to the UI when data changes.
*   **CORS Handling**: The SignalR connection is configured to negotiate correctly with the backend's security policies.

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   Angular CLI
*   The Report Generator Backend running on `https://localhost:7232`

### Running the Application

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Start the Server**:
    ```bash
    npm start
    ```

3.  **Access the UI**:
    Open your browser and navigate to `http://localhost:4200`.

## 🔄 Architecture Flow

1.  **Submission**: User submits a form ➡️ `ReportService` POSTs to API ➡️ Backend queues job.
2.  **Processing**: Backend processes job ➡️ Updates Database ➡️ SignalR Hub broadcasts `ReceiveUpdate`.
3.  **Reception**: `SignalRService` receives message ➡️ Updates `jobUpdate` Signal.
4.  **Reaction**: `ReportListComponent` effects trigger ➡️ UI updates specific row instantly.
5.  **Safety Net**: Polling interval checks for any missed syncs or deletions.
