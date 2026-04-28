require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Application = require("./models/Application");
const PORT = process.env.PORT || 5000;

const app = express();

// Temporary storage (in-memory)
let applications = [];

// MIDDLEWARE
app.use(cors({
    origin: "*"
}));
app.use(bodyParser.json());

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("MongoDB Connected ✅");
})
.catch((err) => {
    console.error("MongoDB Connection Failed ❌");
    console.error(err.message);
    process.exit(1);
});

// TEST ROUTE
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// ✅ IMPORTANT: POST ROUTE MUST BE HERE
app.post("/apply", async (req, res) => {
    try {
        const newApplication = new Application(req.body);

        await newApplication.save();

        res.send("Application saved to database ✅");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/applications", async (req, res) => {
    const data = await Application.find();
    res.json(data);
});

// DELETE an application by ID
app.delete("/applications/:id", async (req, res) => {
    try {
        await Application.findByIdAndDelete(req.params.id);
        res.send("Deleted successfully 🗑️");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});