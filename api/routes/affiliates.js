const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const paginate = require('jw-paginate');

const Affiliate = require('../models/affiliate');
const { userSession } = require('./user');

//getAllAffiliates
/*router.get('/', ensureToken, (req, res) => {
    
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
});*/

router.get('/',  async (req, res) => {    
    if(!req.session.user){
        res.send(`no logeado ${req.session.user}`)
    }else{
        req.session.cuenta = req.session.cuenta? req.session.cuenta +1: 1;
        var y = req.session.user;
        var x = req.session.cuenta;
        const affiliate = await Affiliate.find();
        const count = affiliate.length; 
        res.status(200).json({
            session: x,
            user: y,
            Count: count,         
            Items: affiliate
        });
    }      
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
        state: req.body.state,
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
        affiliate: affiliate
    });
});

//getAffiliatesByUser

router.get('/:userName',async (req, res) => {   
     
    const userName = req.params.userName;
    const affiliate = await Affiliate.find({userName: userName});
    const count = affiliate.length; 
    res.status(200).json({                
        count: count,
        affiliates: affiliate            
    });       
});

router.get('/:userName',async (req, res) => {

    const userName = req.params.userName;
    const affiliate = await Affiliate.find({userName: userName});
    const count = affiliate.length;
    res.status(200).json({
        count: count,
        affiliates: affiliate
    });
});


//getAffiliatesByUserPaginated

router.get('/:userName/:page',async (req, res) => {
    const userName = req.params.userName;
    const affiliate = await Affiliate.find({userName: userName});
    const count = affiliate.length;

    //const items = [...Array(150).keys()].map(i => ({ id: (i + 1), name: 'Item ' + (i + 1) }));

    const page = parseInt(req.params.page) || 1;
    const pageSize = 10;
    const pager = paginate(affiliate.length, page, pageSize);
    const pageOfItems = affiliate.slice(pager.startIndex, pager.endIndex + 1);
    //return res.json({ pager, pageOfItems });

    res.status(200).json({
         message: 'Found Affiliates',
         Count: count,
         Affiliates: affiliate,
         pager,
         pageOfItems
    });
});

 
//putAffiliate
router.put('/:affiliateId', async (req, res) => {
    
    const { affiliateId } = req.params;
	const affiliate = {
    	userName: req.body.userName,
        birthdate: req.body.birthdate,
        names: req.body.names,
        surnames: req.body.surnames,
        sex: req.body.sex,
        zone: req.body.zone,
        subdivision: req.body.subdivision,
        address: req.body.address, 
        state: req.body.state,
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
        affiliate: affiliate
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
         affiliates: affiliate
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
 router.get('/count/occupation/:userName', async(req, res) => {
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

 //countZone
 router.get('/count/zone/:userName', async(req, res) => {
    const userName = req.params.userName;
    const aggregatorOpts = [
        {$match : { userName: userName }},
        {$group: {_id: "$zone", count: { $sum: 1 }}
    }]
	var zone = await Affiliate.aggregate(aggregatorOpts).exec()
	res.json({
		zones: zone
	});
}); 
 
//countSubdivision
router.get('/count/subdivision/:userName', async(req, res) => {
    const userName = req.params.userName;
    const aggregatorOpts = [
        {$match : { userName: userName }},
        {$group: {_id: "$subdivision", count: { $sum: 1 }}
    }]
	var subdivision = await Affiliate.aggregate(aggregatorOpts).exec()
	res.json({
		subdivisions: subdivision
	});
}); 

//getAffiliatesByLeader
router.get('/:userName/leader/:leader',async (req, res) => {
    const userName = req.params.userName;
    const leader = req.params.leader;
    const affiliate = await Affiliate.find({userName: userName, leader: leader});
    const count = affiliate.length; 
    if(affiliate){
        res.status(200).json({         
            Count: count,
            Affiliates: affiliate
        });    
    }else {
        res.status(200).json({         
            message: "no found references"
        }); 
    }
    
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
