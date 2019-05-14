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
        birthdate: req.body.birthdate,
        names: req.body.names,
        surnames: req.body.surnames,
        sex: req.body.sex,
        zone: req.body.zone,
        subdivision: req.body.subdivision,
        address: req.body.address, 
        municipality: req.body.municipality,
        votingTable: req.body.votingTable,
        votingStation: req.body.votingStation,
        votingPlace: req.body.votingPlace,
        leader: req.body.leader,
        positionLat: req.body.positionLat,
        positionLng: req.body.positionLng,   
        profession: req.body.profession,
        occupation: req.body.occupation,
        church: req.body.church,
        lgtbi: req.body.lgtbi,
        disability: req.body.disability,
        phone: req.body.phone,
        identification: req.body.identification,
        familyNumber: req.body.familyNumber
    });
    await affiliate.save()
    res.status(200).json({
        message: "Affiliate Created",
        Affiliate: affiliate
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
    	userName: req.body.userName,
        birthdate: req.body.date,
        names: req.body.names,
        surnames: req.body.surnames,
        sex: req.body.sex,
        zone: req.body.zone,
        subdivision: req.body.subdivision,
        address: req.body.address, 
        municipality: req.body.municipality,
        votingTable: req.body.votingTable,
        votingStation: req.body.votingStation,
        votingPlace: req.body.votingPlace,
        leader: req.body.leader,
        positionLat: req.body.positionLat,
        positionLng: req.body.positionLng,   
        profession: req.body.profession,
        occupation: req.body.occupation,
        church: req.body.church,
        lgtbi: req.body.lgtbi,
        disability: req.body.disability,
        phone: req.body.phone,
        identification: req.body.identification,
        familyNumber: req.body.familyNumber
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
router.get('/count/profession/:userName',async(req, res) => {
    const userName = req.params.userName;
    const aggregatorOpts = [
        {$match : { userName: userName }},
        {$group: {_id: "$profession", count: { $sum: 1 }}
    }]
	var profession = await Affiliate.aggregate(aggregatorOpts).exec()
	res.json({
		profesions: profession
	});
});

 //countOccupation
 router.get('/count/occupation/:userName',async(req, res) => {
    const userName = req.params.userName;
    const aggregatorOpts = [
        {$match : { userName: userName }},
        {$group: {_id: "$occupation", count: { $sum: 1 }}
    }]
	var occupation = await Affiliate.aggregate(aggregatorOpts).exec()
	res.json({
		occupations: occupation
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