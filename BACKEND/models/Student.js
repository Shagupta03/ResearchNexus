// models/Student.js - Student Model

const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    SuperVisor: {
        type: String,
        required: true
    },
    Gmail: {
        type: String,
        required: true,
        unique: true
    },
    Group_id: {
        type: String,
        required: true,
        set: v => String(v)
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);