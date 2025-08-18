# Student Management System - Frontend

React frontend application for the Student Management System.

## Features

- **Authentication**: Login system for admin users
- **Student Management**: CRUD operations for student records
- **Classroom Management**: Create and view classrooms
- **Course Management**: Create and view courses
- **Grade Management**: Assign and manage student grades
- **Reports**: View system statistics and summaries
- **Responsive Design**: Built with Tailwind CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:8080

## Installation

1. Navigate to the frontend directory:
```bash
cd sinhvien-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will run on http://localhost:3000

## Project Structure

```
src/
├── components/
│   ├── Login.js           # Login page
│   ├── Dashboard.js       # Main dashboard
│   ├── StudentManagement.js
│   ├── ClassroomManagement.js
│   ├── CourseManagement.js
│   ├── GradeManagement.js
│   ├── Report.js
│   ├── Layout.js          # Main layout with navigation
│   └── PrivateRoute.js    # Protected route component
├── services/
│   └── api.js            # API service configuration
├── App.js                # Main app component with routing
├── index.js              # Entry point
└── index.css             # Global styles with Tailwind

```

## Available Scripts

- `npm start`: Run the app in development mode
- `npm build`: Build the app for production
- `npm test`: Run tests

## API Endpoints

The frontend connects to the following backend endpoints:

- `POST /api/login` - Authentication
- `GET/POST/PUT/DELETE /api/students` - Student management
- `GET/POST /api/classes` - Classroom management
- `GET/POST /api/courses` - Course management
- `GET/POST /api/grades` - Grade management
- `GET /api/reports/summary` - Report data

## Technologies Used

- React 18
- React Router v6
- Axios for API calls
- Tailwind CSS for styling

## Default Login Credentials

- Username: admin
- Password: admin123

## Notes

- Ensure the backend Spring Boot application is running before starting the frontend
- The proxy configuration in package.json forwards API requests to http://localhost:8080
- CORS is enabled on the backend for cross-origin requests