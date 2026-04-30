// models/Team.js
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
    name: String,
    role: String,
    image: String
});

module.exports = mongoose.model("Team", teamSchema);