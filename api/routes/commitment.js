const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Commitment = require('../models/commitment');


//postCommitment
router.post('/', async (req, res, next) => {
    
    const commitment = new Commitment({
        userName: req.body.userName,
        affiliate: req.body.affiliate,
        typeCommitment: req.body.typeCommitment,
        commitmentDescription: req.body.commitmentDescription,
        quantity: req.body.quantity,
        date: req.body.date,       
    });
    await commitment.save()
    res.status(200).json({
        message: "Commitment Created",
        commitment: commitment
    });
});

//getCommitmentsByUser
router.get('/:userName',async (req, res) => {   
     
    const userName = req.params.userName;
    const commitment = await Commitment.find({userName: userName});
    const count = commitment.length; 
    res.status(200).json({                
        count: count,
        commitments: commitment          
    });       
 });

  //deleteAffiliate
  router.delete('/:commitmentId', async (req, res) => {
    await Commitment.findByIdAndRemove(req.params.commitmentId);
    res.status(200).json({
        message: 'Deleted commitment'
    });
 });

//getAffiliatesByType
router.get('/:userName/typeCommitment/:typeCommitment',async (req, res) => {
    const userName = req.params.userName;
    const typeCommitment = req.params.typeCommitment;
    const commitment = await Commitment.find({userName: userName, typeCommitment: typeCommitment});
    const count = commitment.length; 
    if(commitment){
        res.status(200).json({         
            Count: count,
            commitment: commitment
        });    
    }else {
        res.status(200).json({         
            message: "no found commitments"
        }); 
    }
    
 });

 //countcommitmentDescription
router.get('/count/:userName/typeCommitment/:typeCommitment', async(req, res) => {
    const userName = req.params.userName;
    const typeCommitment = req.params.typeCommitment;
    const aggregatorOpts = [
        {$match : { userName: userName, typeCommitment: typeCommitment }},
        {$group: {_id: "$commitmentDescription", totalAmount: { $sum: "$quantity" }, count: { $sum: 1 }}
    }]
	var commitmentDescription = await Commitment.aggregate(aggregatorOpts).exec()
	res.json({
		commitmentDescriptions: commitmentDescription
	});
}); 

module.exports = router;