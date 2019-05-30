const mongoose = require('mongoose');
const { Schema } = mongoose;

const divipolMasterSchema = new Schema({	
	state: { type: String, required: true},
	municipality: [{name: String, required: true}],
		
});


module.exports = mongoose.model('DivipolMaster', divipolMasterSchema);