const mongoose = require('mongoose'); 

//const URI = 'mongodb://yeilop44:Fragante44@ds245772.mlab.com:45772/meansearchflights';
//const URI = 'mongodb://yeilop44:Fragante44@ds143326.mlab.com:43326/politicalmap';
const URI = 'mongodb://localhost:27017/products-shop';
 
mongoose.connect(URI)
	.then(db => console.log('db is connected now'))
	.catch(err => console.error(err));

module.exports = mongoose; 
