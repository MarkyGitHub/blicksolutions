import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import mongoose from "mongoose";
import { ShoppingItemModel } from "../models/ShoppingItem.js";

export const itemsRouter = Router();

//REST-API Schnittstelle für Einkaufslisteneinträge

// GET /items - Alle Einträge abrufen (sortiert nach Erstellungsdatum)
itemsRouter.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await ShoppingItemModel.find().sort({ createdAt: -1 }).lean();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// POST /items - Neuen Eintrag erstellen
itemsRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body as { name?: unknown };

    if (typeof name !== "string" || name.trim().length === 0) {
      return res.status(400).json({ message: "'name' must be a non-empty string" });
    }

    const created = await ShoppingItemModel.create({ name: name.trim(), bought: false });
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /items/:id - Gekauft-Status aktualisieren
itemsRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { bought } = req.body as { bought?: unknown };

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    if (typeof bought !== "boolean") {
      return res.status(400).json({ message: "'bought' must be a boolean" });
    }

    const updated = await ShoppingItemModel.findByIdAndUpdate(
      id,
      { bought },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /items/:id - Eintrag löschen
itemsRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    const deleted = await ShoppingItemModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});
