import   {userRegistration, loginUser,getUserDetails, verifyEmail, logoutUser, forgetPassword,resetPassword} from '../controller/userController.js';
import express  from 'express';
import {authUser} from '../middleware/authMiddleware.js';
const userRouter = express.Router();

userRouter.post('/register', userRegistration);
userRouter.post('/login', loginUser);
userRouter.get('/profile',authUser,getUserDetails);
userRouter.post('/logout',logoutUser);
userRouter.post('/verify-email', verifyEmail);
userRouter.post('/forget',forgetPassword);
userRouter.put('/reset/:token', resetPassword);
export {userRouter};

