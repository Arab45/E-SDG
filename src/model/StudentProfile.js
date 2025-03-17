const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    firstName: {
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
    class: {
        type: String,
        required: true
    },
    totalCourseEnroll: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('StudentPofile', profileSchema);