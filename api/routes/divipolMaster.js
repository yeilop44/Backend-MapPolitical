const express = require('express');
const router = express.Router();

const DivipolMaster = require('../models/divipolMaster');

//post
router.post('/', async (req, res, next) => {
    
    const divipolMaster = new DivipolMaster({    
        state: req.body.state,
        municipality: req.body.municipality
        
    });
    await divipolMaster.save()
    res.status(200).json({
        message: "GeographyMaster Created",
        DivipolMaster: divipolMaster
    });
});

//getAllB
router.get('/', async (req, res) => {
  
    const divipolMaster = await DivipolMaster.find();
    const count = divipolMaster.length; 
    res.status(200).json({
        Count: count,
        Items: divipolMaster
    });     
});

module.exports = router;