const mongoose = require('mongoose');
const { Schema } = mongoose;

const divipolMasterSchema = new Schema({	
	state: { type: String, required: true},
	municipality: {type: Array, "default": []},
		
});


module.exports = mongoose.model('DivipolMaster', divipolMasterSchema);