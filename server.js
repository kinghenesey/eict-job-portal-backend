require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Application = require("./models/Application");

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
// MIDDLEWARE
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("EICT Backend is running 🚀");
});

// DATABASE CONNECTION (IMPORTANT FIX)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(err.message);
});

// START SERVER OUTSIDE
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

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

// GET ALL APPLICATIONS (ONLY ONCE)
app.get("/applications", async (req, res) => {
    try {
        const data = await Application.find();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// DELETE APPLICATION
app.delete("/applications/:id", async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.send("Deleted successfully 🗑️");
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});