import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./config/db.js";
import { ensureDefaultAdmin } from "./controllers/authController.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://meghrajh.github.io",
  "https://meghrajh.github.io/rajdhani",
];

const allowedOrigins = [
  ...new Set(
    [
      ...defaultAllowedOrigins,
      ...(process.env.CLIENT_URL || "")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean),
    ],
  ),
];

await connectDB();
await ensureDefaultAdmin();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Hotel Rajdhani Palace API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
