const mongoose = require('mongoose'); 


const URI = 'mongodb://yeilop44:Fragante44@ds215338.mlab.com:15338/mapeopolitico';
//const URI = 'mongodb://yeilop44:Fragante44@ds147446.mlab.com:47446/politicalmap'; usa
//const URI = 'mongodb://localhost:27017/politicalmap';
 
mongoose.connect(URI, { useNewUrlParser: true } )
	.then(db => console.log('db is connected now'))
	.catch(err => console.error(err));

module.exports = mongoose; 
