# Project Management App - Backend

The backend of the Project Management App is a robust RESTful API built with Node.js and Express. It handles data persistence, authentication, business logic, and real-time communication for the frontend client.

## 🚀 Features

### **API Services**
*   **Authentication**:
    *   **JWT Strategies**: Secure stateless authentication using JSON Web Tokens.
    *   **Google OAuth 2.0**: Integration with Passport.js for Google Sign-In.
    *   **Password Hashing**: Secure password storage using `bcryptjs`.

*   **Project Management**:
    *   **CRUD Operations**: Full control over project creation, updates, and deletion.
    *   **Team Membership**: Logic to handle adding members and assigning roles.

*   **Ticket Management**:
    *   **Task Handling**: Create, update (status, priority, description), and delete tickets.
    *   **File Attachments**: Support for image and file uploads using `multer`.
    *   **Comments**: System for adding and retrieving comments on tickets.

*   **Page Management**:
    *   **Wiki/Docs**: Dedicated endpoints for creating and managing project text pages.

### **Real-time Communication**
*   **Socket.IO**: Implements a websocket server to push instant updates to clients.
    *   **Rooms**: Uses project IDs as rooms to broadcast updates only to relevant users.
    *   **Events**: Emits `ticketCreated`, `ticketUpdated`, `ticketDeleted` for live synchronization.

### **Database**
*   **MongoDB & Mongoose**: Uses MongoDB as the NoSQL database with Mongoose schemas for structured data modeling:
    *   `User`: Profiles and auth credentials.
    *   `Project`: Project metadata and member references.
    *   `Ticket`: Task details, status, priority, and assignments.
    *   `Page`: Project documentation content.
    *   `Comment`: User discussions on tickets.

## 🛠️ Tech Stack & Modules

*   **Node.js**: JavaScript runtime environment.
*   **Express**: Fast, unopinionated web framework for Node.js.
*   **MongoDB**: NoSQL database for flexible data storage.
*   **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
*   **Socket.io**: Real-time event-based communication library.
*   **Passport.js**: Authentication middleware for Node.js.
*   **JSONWebToken (JWT)**: Standard for securely representing claims between parties.
*   **BcryptJS**: Library to help hash passwords.
*   **Multer**: Middleware for handling `multipart/form-data` (file uploads).
*   **Dotenv**: Zero-dependency module that loads environment variables.
*   **Cors**: Middleware to enable Cross-Origin Resource Sharing.

## 📦 Installation & Setup

1.  **Navigate to the server directory**:
    ```bash
    cd server
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env` file in the `server` directory with the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    CLIENT_URL=http://localhost:5173
    ```

4.  **Run Server**:
    ```bash
    # Run with Nodemon (auto-restart)
    nodemon server.js
    
    # Or standard run
    node server.js
    ```
    The server will start on port `5000`.

## 📂 Project Structure

*   `controllers/`: Logic for handling API requests.
*   `models/`: Mongoose data schemas.
*   `routes/`: API route definitions.
*   `config/`: Database and Passport configurations.
*   `middleware/`: Auth protection and error handling middlewares.
*   `uploads/`: Directory for storing uploaded files.
