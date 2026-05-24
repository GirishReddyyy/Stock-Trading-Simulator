import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        balance: {
            type: Number,
            default: 100000
        },

        role: {
            type: String,
            enum: ["trader", "admin"],
            default: "trader"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", userSchema);