// Pura auth.js — copy-paste karo
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction ? true : false,
    maxAge: 7 * 24 * 60 * 60 * 1000
};

// Register
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ error: "All fields required" });
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ error: "Email already registered" });
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);
        res.status(201).json({ success: true, name: user.name });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Register failed" });
    }
});

// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: "All fields required" });
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({ error: "Invalid credentials" });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ error: "Invalid credentials" });
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, cookieOptions);
        res.json({ success: true, name: user.name });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Login failed" });
    }
});

// Logout
router.post("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);
    res.json({ success: true });
});

// Check auth
router.get("/me", async (req, res) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");
        res.json({ success: true, name: user.name });
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

export default router;