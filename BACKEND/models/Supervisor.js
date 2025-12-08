// models/Supervisor.js - Supervisor Model

const mongoose = require('mongoose');

const SupervisorSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Interest: {
        type: String,
        required: true
    },
    Gmail: {
        type: String,
        required: true,
        unique: true,
        primary: true
    },
    groups: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Supervisor', SupervisorSchema);