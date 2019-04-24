const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const Affiliate = require('../models/affiliate');


//getAllAffiliates
router.get('/', ensureToken, (req, res) => {
    
    jwt.verify(req.token, 'my_secret_key', async (err, data) => {
        if(err){
            res.sendStatus(403);
        }else{
            const affiliate = await Affiliate.find();
            const count = affiliate.length; 
            res.status(200).json({
                Count: count,
                Items: affiliate
            });
        }
    });     
});



//postAffiliate
router.post('/', async (req, res, next) => {
    
    const affiliate = new Affiliate({
        president: req.body.president,
        date: req.body.date,
        fullName: req.body.fullName,
        address: req.body.address, 
        positionLat: req.body.positionLat,
        positionLng: req.body.positionLng,   
        profession: req.body.profession,
        phone: req.body.phone,
        identification: req.body.identification,
        observations: req.body.observations
    });
    await affiliate.save()
    res.status(200).json({
        message: "Affiliate Created",
        Product: affiliate
    });
});

//getAffiliatesByPresident
router.get('/:president',async (req, res) => {
    const president = req.params.president;
    const affiliate = await Affiliate.find({president: president});
    const count = affiliate.length; 
    
    res.status(200).json({
         message: 'Found Affiliates',
         Count: count,
         Affiliates: affiliate
     });
 
 });
 

//putAffiliate
router.put('/:affiliateId', async (req, res) => {
    
    const { affiliateId } = req.params;
	const affiliate = {
    	president: req.body.president,
        date: req.body.date,
        fullName: req.body.fullName,
        address: req.body.address,
        profession: req.body.profession,
        phone: req.body.phone,
        identification: req.body.identification,
        observations: req.body.observations
	}

	await Affiliate.findByIdAndUpdate(affiliateId, {$set: affiliate}, {new: true});
    res.status(200).json({
        message: 'Updated affiliate',
        Affiliate: affiliate
    });
 });

 //deleteAffiliate
 router.delete('/:affiliateId', async (req, res) => {
    await Affiliate.findByIdAndRemove(req.params.affiliateId);
    res.status(200).json({
        message: 'Deleted affiliate'
    });
 });


 function ensureToken(req, res, next){
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else{
        res.sendStatus(403);
    }
}

module.exports = router;