const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, unique: true, sparse: true },
    phoneSuffix: { type: String, unique: false },
    username: { type: String },
    email: {
        type: String,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
        trim: true
    },
    emailOtp:
    {
        type: String
    },
    emailOtpExpire: {
        type: Date
    },
    profilePicture:
    {
        type: String
    },
    about: {
        type: String
    },
    lastSeen:
    {
        type: Date
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    agreed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = User
