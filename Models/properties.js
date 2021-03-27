const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertieschema = new Schema({
    img: { type: String, required: true },
    images: [],
    type: { type: String, required: true },
    bedrooms: { type: String, required: true },
    bathroom: { type: String, required: true },
    price: { type: Number, required: true },
    sellOrRent: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, },
    details: [],
    ownerId: { type: 'ObjectId', ref: 'User' },
}, { timestamps: true });

const Property = mongoose.model('Property', propertieschema);
module.exports = Property;