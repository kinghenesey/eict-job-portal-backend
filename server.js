require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const Application = require("./models/Application");
const Team = require("./models/Team");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

/* ===================== TEST ROUTE ===================== */
app.get("/", (req, res) => {
    res.send("EICT Backend is running 🚀");
});

/* ===================== AUTH MIDDLEWARE ===================== */
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(403).send("Access denied ❌ No token");
    }

    // Expecting: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (err) {
        res.status(401).send("Invalid token ❌");
    }
}

/* ===================== DATABASE CONNECTION ===================== */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

})
.catch((err) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(err.message);
    process.exit(1);
});

/* ===================== APPLICATION ROUTES ===================== */

// CREATE APPLICATION (PUBLIC)
app.post("/apply", async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.send("Application saved to database ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET APPLICATIONS (PROTECTED)
app.get("/applications", authMiddleware, async (req, res) => {
    try {
        const data = await Application.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE APPLICATION (PROTECTED)
app.delete("/applications/:id", authMiddleware, async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.send("Deleted successfully 🗑️");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE APPLICATION (PROTECTED)
app.put("/applications/:id", authMiddleware, async (req, res) => {
    try {
        const updated = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* ===================== TEAM ROUTES ===================== */

// GET TEAM (PUBLIC - IMPORTANT FIX)
app.get("/team", async (req, res) => {
    try {
        const data = await Team.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD TEAM MEMBER (PROTECTED)
app.post("/team", authMiddleware, async (req, res) => {
    try {
        const newMember = new Team(req.body);
        await newMember.save();
        res.send("Team member added ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* ===================== CONTACT ROUTE ===================== */

// PUBLIC (users send messages)
app.post("/contact", async (req, res) => {
    try {
        const msg = new Contact(req.body);
        await msg.save();
        res.send("Message saved ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* ===================== ADMIN LOGIN ===================== */

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "12345") {
        const token = jwt.sign(
            { role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        return res.json({
            success: true,
            token: token
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials ❌"
    });
});

// ADD THIS in server.js
app.get("/contact", authMiddleware, async (req, res) => {
    const data = await Contact.find();
    res.json(data);
});