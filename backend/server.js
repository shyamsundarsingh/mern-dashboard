import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "MY_SECRET_KEY"; // change this for production

// 🔹 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/auth_demo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// 🔹 User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
});

const User = mongoose.model("User", userSchema);

// ✅ Signup Route
app.post("/api/signup", async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ error: "User already exists" });

        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({ firstName, lastName, email, password: hash });

        res.json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });

        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✅ Get User (Protected)
app.get("/api/user", async (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).json({ error: "No token" });
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        res.json(user);
    } catch {
        res.status(401).json({ error: "Invalid token" });
    }
});

app.listen(5000, () => console.log("✅ Backend running on http://localhost:5000"));
