import mongoose, { Schema } from "mongoose";

// Interface für Einkaufslisteneintrag
export interface ShoppingItem {
  _id: mongoose.Types.ObjectId;
  name: string;
  bought: boolean;
  createdAt: Date;
}

// Mongoose Document Type
export type ShoppingItemDocument = mongoose.Document & {
  name: string;
  bought: boolean;
  createdAt: Date;
};

// Schema-Definition mit Validierung
const shoppingItemSchema = new Schema<ShoppingItemDocument>(
  {
    name: { type: String, required: true, trim: true },
    bought: { type: Boolean, required: true, default: false }
  },
  {
    // Nur createdAt Zeitstempel, kein updatedAt
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Mongoose Model für Datenbankzugriff
export const ShoppingItemModel = mongoose.model<ShoppingItemDocument>(
  "ShoppingItem",
  shoppingItemSchema
);
