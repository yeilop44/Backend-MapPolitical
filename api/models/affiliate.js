const mongoose = require('mongoose');
const { Schema } = mongoose;

const affiliateSchema = new Schema({
	userName: { type: String, required: true},
	birthdate: { type: String, required: true},
	names: {type: String, required: true},
	surnames: {type: String, required: true},
	sex: {type: String},
	zone: {type: String},
	subdivision: {type: String},
	address: {type: String},
	municipality: {type: String},
	votingTable: {type: String},
	votingStation: {type: String},
	votingPlace: {type: String},
	leader: {type: String},
	positionLat: {type: Number},
	positionLng: {type: Number},	
	profession: {type: String},
	occupation: {type: String},
	church: {type: String},
	lgtbi: {type: Boolean},
	disability: {type: Boolean},
	phone: {type: Number, required: true},
	identification: {type: Number, required: true},
	familyNumber: {type: Number}
})


module.exports = mongoose.model('Affiliate', affiliateSchema);