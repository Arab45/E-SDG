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
    },
    subject_img: {
        type: String
    },
    subject_imgId: {
        type: String
    }
});

module.exports = mongoose.model("Subject", subjectSchema);