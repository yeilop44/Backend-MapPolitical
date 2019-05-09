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
        userName: req.body.userName,
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

//getAffiliatesByUser
router.get('/:userName',async (req, res) => {
    const userName = req.params.userName;
    const affiliate = await Affiliate.find({userName: userName});
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
    	user: req.body.user,
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

//getAffiliatesByProfesion
router.get('/profession/:profession',async (req, res) => {
    const profession = req.params.profession;
    const affiliate = await Affiliate.find({profession: profession});
    const count = affiliate.length; 
    
    res.status(200).json({
         message: 'Found Affiliates by profesion',
         Count: count,
         Affiliates: affiliate
     });
 
 });
 //countProfession
router.get('/count/profession',async(req, res) => {
	const aggregatorOpts = [{	
        $group: {_id: "$profession", count: { $sum: 1 }}
    }]
	var profession = await Affiliate.aggregate(aggregatorOpts).exec()
	res.json({
		profesions: profession
	});

});  
 
//función para solicitar Token
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