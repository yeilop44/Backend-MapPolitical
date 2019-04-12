const express = require('express');
const router = express.Router();
//const bcrypt = require('bcrypt');

const Product = require('../models/product');


//getAllProducts
router.get('/', async (req, res) => {
    const products = await Product.find();
    const count = products.length; 
    res.status(200).json({
        Count: count,
        Items: products
    });
});


module.exports = router;