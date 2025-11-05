# Typing Speed Test App - Important Interview Questions & Answers

## 1. **What is this project about? Explain the architecture and tech stack.**

**Answer:**
This is a full-stack typing speed test application that allows users to practice typing, track their performance, and compete on leaderboards. 

**Architecture:**
- **Frontend**: React 19 with Vite, React Router for routing, Tailwind CSS for styling
- **Backend**: Node.js with Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Context API for authentication state

The application follows MVC (Model-View-Controller) architecture on the backend with separate routes, controllers, and models. The frontend uses component-based architecture with custom hooks for reusable logic.

---

## 2. **How do you calculate WPM (Words Per Minute) and Accuracy? Explain the algorithm.**

**Answer:**
WPM and accuracy are calculated in the `useTyping` custom hook:

**WPM Calculation:**
```javascript
const correctChars = userInput
  .split("")
  .filter((c, i) => c === sourceText.content[i]).length;

const timeElapsed = 60 - timer;
const minutes = timeElapsed > 0 ? timeElapsed / 60 : 1;
const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
```

**Logic:**
- Count correct characters by comparing user input with source text character-by-character
- Standard WPM formula: `(correct characters / 5) / minutes`
- Dividing by 5 because a "word" is typically considered 5 characters
- Only counts correctly typed characters, not incorrect ones

**Accuracy Calculation:**
```javascript
const accuracy = userInput.length > 0 
  ? (correctChars / userInput.length) * 100 
  : 0;
```
- Accuracy = (Correct characters / Total characters typed) × 100
- This gives a percentage of correctly typed characters

**Error Count:**
```javascript
const errorCount = userInput.length - correctChars;
```

---

## 3. **Explain your custom hook `useTyping`. Why did you create it and what problems does it solve?**

**Answer:**
The `useTyping` hook encapsulates all typing test logic, making it reusable and separating concerns.

**Key Features:**
- **State Management**: Manages timer, user input, test status, and results
- **Real-time Updates**: Calculates stats as user types
- **Auto-save**: Optionally saves results to backend when user is authenticated
- **Timer Logic**: Countdown from 60 seconds, auto-ends test when timer reaches 0
- **Input Handling**: Starts test on first keystroke, ends when text is complete

**Why Custom Hook:**
- **Reusability**: Can be used in multiple components (Home, Profile, etc.)
- **Separation of Concerns**: Business logic separated from UI
- **Testability**: Easier to test logic independently
- **Clean Code**: Keeps components focused on rendering

**Technical Details:**
- Uses `useRef` to store latest state values for callbacks (prevents stale closures)
- Uses `useCallback` for memoized functions to prevent unnecessary re-renders
- Manages side effects with `useEffect` for timer and cleanup

---

## 4. **How does authentication work in your application? Explain JWT implementation.**

**Answer:**
Authentication uses JWT (JSON Web Tokens) with the following flow:

**Registration/Login Flow:**
1. User registers/logs in → Backend validates credentials
2. Backend creates JWT token with user ID: `jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" })`
3. Token sent to frontend → Stored in localStorage
4. Token added to axios default headers: `Authorization: Bearer <token>`

**Protected Routes:**
- `authMiddleware.js` intercepts requests
- Extracts token from `Authorization` header
- Verifies token using `jwt.verify()`
- Fetches user from database and attaches to `req.user`
- If invalid/expired → returns 401 Unauthorized

**Frontend Implementation:**
- `AuthContext` manages user state globally
- Checks token on app load via `checkUserLoggedIn()`
- Automatically adds token to all axios requests
- `Protected` component wraps routes requiring authentication

**Security Features:**
- Passwords hashed with bcrypt (salt rounds: 10)
- Token expiration (1 day)
- Token verification on every protected request
- Invalid tokens automatically cleared from localStorage

---

## 5. **Explain the leaderboard functionality. How does the MongoDB aggregation pipeline work?**

**Answer:**
The leaderboard shows top 10 users based on their best WPM scores.

**MongoDB Aggregation Pipeline:**
```javascript
[
  { $lookup: { from: 'texts', localField: 'text', foreignField: '_id', as: 'textDetails' } },
  { $unwind: '$textDetails' },
  { $match: { 'textDetails.difficulty': difficulty } }, // Optional filter
  { $sort: { wpm: -1 } },
  { $group: { 
      _id: "$user",
      maxWpm: { $first: "$wpm" },
      // Get best result per user
    }
  },
  { $sort: { maxWpm: -1 } },
  { $limit: 10 },
  { $lookup: { from: 'users', ... } }, // Join user details
  { $project: { ... } } // Shape final output
]
```

**Steps:**
1. **$lookup**: Join results with texts collection to get difficulty
2. **$unwind**: Flatten the joined array
3. **$match**: Filter by difficulty (if provided)
4. **$sort**: Sort by WPM descending
5. **$group**: Group by user, get their maximum WPM (best score)
6. **$sort**: Sort grouped results by maxWPM
7. **$limit**: Get top 10
8. **$lookup**: Join with users to get names
9. **$project**: Select only needed fields

**Why This Approach:**
- Efficient: Single database query instead of multiple
- Accurate: Gets best score per user, not just recent
- Scalable: Works with large datasets
- Flexible: Can filter by difficulty level

---

## 6. **How do you calculate user rank? Explain the algorithm.**

**Answer:**
User rank is calculated by finding how many users have a better WPM than the current user.

**Algorithm:**
```javascript
// 1. Get user's best WPM
const bestScore = await resultModel.findOne({user}).sort({wpm: -1});
const userWPM = bestScore.wpm;

// 2. Group all users by their max WPM
// 3. Count users with maxWpm > userWPM
const higherRanker = await resultModel.aggregate([
  { $group: { _id: "$user", maxwpm: {$max: '$wpm'} } },
  { $match: { maxwpm: {$gt: userWPM} } },
  { $count: 'higherRanker' }
]);

// 4. Rank = Count of higher users + 1
const rank = higherRanker.length > 0 ? higherRanker[0].higherRanker + 1 : 1;
```

**Logic:**
- Find user's best WPM score
- Use aggregation to group all users by their maximum WPM
- Count how many users have maxWpm greater than user's WPM
- Rank = number of better users + 1 (if user is best, rank = 1)

**Time Complexity:** O(n) where n is number of results
**Optimization:** Could use indexed queries for better performance with large datasets

---

## 7. **How do you handle state management in React? Why Context API instead of Redux?**

**Answer:**
State management uses React Context API for authentication state.

**Implementation:**
- `AuthContext` provides user state and auth functions globally
- `AuthProvider` wraps the app, manages user state
- Components consume via `useContext(AuthContext)`

**Why Context API:**
- **Simple Use Case**: Only authentication state needed globally
- **No External Dependencies**: Built into React
- **Lightweight**: No need for Redux boilerplate
- **Sufficient**: Auth state is simple (user object, login/logout functions)

**Local State Management:**
- Component-level state with `useState` for forms, UI state
- Custom hooks (`useTyping`) for complex component logic
- Props for parent-child communication

**When to use Redux:**
- Would use Redux if we had complex global state (multiple contexts, time-travel debugging, middleware needs)
- For this project, Context API is the right choice

---

## 8. **Explain the password reset flow. How does token-based reset work?**

**Answer:**
Password reset uses secure token-based mechanism (email sending disabled for deployment).

**Flow:**
1. **Request Reset** (`POST /api/users/forget`):
   - User provides email
   - Generate cryptographically secure random token: `crypto.randomBytes(32).toString('hex')`
   - Hash token with SHA-256: `crypto.createHash('sha256').update(resetToken).digest('hex')`
   - Store hashed token and expiration (15 minutes) in database
   - Return reset URL in response (for deployment without email)

2. **Reset Password** (`PUT /api/users/reset/:token`):
   - Hash the provided token
   - Find user with matching hashed token and valid expiration
   - If found, update password (bcrypt hashes it automatically via pre-save hook)
   - Clear reset token and expiration
   - Return success

**Security Features:**
- Tokens are hashed (not stored in plain text)
- Time-limited (15 minutes expiration)
- One-time use (token cleared after use)
- Cryptographically secure random generation

---

## 9. **How do you handle errors in your application? What's your error handling strategy?**

**Answer:**
Multi-layered error handling approach:

**Backend Error Handling:**
```javascript
try {
  // Business logic
} catch (error) {
  console.error(error);
  return res.status(500).json({ 
    success: false, 
    message: "Server Error" 
  });
}
```

**Validation:**
- Input validation in controllers (required fields, email format, password length)
- Returns 400 with descriptive error messages
- Mongoose schema validation for data integrity

**Frontend Error Handling:**
```javascript
try {
  const response = await axios.post('/api/users/login', { email, password });
  // Success handling
} catch (err) {
  setError(err.response?.data?.message || 'An error occurred during login.');
}
```

**Error Display:**
- User-friendly error messages displayed in UI
- Network errors handled gracefully
- Invalid tokens automatically cleared and user logged out

**Improvements Needed:**
- Centralized error logging service
- More specific error codes
- Client-side validation before API calls
- Error boundaries for React component errors

---

## 10. **What is the database schema design? Explain the relationships between models.**

**Answer:**
Three main models with relationships:

**User Model:**
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed, minLength: 8),
  isEmailVerified: Boolean (default: true),
  highestWpmEver: Number,
  charStats: Map, // Character-level statistics
  // Timestamps: createdAt, updatedAt
}
```

**Text Model:**
```javascript
{
  name: String,
  content: String,
  difficulty: String (easy/medium/hard),
  submittedBy: ObjectId (ref: User)
}
```

**Result Model:**
```javascript
{
  wpm: Number (required),
  accuracy: Number (required),
  errorCount: Number,
  user: ObjectId (ref: User, required),
  text: ObjectId (ref: Text, required),
  // Timestamps
}
```

**Relationships:**
- **User → Results**: One-to-Many (user has many results)
- **Text → Results**: One-to-Many (text can have many results)
- **User → Texts**: One-to-Many (user can submit many texts)

**Indexes:**
- Email unique index on User
- TTL index on emailVerificationOTPExpires

**Populate Usage:**
- Results populate user and text references for leaderboard
- Efficient querying with Mongoose `.populate()`

---

## 11. **How do you optimize performance in this application?**

**Answer:**
Performance optimizations implemented:

**Frontend:**
- **Custom Hooks with useCallback**: Memoized functions prevent unnecessary re-renders
- **useRef for Latest State**: Avoids stale closures in callbacks
- **Conditional Rendering**: Only render components when needed
- **Vite Build Tool**: Fast HMR and optimized production builds
- **Lazy Loading**: Could implement React.lazy for code splitting

**Backend:**
- **MongoDB Aggregation**: Single query for complex operations (leaderboard)
- **Indexes**: Unique email index, TTL index for OTP
- **Selective Field Projection**: `.select('-password')` to exclude sensitive data
- **Efficient Queries**: `.sort().limit()` for pagination-ready queries

**Database:**
- **Aggregation Pipeline**: Optimized leaderboard query
- **Population**: Efficiently joins related documents
- **Indexing**: Email uniqueness, TTL for auto-cleanup

**Future Optimizations:**
- Redis caching for leaderboard (already has ioredis dependency)
- Pagination for results list
- Debouncing for API calls
- Image optimization
- CDN for static assets

---

## 12. **Explain the real-time typing test feature. How does it update in real-time?**

**Answer:**
Real-time updates use React state and effects:

**Real-time Updates:**
1. **Timer**: `useEffect` with `setInterval` updates timer every second
   ```javascript
   useEffect(() => {
     let interval;
     if (isTestActive && timer > 0) {
       interval = setInterval(() => {
         setTimer(prevTimer => prevTimer - 1);
       }, 1000);
     }
     return () => clearInterval(interval);
   }, [isTestActive, timer]);
   ```

2. **Input Handling**: `onChange` handler updates `userInput` state immediately
3. **Character Highlighting**: Calculates correct/incorrect characters on each render
4. **Stats Display**: WPM and accuracy calculated in real-time (shown after test ends)

**Visual Feedback:**
- Characters color-coded: correct (green), incorrect (red), pending (gray)
- Text display scrolls automatically as user types
- Timer counts down visibly
- Stats update when test completes

**Performance:**
- State updates are synchronous and fast
- No debouncing needed (typing is real-time)
- Character comparison is O(n) where n is input length

---

## 13. **How do you handle password security? Explain bcrypt implementation.**

**Answer:**
Password security uses bcrypt hashing:

**Implementation:**
```javascript
// In userModel.js - pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

**Security Features:**
- **Hashing**: Passwords never stored in plain text
- **Salt Rounds**: 10 rounds (good balance of security and performance)
- **Conditional Hashing**: Only hashes when password is modified (not on every save)
- **Verification**: `matchPassword()` method compares plain text with hash
  ```javascript
  userSchema.methods.matchPassword = async function (EnteredPassword) {
    return await bcrypt.compare(EnteredPassword, this.password);
  }
  ```

**Why bcrypt:**
- Industry standard for password hashing
- Adaptive hashing (can increase rounds as needed)
- Resistant to rainbow table attacks (salting)
- Slow by design (prevents brute force)

**Additional Security:**
- Minimum password length: 8 characters
- Email validation before registration
- JWT tokens for session management (not storing sessions)

---

## 14. **What challenges did you face while building this project? How did you solve them?**

**Answer:**
Key challenges and solutions:

**1. Stale Closures in useCallback:**
- **Problem**: Timer callback had stale state values
- **Solution**: Used `useRef` to store latest state values, accessed via `stateRef.current`

**2. Real-time Character Highlighting:**
- **Problem**: Needed to compare user input with source text character-by-character
- **Solution**: Created `getCharClass()` function that checks each character index and returns appropriate CSS class

**3. Leaderboard Aggregation:**
- **Problem**: Needed to get best score per user, not all scores
- **Solution**: Used MongoDB `$group` stage to group by user and get `$max` WPM

**4. Auto-verification for Deployment:**
- **Problem**: Email service (nodemailer) not available in production
- **Solution**: Modified registration to auto-verify users, removed OTP requirement, stubbed email utility

**5. State Management Across Components:**
- **Problem**: User state needed in multiple components
- **Solution**: Created AuthContext for global state management

**6. Password Reset Without Email:**
- **Problem**: Need password reset but no email service
- **Solution**: Return reset URL in API response instead of emailing it

---

## 15. **Explain the deployment process. How would you deploy this to Render?**

**Answer:**
Deployment process for Render:

**Backend Deployment:**
1. **Environment Setup:**
   - Connect GitHub repository
   - Create Web Service on Render
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`

2. **Environment Variables:**
   - `PORT`: Auto-assigned by Render
   - `MONGO_URL`: MongoDB Atlas connection string
   - `JWT_SECRET`: Strong random secret key
   - `FRONTEND_URL`: Frontend deployment URL

3. **Database:**
   - Use MongoDB Atlas (cloud) or Render's MongoDB service
   - Update `MONGO_URL` with connection string

**Frontend Deployment:**
1. **Build:**
   ```bash
   cd client
   npm run build
   ```
   Creates optimized `dist` folder

2. **Deploy:**
   - Deploy `dist` folder to Vercel/Netlify/Render Static Site
   - Set `VITE_BACKEND_URL` to backend URL

**CORS Configuration:**
- Backend CORS allows frontend origin
- Credentials: true for cookie support

**Key Considerations:**
- Email functionality disabled (no nodemailer in production)
- Auto-verification enabled
- Environment variables properly configured
- Database connection string secured

---

## 16. **How would you scale this application for 1 million users?**

**Answer:**
Scaling strategies:

**Database:**
- **Sharding**: Partition MongoDB by user ID or region
- **Indexing**: Add indexes on frequently queried fields (wpm, createdAt, user)
- **Read Replicas**: Use MongoDB replica sets for read-heavy operations
- **Caching**: Redis for leaderboard (already has ioredis dependency)

**Backend:**
- **Load Balancing**: Multiple server instances behind load balancer
- **Horizontal Scaling**: Stateless design (JWT) allows easy scaling
- **CDN**: Serve static assets via CDN
- **API Rate Limiting**: Prevent abuse
- **Database Connection Pooling**: Optimize MongoDB connections

**Frontend:**
- **Code Splitting**: React.lazy() for route-based splitting
- **Image Optimization**: Compress and serve via CDN
- **Caching**: Browser caching for static assets
- **Pagination**: Limit results per page

**Architecture:**
- **Microservices**: Separate services for auth, results, leaderboard
- **Message Queue**: For async operations (email sending, analytics)
- **Monitoring**: APM tools (New Relic, Datadog)
- **Caching Layer**: Redis for frequently accessed data

**Specific Optimizations:**
- Cache leaderboard results (update every 5 minutes)
- Batch result saves
- Background jobs for analytics
- Database query optimization

---

## 17. **What testing strategies would you implement for this application?**

**Answer:**
Comprehensive testing approach:

**Frontend Testing:**
- **Unit Tests** (Jest + React Testing Library):
  - Test `useTyping` hook logic
  - Test WPM/accuracy calculations
  - Test component rendering
- **Integration Tests**:
  - Test authentication flow
  - Test typing test completion
  - Test API integration
- **E2E Tests** (Cypress/Playwright):
  - Full user registration → login → typing test flow
  - Leaderboard functionality

**Backend Testing:**
- **Unit Tests** (Jest):
  - Test controllers with mocked models
  - Test authentication middleware
  - Test password hashing
- **Integration Tests**:
  - Test API endpoints with test database
  - Test database operations
  - Test JWT generation/verification
- **Load Testing** (Artillery/k6):
  - Test concurrent users
  - Test leaderboard query performance

**Test Coverage:**
- Critical paths: Authentication, WPM calculation, Result saving
- Edge cases: Empty input, timer expiration, invalid tokens
- Error handling: Network failures, invalid data

**Tools:**
- Jest for unit/integration tests
- React Testing Library for component tests
- Supertest for API testing
- Cypress for E2E tests

---

## 18. **Explain the difference between your implementation and a production-ready version. What would you improve?**

**Answer:**
Improvements for production:

**Security:**
- ✅ Implemented: Password hashing, JWT, input validation
- ⚠️ Missing: Rate limiting, HTTPS enforcement, security headers (Helmet.js), CSRF protection, input sanitization

**Error Handling:**
- ✅ Implemented: Try-catch blocks, error messages
- ⚠️ Missing: Centralized error logging (Winston), error tracking (Sentry), structured error responses

**Validation:**
- ✅ Implemented: Basic validation
- ⚠️ Missing: Joi/Yup schema validation, request sanitization, SQL injection prevention (though using NoSQL)

**Performance:**
- ✅ Implemented: Aggregation pipelines, indexes
- ⚠️ Missing: Redis caching, query optimization, pagination, compression

**Code Quality:**
- ⚠️ Missing: TypeScript for type safety, ESLint rules, Prettier, unit tests, code documentation

**Monitoring:**
- ⚠️ Missing: Logging service, APM, health checks, metrics collection

**Features:**
- ⚠️ Missing: Email notifications (disabled for deployment), password strength meter, social login, dark/light theme toggle

**Database:**
- ⚠️ Missing: Database migrations, backup strategy, connection retry logic

**DevOps:**
- ⚠️ Missing: CI/CD pipeline, automated testing, staging environment

---

## 19. **How does the Protected Route component work? Explain the implementation.**

**Answer:**
The `Protected` component ensures only authenticated users can access certain routes.

**Implementation:**
```javascript
const Protected = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null;

  return children;
};
```

**How it Works:**
1. Checks `user` and `loading` from AuthContext
2. If loading, shows loading state
3. If not loading and no user → redirects to `/login`
4. If user exists → renders children (protected content)

**Usage:**
```javascript
<Route path="/profile" element={
  <Protected>
    <Profile />
  </Protected>
} />
```

**Benefits:**
- Centralized authentication check
- Reusable across all protected routes
- Handles loading states
- Clean component structure

**Alternative Approaches:**
- Higher-order component (HOC)
- Custom `useRequireAuth` hook
- Route guards in React Router v6

---

## 20. **Explain the character-by-character comparison and highlighting feature.**

**Answer:**
Real-time character highlighting provides visual feedback during typing.

**Implementation:**
```javascript
const getCharClass = (char, index) => {
  if (index < userInput.length) {
    if (userInput[index] === char) {
      return 'text-green-400'; // Correct
    } else {
      return 'text-red-400'; // Incorrect
    }
  }
  return 'text-gray-400'; // Not typed yet
};
```

**Rendering:**
```javascript
{sourceText.split('').map((char, index) => (
  <span key={index} className={getCharClass(char, index)}>
    {char}
  </span>
))}
```

**Logic:**
1. Split source text into characters
2. For each character, check if user has typed that position
3. Compare user input character with source character at that index
4. Apply CSS class: green (correct), red (incorrect), gray (pending)

**Visual Feedback:**
- Immediate feedback as user types
- Helps identify mistakes in real-time
- Encourages accuracy

**Performance:**
- O(n) complexity where n is text length
- Efficient: single pass through characters
- React key prop ensures efficient re-renders

---

## 21. **What is the purpose of using useRef in the useTyping hook? Explain with example.**

**Answer:**
`useRef` solves the stale closure problem in callbacks.

**Problem Without useRef:**
```javascript
const endTest = useCallback(() => {
  // userInput, timer might be stale (old values)
  const wpm = calculateWPM(userInput, timer);
}, [userInput, timer]); // Would need all dependencies
```

**Solution With useRef:**
```javascript
const stateRef = useRef({ userInput, sourceText, timer, user, enableSave });
stateRef.current = { userInput, sourceText, timer, user, enableSave };

const endTest = useCallback(() => {
  const { userInput, sourceText, timer } = stateRef.current; // Always latest
  // Use latest values
}, []); // No dependencies needed
```

**Why This Works:**
- `useRef` persists across renders without causing re-renders
- `.current` always holds the latest value
- Callback doesn't need dependencies, preventing unnecessary recreations
- Avoids stale closures in async operations

**Benefits:**
- Stable callback reference (no re-creation)
- Always access latest state
- Better performance (fewer re-renders)
- Cleaner dependency arrays

---

## 22. **How would you implement real-time multiplayer typing races? (System Design Question)**

**Answer:**
System design for multiplayer typing races:

**Architecture:**
1. **WebSocket Server** (Socket.io):
   - Real-time bidirectional communication
   - Room-based architecture (one room = one race)
   - Events: join, start, progress, finish

2. **Race Flow:**
   - User creates/joins room → WebSocket connection
   - All users ready → Race starts (shared timer)
   - Users type → Progress updates sent to server
   - Server broadcasts progress to all clients
   - First to finish or timer ends → Race completes

3. **Data Structure:**
   ```javascript
   {
     roomId: String,
     participants: [{
       userId: ObjectId,
       progress: Number, // characters typed
       wpm: Number,
       finished: Boolean
     }],
     text: ObjectId,
     status: 'waiting' | 'active' | 'finished',
     startedAt: Date
   }
   ```

4. **Backend:**
   - Store race state in Redis (fast, in-memory)
   - Broadcast progress every 500ms (throttled)
   - Calculate rankings in real-time

5. **Frontend:**
   - WebSocket client receives updates
   - Update leaderboard UI in real-time
   - Show live progress bars

**Scaling:**
- Redis for race state (fast reads/writes)
- Load balanced WebSocket servers
- Message queue for race completion processing

---

## Key Takeaways for Interview:

1. **Architecture**: Full-stack MERN with JWT auth
2. **Algorithm**: WPM = (correct chars / 5) / minutes
3. **State Management**: Context API + Custom Hooks
4. **Database**: MongoDB with aggregation pipelines
5. **Security**: bcrypt, JWT, input validation
6. **Performance**: Aggregation, indexing, memoization
7. **Scalability**: Redis caching, horizontal scaling
8. **Best Practices**: Separation of concerns, reusable components

---

## 23. **Explain the nodemailer implementation in this application. How is it configured and used?**

**Answer:**
Nodemailer is used for sending transactional emails (email verification OTP and password reset links).

**Implementation:**

1. **Email Utility (`backend/Utility/emailUitility.js`):**
```javascript
import nodemailer from 'nodemailer';

const sendEmail = async(options) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `Typing Test App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };
    await transporter.sendMail(mailOptions);
};
```

2. **Configuration:**
- Uses Gmail SMTP service
- Requires `EMAIL_USER` (Gmail address) and `EMAIL_PASS` (Gmail App Password)
- App passwords are 16-character passwords generated from Google Account settings
- 2-Step Verification must be enabled to generate app passwords

3. **Usage:**
- **Registration**: Sends 6-digit OTP for email verification
- **Password Reset**: Sends reset token link with expiration (15 minutes)

**Security:**
- Environment variables for credentials (not hardcoded)
- App passwords instead of regular passwords
- Tokens are hashed before storing in database

**Production Considerations:**
- Gmail has daily sending limits (~500 emails/day)
- Better to use dedicated services (SendGrid, Mailgun, AWS SES) for production
- Error handling ensures registration doesn't fail if email fails to send

---

## 24. **What are the differences between using Gmail SMTP and dedicated email services like SendGrid? When would you use each?**

**Answer:**

**Gmail SMTP (Current Implementation):**

**Pros:**
- Free for personal use
- Easy to set up (just need app password)
- Good for development and small projects
- No additional service signup required

**Cons:**
- Sending limits: ~500 emails/day for free accounts
- Lower deliverability rates (may go to spam)
- Not designed for bulk/commercial use
- Requires 2FA and app passwords
- Can get blocked if sending too many emails
- Less analytics and tracking

**Dedicated Email Services (SendGrid, Mailgun, AWS SES):**

**Pros:**
- Higher deliverability rates (99%+)
- Better analytics (open rates, click rates, bounces)
- Higher sending limits (thousands per day)
- Better reputation management
- Transactional and marketing email support
- Webhook support for events
- Template support
- Better error handling and retry logic

**Cons:**
- Costs money for high volume
- Requires service signup and API key management
- More complex setup

**When to Use Each:**

**Use Gmail SMTP When:**
- Development/testing environment
- Small personal projects (< 100 emails/day)
- Learning/prototyping
- No budget for email service

**Use Dedicated Services When:**
- Production applications
- High email volume (> 500/day)
- Need analytics and tracking
- Need better deliverability
- Commercial/business applications
- Need email templates and webhooks

**Migration Path:**
- Start with Gmail for development
- Switch to SendGrid/Mailgun for production
- Only change transporter configuration, `sendEmail` function remains same

---

## 25. **How would you handle email sending failures and implement retry logic with nodemailer?**

**Answer:**

**Current Implementation:**
```javascript
// Email sending is wrapped in try-catch but doesn't retry
await sendEmail({ email, subject, message });
```

**Improved Implementation with Retry Logic:**

```javascript
const sendEmailWithRetry = async (options, maxRetries = 3) => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: `Typing Test App <${process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                text: options.message
            });
            
            console.log(`Email sent successfully on attempt ${attempt}`);
            return { success: true };
            
        } catch (error) {
            lastError = error;
            console.error(`Email send attempt ${attempt} failed:`, error.message);
            
            // Exponential backoff: wait 2^attempt seconds before retry
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt) * 1000; // milliseconds
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    // All retries failed
    console.error('All email send attempts failed:', lastError);
    return { success: false, error: lastError };
};
```

**Error Handling Strategies:**

1. **Retry with Exponential Backoff:**
   - Wait 2s, 4s, 8s between retries
   - Prevents overwhelming the email service

2. **Queue Failed Emails:**
   - Store failed emails in database/queue
   - Background job retries later
   - Use Redis/Bull queue for job processing

3. **Fallback Email Service:**
   - Try primary service (SendGrid)
   - If fails, try secondary (Mailgun)
   - Ensures emails are sent even if one service is down

4. **User Notification:**
   - Don't block user registration if email fails
   - Log error but allow user to proceed
   - Optionally show warning message
   - Allow manual resend of verification email

5. **Monitoring:**
   - Log all email failures
   - Alert if failure rate > threshold
   - Track email delivery rates

**Production Implementation:**
```javascript
// In userController.js
try {
    await sendEmail({ email, subject, message });
} catch (error) {
    // Log error but don't block registration
    console.error('Email send failed:', error);
    // Optionally: Add to retry queue
    // await emailQueue.add({ email, subject, message });
}
```

**Best Practices:**
- Never block critical user flows (registration) for email failures
- Log all email attempts for debugging
- Use background jobs for non-critical emails
- Monitor email service health
- Implement rate limiting to avoid spam

---

**Good Luck with Your Interview! 🚀**

