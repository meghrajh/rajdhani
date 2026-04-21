import express from "express";
import { createBooking, deleteBooking, getAllBookings, getMyBookings, updateBooking } from "../controllers/bookingController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyBookings);
router.post("/", protect, createBooking);
router.put("/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);
router.get("/all", protect, adminOnly, getAllBookings);

export default router;
