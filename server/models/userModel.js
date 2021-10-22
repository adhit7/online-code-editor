const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uid:{
        type: String,
        required: true
    },
    userName:{
        type:String,
        required: true
    },
    userEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    picUrl: {
        type: String,
        default: "/default_profile.png"
    }
});

module.exports = mongoose.model("users", userSchema);