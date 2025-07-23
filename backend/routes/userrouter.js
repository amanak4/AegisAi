import express from "express";
import { getuser, login, logout, register, verifyOtp, completeRegistration, addEmergencyContact, deleteEmergencyContact, updateEmergencyContact, updateVehicleDetails, updateInsuranceDetails, updatePermission } from "../controllers/userController.js";
import {isAuthorized} from "../middlewares/auth.js";
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/logout",isAuthorized,logout);
router.get("/getuser",isAuthorized,getuser);
router.post("/verify-otp", verifyOtp);
router.post("/complete-registration", completeRegistration);
router.post("/emergency-contact/add", addEmergencyContact);
router.delete("/emergency-contact/delete", deleteEmergencyContact);
router.put("/emergency-contact/update", updateEmergencyContact);
router.put("/vehicle-details", updateVehicleDetails);
router.put("/insurance-details", updateInsuranceDetails);
router.put("/permission", updatePermission);
export default router;