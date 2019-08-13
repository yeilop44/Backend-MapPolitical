const mongoose = require('mongoose');
const { Schema } = mongoose;

const commitmentMasterSchema = new Schema({	
	userName: { type: String, required: true},
	typeCommitment: {type: String, required: true},
	commitmentDescription: { type: String, required: true},			
});

module.exports = mongoose.model('CommitmentMaster', commitmentMasterSchema);