const mongoose = require('mongoose');
const { Schema } = mongoose;

const electoralMasterSchema = new Schema({
	userName: { type: String, required: true},
	state: {type: String},
	municipality: {type: String},
	votingStation: { type: String, required: true},	
	votingPlace: { type: String, required: true},
	numberTables: { type: Number, required: true }	
});


module.exports = mongoose.model('ElectoralMaster', electoralMasterSchema);