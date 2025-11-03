import {addResult, getUserResult, getLeaderboard,  getUserRank} from '../controller/resultController.js';
import {authUser} from '../middleware/authMiddleware.js';
import express from 'express';

const resultRouter = express.Router();

resultRouter.post('/add',authUser,addResult);
resultRouter.get('/my-result',authUser,getUserResult);
resultRouter.get('/leaderboard',getLeaderboard);

resultRouter.get('/rank',authUser,getUserRank);


export {resultRouter};