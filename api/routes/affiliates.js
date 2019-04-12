const express = require('express');
const router = express.Router();

const Affiliate = require('../models/affiliate');

//getAllAffiliates
router.get('/', async (req, res) => {
    const affiliate = await Affiliate.find();
    const count = affiliate.length; 
    res.status(200).json({
        Count: count,
        Items: affiliate
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
        commission: req.body.commission,
        noAffiliate: req.body.noAffiliate,
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
        commission: req.body.commission,
        noAffiliate: req.body.noAffiliate,
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

module.exports = router;