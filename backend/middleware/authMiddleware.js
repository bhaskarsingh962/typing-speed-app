import jwt, { decode } from 'jsonwebtoken';
import userModel from '../models/usermodel.js';

const authUser = async (req, res, next) =>{
     
   try {
     const token = req.cookies.token;
 
     if(token){
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = await userModel.findById(decoded.id).select('-password');
         next();
     }
     else{
         res.status(401).json({message: "You are not authorized"});
     }
   } catch (error) {
       return res.status(401).json({message: "You are not authorized"});
   }

}
export {authUser};
