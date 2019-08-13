const mongoose = require('mongoose');
const { Schema } = mongoose;

const commitmentSchema = new Schema({
    userName: { type: String, required: true},
    affiliate: {     
        fullname: String
    },
	typeCommitment: {type: String, required: true},
    commitmentDescription: {type: String, required: false},
    quantity: {type: Number, required: false},
    date: { type : Date }
		
})


module.exports = mongoose.model('Commitment', commitmentSchema);