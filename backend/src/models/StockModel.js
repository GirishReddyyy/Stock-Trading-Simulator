import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
    {
        symbol: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        currentPrice: {
            type: Number,
            required: true
        },

        marketCap: {
            type: Number,
            default: 0
        },

        sector: {
            type: String,
            default: "General"
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    "Stock",
    stockSchema
);