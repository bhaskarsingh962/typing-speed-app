import {addText, getAllTexts, getTextById, deleteText,getRandomText} from "../controller/textController.js";
import express, { text } from 'express';
import { authUser } from "../middleware/authMiddleware.js";

const textRouter = express.Router();

textRouter.get('/random', getRandomText);
textRouter.post('/add',authUser, addText);
textRouter.get('/get', getAllTexts);
textRouter.get('/get/:id', getTextById);
textRouter.delete('/delete/:id',authUser, deleteText);


export {textRouter};