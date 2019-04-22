const mongoose = require('mongoose');
const { Schema } = mongoose;

const affiliateSchema = new Schema({
	president: { type: String, required: true},
	date: { type: String, required: true},
	fullName: {type: String, required: true},
	address: {type: String, required: true},
	positionLat: {type: Number, required: true},
	positionLng: {type: Number, required: true},	
	profession: {type: String, required: true},
	phone: {type: Number, required: true},
	identification: {type: Number, required: true},
	observations: {type: String}
})


module.exports = mongoose.model('Affiliate', affiliateSchema);