import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
  const rooms = await Room.find().sort({ createdAt: -1 });
  return res.json({ rooms });
};

export const createRoom = async (req, res) => {
  const { roomType, price, capacity, description, image, isAvailable } = req.body;

  if (!roomType || !price || !capacity || !description || !image) {
    return res.status(400).json({ message: "All room fields are required." });
  }

  const room = await Room.create({ roomType, price, capacity, description, image, isAvailable });
  return res.status(201).json({ message: "Room created successfully.", room });
};

export const updateRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  Object.assign(room, req.body);
  await room.save();

  return res.json({ message: "Room updated successfully.", room });
};

export const deleteRoom = async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  await room.deleteOne();
  return res.json({ message: "Room deleted successfully." });
};
