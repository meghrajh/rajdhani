import express from "express";
import { createRoom, deleteRoom, getRooms, updateRoom } from "../controllers/roomController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRooms);
router.post("/", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
