# 📊 Project Management Application

A full-stack, real-time Project Management tool designed to help teams organize tasks, visualize progress, and collaborate effectively. Built with the **MERN Stack** (MongoDB, Express, React, Node.js).

## 🌟 Key Highlights

*   **Real-time Collaboration**: Changes to boards and tickets are instantly updated for all users via WebSockets.
*   **Tabs & Views**: Switch seamlessly between **Kanban Board**, **List View**, **Timeline (Gantt)**, and **analytics Summary**.
*   **Project Wiki**: Integrated **Pages** feature for project documentation.
*   **Visualizations**: Rich charts and graphs to track project health and team performance.
*   **Secure**: Robust authentication with Google OAuth support and role-based access control.

## 🏗️ Architecture Overview

The application is divided into two main parts:

### 1. **[Frontend (Client)](./client/README.md)**
   *   Built with **React 19** and **Vite**.
   *   Features a responsive UI with **Tailwind CSS**.
   *   Handles complex state with **Context API** and **Socket.io-client**.
   *   **See the `client/README.md` for detailed features and setup.**

### 2. **[Backend (Server)](./server/README.md)**
   *   Built with **Node.js** and **Express**.
   *   Connects to **MongoDB** for data storage.
   *   Manages API endpoints and real-time **Socket.io** connections.
   *   **See the `server/README.md` for detailed API documentation and setup.**

## 🚀 Getting Started

### Prerequisites
*   **Node.js** (v14 or higher)
*   **npm** or **yarn**
*   **MongoDB** (Local instance or Atlas URI)

### Quick Start

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Setup Backend**:
    *   Go to server folder: `cd server`
    *   Install deps: `npm install`
    *   Configure `.env` (see server README)
    *   Start server: `npm start` (or `nodemon server.js`)

3.  **Setup Frontend**:
    *   Open a new terminal.
    *   Go to client folder: `cd client`
    *   Install deps: `npm install`
    *   Start client: `npm run dev`

4.  **Access the App**:
    *   Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contribution
Feel free to fork this project and submit pull requests. Ensure you update the documentation for any new features added.

---
*Developed for Project Management Efficiency.*
