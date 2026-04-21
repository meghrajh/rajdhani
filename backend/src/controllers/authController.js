import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "An account with this email already exists." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  return res.status(201).json({
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    token: generateToken(user._id),
    user: sanitizeUser(user),
  });
};

export const getCurrentUser = async (req, res) => {
  return res.json({ user: sanitizeUser(req.user) });
};

export const ensureDefaultAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    return;
  }

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (existingAdmin) {
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || "admin123", 10);
  await User.create({
    name: process.env.ADMIN_NAME || "Hotel Admin",
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
  });
  console.log(`Default admin created for ${adminEmail}`);
};
