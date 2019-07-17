const mongoose = require('mongoose');
const { Schema } = mongoose;

const listMasterSchema = new Schema({
	type: { type: String, required: true},	
	name: { type: String, required: true},	
});


module.exports = mongoose.model('ListMaster', listMasterSchema);