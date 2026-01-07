import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ============================================================
   SIGNUP
============================================================ */
export const signup = async (req, res) => {
  console.log("🔥 SIGNUP REQ BODY:", req.body);

  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: "free",
      credits: 20, // default welcome credits
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "Signup successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Signup error", error: err.message });
  }
};

/* ============================================================
   LOGIN
============================================================ */
export const login = async (req, res) => {
  console.log("🔥 LOGIN REQ BODY:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing login fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
      },
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    return res.status(500).json({ message: "Login error", error: err.message });
  }
};

/* ============================================================
   GET LOGGED IN USER (/auth/me)
============================================================ */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email plan credits stripeCustomerId"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        credits: user.credits,
        stripeCustomerId: user.stripeCustomerId || null,
      },
    });
  } catch (err) {
    console.error("❌ GET ME ERROR:", err);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};

