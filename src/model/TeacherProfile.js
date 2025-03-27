const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teacherProfileSchema = new Schema({
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
    },
    teacher_img: {
        type: String
    },
    teacher_imgId: {
        type: String
    }
});

module.exports = mongoose.model('TeacherPofile', teacherProfileSchema);