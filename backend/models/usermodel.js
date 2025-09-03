import mongoose from "mongoose";
import bcrypt from 'bcrypt';
const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim : true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,

    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
     otp: String,

    emailVerificationOTPExpires: Date,

    passwordResetToken: String,

    passwordResetExpires: Date,

    charStats: {
          type: Map,
          of: {
               correct: { type: Number, default: 0 },
               incorrect: { type: Number, default: 0 }
              },
          default: {}
   },

    highestWpmEver: {
        type: Number,
        default: 0
    }
},{ timestamps: true })

userSchema.index(
    { emailVerificationOTPExpires: 1 },
    { 
        expireAfterSeconds: 0,
        
        partialFilterExpression: { isEmailVerified: false }
    }
);
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.matchPassword = async function (EnteredPassword) {
    return await bcrypt.compare(EnteredPassword, this.password);
}

const userModel  = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;