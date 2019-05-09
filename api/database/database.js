const mongoose = require('mongoose'); 


const URI = 'mongodb://yeilop44:Fragante44@ds147446.mlab.com:47446/politicalmap';
//const URI = 'mongodb://localhost:27017/politicalmap';
 
mongoose.connect(URI)
	.then(db => console.log('db is connected now'))
	.catch(err => console.error(err));

module.exports = mongoose; 
