const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
	userName: { type: String, required: true},
	password: {type: String, required: true},
	names: {type: String, required: false},
	surnames: {type: String, required: false},
	position: {type: String, required: false},
	place: {type: String, required: false},	
	positionLat: {type: Number, required: false},
	positionLng: {type: Number, required: false},
	redNetworks: {type: Array, "default": [], required: false}

	
})


module.exports = mongoose.model('User', userSchema);