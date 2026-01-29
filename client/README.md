# Project Management App - Frontend

The frontend of the Project Management App is a dynamic, responsive Single Page Application (SPA) built to provide a seamless user experience for managing projects, tasks, and teams. It interacts with the backend API to provide real-time updates and data persistence.

## 🚀 Features

### **Authentication & Security**
*   **User Registration & Login**: Secure signup and login forms with JWT-based authentication.
*   **Google OAuth Integration**: Option to sign in quickly using Google accounts.
*   **Protected Routes**: Ensures only authenticated users can access the dashboard and project details.

### **Dashboard**
*   **Project Overview**: View a list of all personal and shared projects.
*   **Create Project**: Simple modal to create new projects with a title and description.
*   **Real-time Updates**: Instant reflection of new projects or changes.

### **Project Details View**
A comprehensive hub for managing a specific project, featuring a specialized tabbed interface:

1.  **Summary Tab**:
    *   **Visual Analytics**: Interactive Pie Charts (Status distribution) and Bar Charts (Priority breakdown) using `recharts`.
    *   **Key Stats**: Quick view of total tickets, team size, and completion rates.
    *   **Recent Activity**: A feed of the latest updates on tickets.

2.  **Board Tab (Kanban)**:
    *   **Drag & Drop**: Intuitive Drag-and-Drop interface using `@dnd-kit` to move tickets between columns (To Do, In Progress, Done).
    *   **Ticket Management**: Create, edit, and delete tickets directly from the board.
    *   **Real-time Sync**: Board updates instantly for all team members via `socket.io`.

3.  **List Tab**:
    *   **Structured View**: A tabular representation of all tickets for sorting and quick scanning.
    *   **Detailed Columns**: Displays Title, Status, Priority, Assignee, and Due Date.

4.  **Timeline Tab (Gantt Chart)**:
    *   **Visual Roadmap**: Gantt chart visualization of task durations and schedules over a 2-week window.
    *   **Interactive**: Click on task bars to view and edit details.
    *   **Date Management**: Visualizes Start and Due dates for effective planning.

5.  **Pages Tab**:
    *   **Documentation Hub**: Create and manage project-specific documents or wiki pages.
    *   **Editor**: Simple text editor for writing content.
    *   **CRUD Operations**: Full Create, Read, Update, Delete capabilities for pages.

### **Collaboration**
*   **Team Management**: Invite users to projects via email/username.
*   **Role Management**: Assign roles (Admin, Member, Viewer) to control permissions.
*   **Comments**: multiple users can comment on a specific ticket.

## 🛠️ Tech Stack & Modules

The frontend is built using the **MERN** stack (React focus) and modern tooling:

*   **React (v19)**: Core interface library.
*   **Vite**: Next-generation frontend tooling for fast development and building.
*   **Tailwind CSS (v4)**: Utility-first CSS framework for rapid and responsive UI design.
*   **React Router DOM (v7)**: library for routing and navigation.
*   **Axios**: Promise-based HTTP client for making API requests.
*   **Socket.io-client**: Real-time bidirectional event-based communication.
*   **@dnd-kit**: Lightweight, performant, accessible drag-and-drop toolkit for React.
*   **Recharts**: Redefined chart library built with React and D3.
*   **Date-fns**: Modern JavaScript date utility library.

## 📦 Installation & Setup

1.  **Navigate to the client directory**:
    ```bash
    cd client
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Ensure you have the backend running on `http://localhost:5000` (default).

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 📂 Project Structure

*   `src/components/`: Reusable UI components (Auth, Kanban, Project, Layout).
*   `src/context/`: React Context providers for global state (Auth, Projects).
*   `src/pages/`: Main page views (Dashboard, Login, ProjectDetails).
*   `src/App.jsx`: Main application entry point with routing configuration.
