import mongoose from "mongoose";

const connectDB = async () =>
{
     try {
        mongoose.connection.on('connected', () =>{
            console.log("DB Connected");
        })
         await mongoose.connect(`${process.env.MONGO_URL}TypingTest`)
     } catch (error) {
        console.error(error);
     }
}

export default connectDB