const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: mongoose.ObjectId, ref: 'Group', required: true },
    creationDate: { type: Date, default: Date.now },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    avatar: { type: String, trim: true }
});

module.exports = mongoose.model("User", UserSchema);

