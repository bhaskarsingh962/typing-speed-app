import jwt from "jsonwebtoken";
import validator from "email-validator";
import userModel from "../models/usermodel.js";
import otpGenerator from "otp-generator";
import { sendEmail } from "../Utility/emailUitility.js";
import crypto from 'crypto';
const otp_generator = otpGenerator.generate(6, {
  upperCaseAlphabets: false,
  lowerCaseAlphabets: false,
  specialChars: false,
});

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (await userModel.findOne({ email })) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    if (!validator.validate(email))
      return res.status(400).json({
        success: false,
        message: "email format is not correct",
      });
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const otp = otp_generator;
    user.otp = otp;
    user.emailVerificationOTPExpires = Date.now() + 10 * 60 * 1000;

    await user.save();

    if (user) {
      const message = `Welcome!${name} Your verification code is: ${otp}`;
      await sendEmail({
        email: user.email,
        subject: "Verify Your Email Address",
        message: message,
      });
    }
    console.log("registration completed");
    return res.status(201).json({
      success: true,
      message: `User Registered Successfully, OTP sent to ${email}`,
      name,
      email,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "At the time of Registeration Server Error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({
        success: false,
        message: "Please provide all credentials",
      });

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "You are not registered, please registered first",
      });
    }

    if (user.emailVerificationOTPExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP is expired",
      });
    }

    if (user.otp != otp) {
      return res.status(400).json({
        success: false,
        message: "Entered OTP is incorrect",
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationOTPExpires = undefined;
    user.otp = undefined;
    await user.save();
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({
        success: false,
        message: "Please provide all credentials",
      });
    const user = await userModel.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.isEmailVerified == false) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email first"
      });
    }
    const token = createToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    console.log("login successful");
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user:{_id: user._id,
            name: user.name,
            email: user.email}
    });
  } catch (error) {
    console.log("login issue");
    return res.status(500).json({ message: "Server Error" });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const getUserDetails = async (req, res) => {
  try {
    const user = req.user;

    if (user) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

const forgetPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(200).json({ 
                success: true, 
                message: 'If an account with that email exists, a reset token has been sent.' 
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');

        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
        
        await user.save();

        const resetUrl = `http://localhost:5181/reset-password/${resetToken}`;
        const message = `You requested a password reset. Please click this link to reset your password: ${resetUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Password Reset Token',
            message
        });

        res.status(200).json({ 
            success: true, 
            message: 'If an account with that email exists, a reset link has been sent.' 
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await userModel.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: 'Token is invalid or has expired.' });
        }

        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        
        await user.save();

        res.status(200).json({ success: true, message: 'Password has been reset successfully.' });

    } catch (error) {
        console.error("Reset Password Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

export {
  userRegistration,
  loginUser,
  getUserDetails,
  verifyEmail,
  logoutUser,
  forgetPassword,
  resetPassword,
};
