const express = require('express');
const router = express.Router();

const ElectoralMaster = require('../models/electoralMaster');

//post
router.post('/', async (req, res, next) => {
    
    const electoralMaster = new ElectoralMaster({    
        userName: req.body.userName,
        state: req.body.state,
        municipality: req.body.municipality,
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

//put
router.put('/:electoralId', async (req, res) => {
    
    const { electoralId } = req.params;
	const electoralMaster = {
        userName: req.body.userName,       
        state: req.body.state,
        votingStation: req.body.votingStation,  
        votingPlace: req.body.votingPlace,
       numberTables: req.body.numberTables,                      
	}

	await ElectoralMaster.findByIdAndUpdate(electoralId, {$set: electoralMaster}, {new: true});
    res.status(200).json({
        message: 'Updated electoral',
        Electoral: electoralMaster
    });
 });

 //delete
 router.delete('/:electoralId', async (req, res) => {
    await ElectoralMaster.findByIdAndRemove(req.params.electoralId);
    res.status(200).json({
        message: 'Deleted electoral'
    });
 });




module.exports = router;