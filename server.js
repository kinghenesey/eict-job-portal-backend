require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Application = require("./models/Application");
const Team = require("./models/Team");

const app = express();
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

/* ===================== TEST ROUTE ===================== */
app.get("/", (req, res) => {
    res.send("EICT Backend is running 🚀");
});

/* ===================== DATABASE CONNECTION ===================== */
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");

    // START SERVER ONLY AFTER DB IS READY
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

// CREATE APPLICATION
app.post("/apply", async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        await newApplication.save();
        res.send("Application saved to database ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// GET ALL APPLICATIONS
app.get("/applications", async (req, res) => {
    try {
        const data = await Application.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE APPLICATION
app.delete("/applications/:id", async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.send("Deleted successfully 🗑️");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE APPLICATION
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

// GET TEAM
app.get("/team", async (req, res) => {
    try {
        const data = await Team.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ADD TEAM MEMBER
app.post("/team", async (req, res) => {
    try {
        const newMember = new Team(req.body);
        await newMember.save();
        res.send("Team member added");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

/* ===================== ADMIN LOGIN ===================== */

app.post("/admin/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "12345") {
        return res.json({
            success: true,
            token: "eict-admin-token"
        });
    }

    res.status(401).json({
        success: false,
        message: "Invalid credentials"
    });
});
