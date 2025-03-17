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
    file: {
        type: String,
    }
});

module.exports = mongoose.model("Library", librarySchema);
