import {catchAsyncError} from "../middlewares/catchAsyncError.js";
import ErrHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendOTP } from "../utils/smsGateway.js";
export const register = catchAsyncError(async (req, res, next) => {
    try {
        const { name, phone, password } = req.body;
        if (!name || !phone || !password) {
            return res.json({
                success: false,
                error: "Please fill all required fields!"
            });
        }

        if (password.length > 32) {
            return res.json({
                success: false,
                error: "Password must contain at most 32 characters!"
            });
        }

        const existingUser = await User.findOne({ phone });
        if (existingUser) {
            return res.json({
                success: false,
                error: "Phone number already registered!"
            });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user with OTP, do not set emergency/vehicle/insurance yet
        const user = await User.create({
            name,
            phone,
            password,
            otp,
            otpExpiry
        });

        // Send OTP via SMS gateway (placeholder)
        await sendOTP(phone, otp);

        res.status(200).json({
            success: true,
            message: "OTP sent to your phone. Please verify to continue.",
            phone
        });
    } catch (error) {
        let errorResponse = {};
        if (error.errors) {
            Object.keys(error.errors).forEach(field => {
                errorResponse[field] = error.errors[field].message;
            });
        } else {
            errorResponse['message'] = error.message;
        }
        res.status(400).json({ mongooseError: errorResponse });
    }
});

export const verifyOtp = catchAsyncError(async (req, res, next) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) {
        return res.json({
            success: false,
            error: "Phone and OTP are required."
        });
    }
    const user = await User.findOne({ phone });
    if (!user) {
        return res.json({
            success: false,
            error: "User not found."
        });
    }
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry < new Date()) {
        return res.json({
            success: false,
            error: "Invalid or expired OTP."
        });
    }
    // OTP verified, clear OTP fields
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.status(200).json({
        success: true,
        message: "OTP verified. Please complete your registration.",
        phone
    });
});

export const completeRegistration = catchAsyncError(async (req, res, next) => {
    const { phone, emergencyContact, vehicleDetails, insuranceDetails } = req.body;
    if (
        !phone ||
        !Array.isArray(emergencyContact) ||
        emergencyContact.length === 0 ||
        !vehicleDetails
    ) {
        return res.json({
            success: false,
            error: "Phone, at least one emergency contact, and vehicle details are required."
        });
    }
    
    const user = await User.findOne({ phone });
    if (!user) {
        return res.json({
            success: false,
            error: "User not found."
        });
    }
    if (user.otp || user.otpExpiry) {
        return res.json({
            success: false,
            error: "OTP not verified yet."
        });
    }
    user.emergencyContact = emergencyContact;
    user.vehicleDetails = vehicleDetails;
    if (insuranceDetails) user.insuranceDetails = insuranceDetails;
    await user.save();

    // Set token in cookies
    sendToken(user, 200, res);
    // Now send your custom response
    res.status(200).json({
        success: true,
        message: "Registration completed successfully!",
        user
    });
});

export const login = catchAsyncError(async (req, res, next) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.json({
            success: false,
            error: "Please provide both phone number and password!"
        });
    }

    const user = await User.findOne({ phone });
    if (!user) {
        return res.json({
            success: false,
            error: "Invalid phone number or password!"
        });
    }

    const isPasswordCorrect = await user.comparePassword(String(password));
    if (!isPasswordCorrect) {
        return res.json({
            success: false,
            error: "Invalid phone number or password!"
        });
    }

    sendToken(user, 200, res, "User login successfully!");
});

export const logout = catchAsyncError(async(req, res, next) => {
    // Set token cookie to 'none' and set its expiration to a past date
    res.cookie("token", "none", {
        expires: new Date(0), // Set expiration to a past date
        httpOnly: true,
        // domain: "job-portal-x.vercel.app", // Set domain if needed
        secure: true, // Set secure flag if needed
        sameSite: 'none', // Set sameSite attribute if needed
    });

      res.json({
        status: true,
        message: "Logout Successfully"
    });
});


export const getuser=catchAsyncError(async(req,res,next)=>{
    const us=req.user;
    console.log(req.user);
    res.json({
        success:true,
        message:"See your profile",
        us
    })
})