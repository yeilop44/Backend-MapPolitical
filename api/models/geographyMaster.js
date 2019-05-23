const mongoose = require('mongoose');
const { Schema } = mongoose;

const geographyMasterSchema = new Schema({
	userName: { type: String, required: true},
	zone: { type: String, required: true},
	subdivision: { type: String, required: true},	
		
});


module.exports = mongoose.model('GeographyMaster', geographyMasterSchema);