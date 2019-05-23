const express = require('express');
const router = express.Router();

const GeographyMaster = require('../models/geographyMaster');

//post
router.post('/', async (req, res, next) => {
    
    const geographyMaster = new GeographyMaster({    
        userName: req.body.userName,
        zone: req.body.zone,
        subdivision: req.body.subdivision        
    });
    await geographyMaster.save()
    res.status(200).json({
        message: "GeographyMaster Created",
        GeographyMaster: geographyMaster
    });
});

//getAllByUser
router.get('/:userName', async (req, res) => {
    const userName = req.params.userName;
    const geographyMaster = await GeographyMaster.find({userName: userName});
    const count = geographyMaster.length; 
    res.status(200).json({
        Count: count,
        Items: geographyMaster
    });     
});

module.exports = router;