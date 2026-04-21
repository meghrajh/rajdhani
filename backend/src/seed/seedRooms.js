import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Room from "../models/Room.js";

dotenv.config();

const sampleRooms = [
  {
    roomType: "Deluxe King Room",
    price: 4200,
    capacity: 2,
    description: "A refined king-size room with warm interiors, breakfast access, and a city-facing seating corner.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
  },
  {
    roomType: "Executive Family Suite",
    price: 6800,
    capacity: 4,
    description: "Spacious family suite with two sleeping zones, elegant decor, and ideal comfort for longer stays.",
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
  },
  {
    roomType: "Royal Heritage Suite",
    price: 9600,
    capacity: 3,
    description: "A premium suite with plush furnishings, private lounge space, and signature palace-inspired styling.",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
    isAvailable: true,
  },
];

const seedRooms = async () => {
  try {
    await connectDB();
    await Room.deleteMany();
    await Room.insertMany(sampleRooms);
    console.log("Sample rooms seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed rooms:", error.message);
    process.exit(1);
  }
};

seedRooms();
