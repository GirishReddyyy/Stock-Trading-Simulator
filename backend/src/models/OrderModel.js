import mongoose from "mongoose";

const orderSchema =
    new mongoose.Schema(
        {
            user: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },

            stock: {
                type:
                    mongoose.Schema.Types.ObjectId,
                ref: "Stock",
                required: true
            },

            orderType: {
                type: String,
                enum: [
                    "BUY",
                    "SELL"
                ],
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            },

            limitPrice: {
                type: Number,
                required: true
            },

            status: {
                type: String,
                enum: [
                    "PENDING",
                    "EXECUTED",
                    "CANCELLED"
                ],
                default:
                    "PENDING"
            },

            executedPrice: {
                type: Number
            },

            executedAt: {
                type: Date
            }
        },
        {
            timestamps: true
        }
    );
    
export default mongoose.model("Order",orderSchema);