import { SOS } from "../models/sosSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendOTP } from "../utils/smsGateway.js";

// Create SOS message
export const createSOSMessage = catchAsyncError(async (req, res) => {
    const { userId, gps, message } = req.body;

    const sosMessage = await SOS.create({
        userId,
        gps,
        message: message || ""
    });

    // Send SMS notification (you might want to send to emergency contacts)
    // This is a placeholder - you'll need to implement emergency contact logic
    try {
        // await sendEmergencySMS(sosMessage);
        console.log(`🚨 SOS message created for user ${userId} at location: ${gps.lat}, ${gps.long}`);
    } catch (error) {
        console.error('Failed to send emergency SMS:', error);
    }

    res.status(201).json({
        success: true,
        message: "SOS message created successfully",
        data: sosMessage
    });
});

// Get SOS messages for a specific user
export const getSOSMessages = catchAsyncError(async (req, res) => {
    const { userId } = req.query;
    
    const sosMessages = await SOS.find({ userId })
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: sosMessages.length,
        data: sosMessages
    });
});

// Get all SOS messages (admin only)
export const getAllSOSMessages = catchAsyncError(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "Only admins can view all SOS messages"
        });
    }

    const sosMessages = await SOS.find()
        .populate('userId', 'name email phone')
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: sosMessages.length,
        data: sosMessages
    });
});

// Delete SOS message
export const deleteSOSMessage = catchAsyncError(async (req, res) => {
    const { id, userId } = req.body;
    
    const sosMessage = await SOS.findById(id);
    
    if (!sosMessage) {
        return res.status(404).json({
            success: false,
            message: "SOS message not found"
        });
    }

    // Check if user is authorized to delete this message
    if (sosMessage.userId.toString() !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this message"
        });
    }

    await SOS.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "SOS message deleted successfully"
    });
});
