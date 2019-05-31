const mongoose = require('mongoose');
const { Schema } = mongoose;

const geographyMasterSchema = new Schema({
	userName: { type: String, required: true},
	state: {type: String},
	municipality: {type: String},
	zone: { type: String, required: true},
	subdivision: { type: String, required: true},	
		
});


module.exports = mongoose.model('GeographyMaster', geographyMasterSchema);