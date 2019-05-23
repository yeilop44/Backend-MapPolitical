const express = require('express');
const router = express.Router();

const ElectoralMaster = require('../models/electoralMaster');

//post
router.post('/', async (req, res, next) => {
    
    const electoralMaster = new ElectoralMaster({    
        userName: req.body.userName,
        votingStation: req.body.votingStation,
        votingPlace: req.body.votingPlace,
        numberTables: req.body.numberTables        
    });
    await electoralMaster.save()
    res.status(200).json({
        message: "ElectoralMaster Created",
        ElectoralMaster: electoralMaster
    });
});

//getAllByUser
router.get('/:userName', async (req, res) => {
    const userName = req.params.userName;
    const electoralMaster = await ElectoralMaster.find({userName: userName});
    const count = electoralMaster.length; 
    res.status(200).json({
        Count: count,
        Items: electoralMaster
    });     
});

module.exports = router;