const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    resourceName: {
        type: String,
    },
    subject_file: {
        type: String,
    },
    subject_fileId: {
        type: String,
    },
    avater_image: {
        type: String,
    },
    avater_imageId: {
        type: String,
    },
});

module.exports = mongoose.model("Library", librarySchema);
