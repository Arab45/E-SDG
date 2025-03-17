const mongoose = require('mongoose');
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    subjectName: {
        type: String,
    },
    description: {
        type: String,
    },
    available: {
        type: String,
    }
});

module.exports = mongoose.model("Subject", subjectSchema);