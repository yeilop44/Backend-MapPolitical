const mongoose = require('mongoose');
const { Schema } = mongoose;

const professionSchema = new Schema({
	name: { type: String, required: true},	
});


module.exports = mongoose.model('Profession', professionSchema);