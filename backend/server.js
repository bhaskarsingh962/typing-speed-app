import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './database/index.js';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/userRoutes.js';
import { textRouter } from './routes/textRoutes.js';
import { resultRouter } from './routes/resultRoutes.js';


const app = express();

// Middlewares
app.use(express.json());
app.use(cors({
  origin: true, 
  credentials: true
}));
app.use(cookieParser());

// Connect to DB
connectDB();

// Routes
app.use('/api/users', userRouter);
app.use('/api/texts', textRouter);
app.use('/api/results', resultRouter);

// Default route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running successfully 🚀'
  });
});


const PORT = process.env.PORT || 10000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});


