import mongoose, { Schema } from "mongoose";
const shoppingItemSchema = new Schema({
    name: { type: String, required: true, trim: true },
    bought: { type: Boolean, required: true, default: false }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
export const ShoppingItemModel = mongoose.model("ShoppingItem", shoppingItemSchema);
