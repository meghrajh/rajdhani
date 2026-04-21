import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import hasBookingOverlap from "../utils/hasBookingOverlap.js";

const populateBooking = [
  { path: "roomId", select: "roomType price capacity image isAvailable" },
  { path: "userId", select: "name email role" },
];

const calculateTotalPrice = (checkInDate, checkOutDate, price) => {
  const start = new Date(checkInDate);
  const end = new Date(checkOutDate);
  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return nights * price;
};

export const getMyBookings = async (req, res) => {
  const bookings = await Booking.find({ userId: req.user._id }).populate(populateBooking).sort({ createdAt: -1 });
  return res.json({ bookings });
};

export const getAllBookings = async (req, res) => {
  const bookings = await Booking.find().populate(populateBooking).sort({ createdAt: -1 });
  return res.json({ bookings });
};

export const createBooking = async (req, res) => {
  const { roomId, checkInDate, checkOutDate, guests } = req.body;

  if (!roomId || !checkInDate || !checkOutDate || !guests) {
    return res.status(400).json({ message: "All booking fields are required." });
  }

  if (new Date(checkInDate) >= new Date(checkOutDate)) {
    return res.status(400).json({ message: "Check-out date must be after check-in date." });
  }

  const room = await Room.findById(roomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  if (!room.isAvailable) {
    return res.status(400).json({ message: "This room is currently unavailable." });
  }

  if (guests > room.capacity) {
    return res.status(400).json({ message: `This room allows a maximum of ${room.capacity} guests.` });
  }

  const overlap = await hasBookingOverlap({ roomId, checkInDate, checkOutDate });
  if (overlap) {
    return res.status(400).json({ message: "Room is already booked for the selected dates." });
  }

  const totalPrice = calculateTotalPrice(checkInDate, checkOutDate, room.price);

  const booking = await Booking.create({
    userId: req.user._id,
    roomId,
    checkInDate,
    checkOutDate,
    guests,
    totalPrice,
  });

  const populatedBooking = await Booking.findById(booking._id).populate(populateBooking);
  return res.status(201).json({ message: "Booking created successfully.", booking: populatedBooking });
};

export const updateBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "You can only update your own bookings." });
  }

  const nextRoomId = req.body.roomId || booking.roomId;
  const nextCheckInDate = req.body.checkInDate || booking.checkInDate;
  const nextCheckOutDate = req.body.checkOutDate || booking.checkOutDate;
  const nextGuests = req.body.guests || booking.guests;
  const nextStatus = req.body.status || booking.status;

  const room = await Room.findById(nextRoomId);
  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  if (!room.isAvailable && String(room._id) !== String(booking.roomId)) {
    return res.status(400).json({ message: "Selected room is unavailable." });
  }

  if (new Date(nextCheckInDate) >= new Date(nextCheckOutDate)) {
    return res.status(400).json({ message: "Check-out date must be after check-in date." });
  }

  if (nextGuests > room.capacity) {
    return res.status(400).json({ message: `This room allows a maximum of ${room.capacity} guests.` });
  }

  const overlap = await hasBookingOverlap({
    roomId: nextRoomId,
    checkInDate: nextCheckInDate,
    checkOutDate: nextCheckOutDate,
    excludeBookingId: booking._id,
  });

  if (overlap) {
    return res.status(400).json({ message: "Room is already booked for the selected dates." });
  }

  booking.roomId = nextRoomId;
  booking.checkInDate = nextCheckInDate;
  booking.checkOutDate = nextCheckOutDate;
  booking.guests = nextGuests;
  booking.status = nextStatus;
  booking.totalPrice = calculateTotalPrice(nextCheckInDate, nextCheckOutDate, room.price);
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id).populate(populateBooking);
  return res.json({ message: "Booking updated successfully.", booking: updatedBooking });
};

export const deleteBooking = async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  const isOwner = booking.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ message: "You can only delete your own bookings." });
  }

  await booking.deleteOne();
  return res.json({ message: "Booking deleted successfully." });
};
