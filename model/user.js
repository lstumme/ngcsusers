const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
	login: { type: String, required: true, unique: true },
	password: { type: String, required: true},
	email: { type: String, required: true, unique: true },
	firstname: { type: String},
	lastname: { type: String},
	avatar: { type: String},
	creationDate: { type: Date, required: true, default: Date.now },
	role: { type: mongoose.ObjectId, ref: 'Role' , required: true },
});

module.exports = mongoose.model('User', UserSchema);

