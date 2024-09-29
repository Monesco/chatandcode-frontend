# Chat&Code
## Overview
**Chat&Code** is a full-stack web application built with React on the frontend and Express with SQLite on the backend. It provides a user-friendly interface to connect to LM Studio and interact with LLM models where users can create an account, log in, and communicate via chat. The app uses Chakra UI for styling, ensuring a consistent and modern design. There is a database where chat history is stored and its loaded specifically for each user on demand. The passwords are encripted. This platform is great for deployament in a home enviroment or a small business where one LM Server can serve multiple users holding their chat history and saving on resources.

**Author: Matheus Siqueira**

- Project Structure

### Backend
```
chatandcode-backend/
├── config/
│   └── database.js                # Database configuration and initialization
├── controllers/
│   ├── authController.js          # Authentication controller for signup and login
│   └── chatController.js          # Controller for handling chat-related operations
├── middleware/
│   └── authenticateToken.js       # Middleware for JWT authentication
├── routes/
│   ├── auth.js                    # Routes for user authentication (signup and login)
│   └── chat.js                    # Routes for chat operations (create, delete, fetch messages)
├── .env                            # Environment variables for the backend
├── package.json                    # Backend dependencies and scripts
├── server.js                       # Main server entry point
└── users.db                        # SQLite database file
```

### Frontend
```
chatandcode-frontend/
├── public/
│   └── index.html                  # Frontend root HTML file
├── src/
│   ├── components/
│   │   ├── Chat.js                 # Main chat interface component
│   │   ├── ChatHeader.js           # Chat header component
│   │   ├── ChatInput.js            # Chat input field component
│   │   ├── Login.js                # Login form component
│   │   ├── Message.js              # Chat message display component
│   │   ├── Sidebar.js              # Sidebar component for chat navigation
│   │   └── SignUp.js               # Sign-up form component
│   ├── images/                     # Image assets for the frontend
│   ├── App.js                      # Main React application component
│   ├── api.js                      # API utilities for frontend-backend communication
│   ├── index.css                   # Global CSS styles for the app
│   ├── index.js                    # React application entry point
│   ├── reportWebVitals.js          # For measuring performance metrics
│   ├── setupTests.js               # Configuration for testing
│   └── utils.js                    # Utility functions used throughout the app
├── .env                            # Environment variables for the frontend
├── package.json                    # Frontend dependencies and scripts
└── README.md                       # Project documentation
```

# Getting Started
## Prerequisites
- Node.js - Ensure you have Node.js installed. Download Node.js
- npm - Node Package Manager, which comes with Node.js.

# Backend Setup:

- Navigate to the chatandcode-backend directory:

```
cd chatandcode-backend
```

- Install backend dependencies:

```
npm install
```

- Start the backend server:

```
npm start
```

### The backend server will run on http://localhost:5000.

# Frontend Setup:

- Navigate to the chatandcode-frontend directory:

```
cd chatandcode-frontend
```

- Install frontend dependencies and start:

```
npm install
```
```
npm start
```
### The frontend application will run on http://localhost:3000.

# LM Studio Server Setup:
### Visit LM Studio web doc to learn about running their server

- **Visit:** https://lmstudio.ai/docs/basics/server


# Features:

- User Authentication: Users can sign up, log in, and maintain sessions with JWT tokens.
- Real-time Chat Interface: Users can create new chats, send and receive messages in real-time.
- Responsive UI: The app is designed to work seamlessly across different screen sizes.
- Modern Design: Styled with Chakra UI, providing a sleek and consistent look and feel.

# Dependencies:
## Backend:

- Express - A minimal and flexible Node.js web application framework.
- SQLite3 - A lightweight, disk-based database used for storing user and chat data.
- bcrypt - For hashing user passwords.
- jsonwebtoken - For generating and verifying JWT tokens.
- cors - Middleware to enable CORS for cross-origin requests.

## Frontend:

- React - A JavaScript library for building user interfaces.
- Chakra UI - A modern UI framework for React with easy-to-use components.
- Axios - Promise-based HTTP client for making API requests.
- React Router - For handling navigation within the app.

## License
### This project is licensed under the MIT License. See the LICENSE file for more information.