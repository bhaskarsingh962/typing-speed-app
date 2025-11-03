import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './database/index.js';
import cookieParser from 'cookie-parser';
import { userRouter } from './routes/userRoutes.js';
import { textRouter } from './routes/textRoutes.js';
import {resultRouter} from './routes/resultRoutes.js';

//intialize the express application
const app = express();
app.use(express.json());
connectDB();

//using the middleware
app.use(cors());

app.use(cookieParser());

//defining the test route

app.use('/api/users', userRouter);
app.use('/api/texts',textRouter);
app.use('/api/results', resultRouter);

//testing route
app.use('/', (req, res) => {
    
    res.send({
        success: true,
        message: "Server is running"
    });});

const port = process.env.PORT || 5002;

app.listen(port, () => {
 console.log(`Server is listening on http://localhost:${port}`);
});
