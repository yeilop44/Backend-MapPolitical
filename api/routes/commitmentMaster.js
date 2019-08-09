const express = require('express');
const router = express.Router();

const CommitmentMaster = require('../models/commitmentsMaster');

//post
router.post('/', async (req, res, next) => {
    
    const commimentMaster = new CommitmentMaster({    
        userName: req.body.userName,
        typeCommitment: req.body.typeCommitment,
        commitmentDescription: req.body.commitmentDescription,         
    });
    await commimentMaster.save()
    res.status(200).json({
        message: "CommitmentMaster Created",
        CommitmetMaster: commimentMaster
    });
});

//getAllByUser
router.get('/:userName', async (req, res) => {
    const userName = req.params.userName;
    const commitmentMaster = await CommitmentMaster.find({userName: userName});
    const count = commitmentMaster.length; 
    res.status(200).json({
        Count: count,
        Items: commitmentMaster
    });     
});

//put
router.put('/:commitmentId', async (req, res) => {
    
    const { commitmentId } = req.params;
	const commitmentMaster = {
        userName: req.body.userName,       
        typeCommitment: req.body.typeCommitment,
        commitmentDescription: req.body.commitmentDescription,                                  
	}

	await CommitmentMaster.findByIdAndUpdate(commitmentId, {$set: commitmentMaster}, {new: true});
    res.status(200).json({
        message: 'Updated commitment',
        Commitment: commitmentMaster
    });
 });

 //delete
 router.delete('/:commitmentId', async (req, res) => {
    await CommitmentMaster.findByIdAndRemove(req.params.commitmentId);
    res.status(200).json({
        message: 'Deleted commitment'
    });
 });

module.exports = router;