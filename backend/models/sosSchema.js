import mongoose from "mongoose";

const sosSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    gps: {
        lat: {
            type: String,
            required: [true, "Latitude is required"]
        },
        long: {
            type: String,
            required: [true, "Longitude is required"]
        }
    },
    message: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

const SOS = mongoose.model("SOS", sosSchema);
export { SOS }; 