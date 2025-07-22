import express from "express";
import { getuser, login, logout, register, verifyOtp, completeRegistration } from "../controllers/userController.js";
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthorized,logout);
router.get("/getuser",isAuthorized,getuser);
router.post("/verify-otp", verifyOtp);
router.post("/complete-registration", completeRegistration);
export default router;