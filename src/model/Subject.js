const mongoose = require('mongoose');
const Schema = mongoose.Schema

const subjectSchema = new Schema({
    subjectName: {
        type: String,
    },
    description: {
        type: String,
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Subject", subjectSchema);