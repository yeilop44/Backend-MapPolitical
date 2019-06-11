const express = require('express');
const router = express.Router();

const GeographyMaster = require('../models/geographyMaster');

//post
router.post('/', async (req, res, next) => {
    
    const geographyMaster = new GeographyMaster({    
        userName: req.body.userName,
        state: req.body.state,
        municipality: req.body.municipality,
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

//put
router.put('/:geographyId', async (req, res) => {
    
    const { geographyId } = req.params;
	const geographyMaster = {
        userName: req.body.userName,       
        state: req.body.state,
        municipality: req.body.municipality,  
        zone: req.body.zone,
        subdivision: req.body.subdivision,                      
	}

	await GeographyMaster.findByIdAndUpdate(geographyId, {$set: geographyMaster}, {new: true});
    res.status(200).json({
        message: 'Updated geogaphy',
        Affiliate: geographyMaster
    });
 });

 //delete
 router.delete('/:geographyId', async (req, res) => {
    await GeographyMaster.findByIdAndRemove(req.params.geographyId);
    res.status(200).json({
        message: 'Deleted geography'
    });
 });


module.exports = router;