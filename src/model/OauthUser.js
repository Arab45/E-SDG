const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOauthSchema = new Schema({
    googleId: {
        type: String
    },
    fullName: {
        type: String
    },
    email: {
        type: String
    },
    creatAt: {
        type: Date,
        default: Date.now()
    }
});


module.exports = mongoose.model("OauthUser", userOauthSchema);