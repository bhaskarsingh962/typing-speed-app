# Typing Speed Test App

A full-stack web application for testing and improving typing speed and accuracy. Users can practice typing with various difficulty levels, track their progress, view leaderboards, and manage their typing statistics.

## 🚀 Features

- **Typing Tests**: Practice typing with randomly selected texts across different difficulty levels (Easy, Medium, Hard)
- **Real-time Statistics**: Track WPM (Words Per Minute), accuracy, and error count in real-time
- **User Authentication**: Secure registration and login system with JWT authentication
- **Progress Tracking**: Save and view your typing test results and history
- **Leaderboard**: Compete with other users and see top performers
- **User Profile**: View your personal statistics and best scores
- **Text Management**: Add custom texts for typing practice (for authenticated users)
- **Password Reset**: Forgot password functionality with secure token-based reset

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Styling framework
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **nodemailer** - Email sending service
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Typing-speed-App
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=10000
MONGO_URL=mongodb://localhost:27017/
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5181
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
```

**Note**: For production deployment (e.g., Render), update `MONGO_URL` with your MongoDB Atlas connection string or your production database URL.

**Email Configuration (nodemailer):**
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Gmail App Password (not your regular password). To generate:
  1. Go to Google Account → Security → 2-Step Verification (enable if not enabled)
  2. Go to App Passwords → Generate a new app password for "Mail"
  3. Use the 16-character password generated

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `client` directory (optional, for custom backend URL):
```env
VITE_BACKEND_URL=http://localhost:10000
```

## 🚀 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd backend
npm run dev
```
The backend server will run on `http://localhost:10000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
The frontend will run on `http://localhost:5181`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Backend (Production)
```bash
cd backend
npm start
```

## 📁 Project Structure

```
Typing-speed-App/
├── backend/
│   ├── controller/          # Request handlers
│   │   ├── resultController.js
│   │   ├── textController.js
│   │   └── userController.js
│   ├── database/
│   │   └── index.js         # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js # JWT authentication
│   ├── models/              # Mongoose schemas
│   │   ├── resultModel.js
│   │   ├── textmodel.js
│   │   └── usermodel.js
│   ├── routes/              # API routes
│   │   ├── resultRoutes.js
│   │   ├── textRoutes.js
│   │   └── userRoutes.js
│   ├── Utility/
│   │   └── emailUitility.js  # Email utility (nodemailer)
│   ├── server.js            # Express server setup
│   └── package.json
│
└── client/
    ├── src/
    │   ├── Components/      # Reusable components
    │   │   ├── Button.jsx
    │   │   ├── Footer.jsx
    │   │   ├── NavBar.jsx
    │   │   ├── Protected.jsx
    │   │   └── TypingTest.jsx
    │   ├── Context/
    │   │   └── AuthContext.jsx # Authentication context
    │   ├── customHooks/
    │   │   └── useTyping.js  # Typing test logic
    │   ├── Pages/           # Page components
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── Verify.jsx
    │   │   ├── Profile.jsx
    │   │   ├── LeaderBoard.jsx
    │   │   ├── Texts.jsx
    │   │   ├── AddText.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   └── ResetPassword.jsx
    │   ├── App.jsx          # Main app component
    │   └── main.jsx         # Entry point
    ├── vite.config.js
    └── package.json
```

## 🔌 API Endpoints

### User Routes (`/api/users`)
- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile (protected)
- `POST /verify-email` - Verify email (auto-verified, no OTP required)
- `POST /forget` - Request password reset
- `PUT /reset/:token` - Reset password with token

### Text Routes (`/api/texts`)
- `GET /random` - Get random text for typing test
- `GET /` - Get all texts (with optional difficulty filter)
- `GET /:id` - Get text by ID
- `POST /` - Add new text (protected)
- `DELETE /:id` - Delete text (protected)

### Result Routes (`/api/results`)
- `POST /` - Save typing test result (protected)
- `GET /` - Get user's typing results (protected)
- `GET /leaderboard` - Get leaderboard (with optional difficulty filter)
- `GET /rank` - Get user's rank (protected)

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication. After successful login or registration, a token is stored in the client's context. Protected routes require a valid JWT token in the Authorization header.

**Note**: The application uses nodemailer for email functionality. For development, configure Gmail SMTP with app passwords. For production deployment, you may need to use a dedicated email service (SendGrid, Mailgun, etc.) or disable email features if not available.

## 🌐 Deployment

### Backend Deployment (Render)

1. Connect your repository to Render
2. Create a new Web Service
3. Set the following:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**: Add all variables from your `.env` file

### Frontend Deployment

1. Build the frontend:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)
3. Update `VITE_BACKEND_URL` to point to your deployed backend URL

## 📝 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 10000)
- `MONGO_URL` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS and redirects
- `EMAIL_USER` - Gmail address for sending emails (nodemailer)
- `EMAIL_PASS` - Gmail App Password (16-character app-specific password)

### Frontend (.env)
- `VITE_BACKEND_URL` - Backend API URL (default: http://localhost:5008)

## 🎯 Features in Detail

### Typing Test
- Real-time WPM calculation
- Accuracy percentage tracking
- Error count and highlighting
- Timer-based tests
- Automatic result saving

### Leaderboard
- Global leaderboard showing top 10 users
- Filter by difficulty level (Easy, Medium, Hard)
- Shows best WPM per user
- Displays user names and scores

### User Profile
- View personal typing statistics
- Track best WPM ever achieved
- View all past test results
- See your current rank

## 📧 Email Functionality (Nodemailer)

The application uses **nodemailer** for sending transactional emails. Currently implemented for:

### Features
1. **Email Verification OTP**: Sends a 6-digit OTP code to users upon registration for email verification
2. **Password Reset**: Sends password reset links to users when they request a password reset

### Implementation Details

**Email Utility (`backend/Utility/emailUitility.js`):**
- Uses nodemailer with Gmail SMTP service
- Configured with `EMAIL_USER` and `EMAIL_PASS` environment variables
- Sends plain text emails with subject and message content

**Configuration:**
- Service: Gmail
- Port: Uses default SMTP ports (587 for TLS, 465 for SSL)
- Authentication: Uses Gmail App Passwords (not regular passwords)

**Usage in Controllers:**
- `userController.js`: 
  - Registration: Sends OTP for email verification
  - Password Reset: Sends reset token link

**Production Considerations:**
- For production, consider using dedicated email services (SendGrid, Mailgun, AWS SES) for better deliverability
- Gmail has sending limits (~500 emails/day for free accounts)
- App passwords are required for Gmail (2FA must be enabled)

### Changes Made
1. **Initial Setup**: Integrated nodemailer package for email functionality
2. **Gmail Configuration**: Set up Gmail SMTP transporter with environment variables
3. **Email Templates**: Created email messages for OTP and password reset
4. **Error Handling**: Wrapped email sending in try-catch blocks (errors logged but don't break registration flow)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Created with ❤️ for improving typing skills.

---

**Happy Typing! 🚀**

