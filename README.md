# Authentication System

A modern authentication system built with React, Node.js, and Firebase, featuring email verification and a beautiful UI using Tailwind CSS.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)

## Features
- User Registration with Email Verification
- User Login with JWT Authentication
- Password Reset Functionality
- Modern and Responsive UI
- Protected Routes
- Toast Notifications
- Mobile-friendly Design

## Tech Stack

### Frontend
- **React** (v18.2.0) - JavaScript library for building user interfaces
- **React Router DOM** (v6.x) - Routing library for React
- **Tailwind CSS** (v3.x) - Utility-first CSS framework
- **React Toastify** (v9.x) - Toast notifications
- **Axios** (v1.x) - HTTP client for API requests
- **Firebase** (v9.x) - For email verification

### Backend
- **Node.js** (v16+) - JavaScript runtime
- **Express** (v4.x) - Web framework for Node.js
- **MongoDB** (v6.x) - NoSQL database
- **Mongoose** (v7.x) - MongoDB object modeling
- **JWT** (jsonwebtoken v9.x) - Authentication tokens
- **Bcrypt** (v5.x) - Password hashing
- **Cors** - Cross-origin resource sharing
- **Dotenv** - Environment variable management

## Project Structure

### Frontend Structure
```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── Dashboard.jsx
│   │   └── PrivateRoute.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── App.js
│   └── index.js
├── .env
├── .gitignore
├── package.json
└── tailwind.config.js
```

### Backend Structure
```
backend/
├── controllers/
│   └── authController.js
├── models/
│   └── User.js
├── routes/
│   └── authRoutes.js
├── middleware/
│   └── auth.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Installation

### Frontend Setup
```bash
cd frontend
npm install
```

### Backend Setup
```bash
cd backend
npm install
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_firebase_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Start Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

### Start Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register User
- **POST** `/api/auth/register`
- **Body**: `{ email, password }`
- **Response**: `{ message, user, token }`

#### Login User
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ user, token }`

#### Verify Email
- **POST** `/api/auth/verify-email`
- **Body**: `{ token }`
- **Response**: `{ message }`

#### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ email }`
- **Response**: `{ message }`

## Security Features
- Password Hashing with Bcrypt
- JWT Authentication
- Protected Routes
- Email Verification
- Environment Variable Protection
- CORS Configuration

## Error Handling
The application includes comprehensive error handling for:
- Invalid Credentials
- Network Errors
- Server Errors
- Validation Errors
- Authentication Errors

## Best Practices Implemented
1. **Code Organization**
   - Modular Component Structure
   - Separation of Concerns
   - Context API for State Management

2. **Security**
   - Environment Variables
   - Protected Routes
   - Input Validation
   - Secure Password Storage

3. **Performance**
   - Lazy Loading
   - Efficient State Management
   - Optimized Build Configuration

4. **UI/UX**
   - Responsive Design
   - Loading States
   - Error Feedback
   - Toast Notifications
   - Mobile-First Approach

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details
