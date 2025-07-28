import express from "express";
import { createSOSMessage, getSOSMessages, getAllSOSMessages, deleteSOSMessage } from "../controllers/sosController.js";
// import { isAuthorized } from "../middlewares/auth.js";

const router = express.Router();

router.post("/sos-message", createSOSMessage);
router.get("/sos-messages", getSOSMessages);
router.get("/sos-messages-admin", getAllSOSMessages);
router.delete("/sos-message/:id", deleteSOSMessage);

export default router; 