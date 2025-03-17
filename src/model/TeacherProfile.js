const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    firstNmae: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    subjectCreated: {
        type: String,
        required: true
    },
    enrollStudent: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('TeacherPofile', profileSchema);