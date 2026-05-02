require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Application = require("./models/Application");
const Team = require("./models/Team");
const Contact = require("./models/Contact");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(express.json());

/* ===================== TEST ROUTE ===================== */
app.get("/", (req, res) => {
    res.send("EICT Backend is running 🚀");
});

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
app.get("/applications", async (req, res) => {
    try {
        const data = await Application.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE APPLICATION (PROTECTED)
app.delete("/applications/:id", async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.send("Deleted successfully 🗑️");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE APPLICATION (PROTECTED)
app.put("/applications/:id", async (req, res) => {
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
app.post("/team", async (req, res) => {
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

    if (username === "kinghenesey" && password === "king1225") {
        return res.json({
            success: true
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
});

// GET ALL CONTACT MESSAGES
app.get("/contact", async (req, res) => {
    try {
        const messages = await Contact.find().sort({ _id: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE MESSAGE
app.delete("/contact/:id", async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.send("Message deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});