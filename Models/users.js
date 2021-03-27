const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: [5, 'The password must be at least 6 symbols long'] },
    address: { type: String },
    profilephoto: { type: String },
    phone: { type: Number },
    likedProperties: [{ type: 'ObjectId', ref: 'Property' }],
    properties: [{ type: 'ObjectId', ref: 'Property' }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;