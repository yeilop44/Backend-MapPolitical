const express = require('express');
const router = express.Router();

const Profession = require('../models/profession');

//postProfession
router.post('/', async (req, res, next) => {
    
    const profession = new Profession({    
        name: req.body.name
    });
    await profession.save()
    res.status(200).json({
        message: "Profession Created",
        Profession: profession
    });
});

//getAllProfessions
router.get('/', async (req, res) => {

    const profession = await Profession.find();
    const count = profession.length; 
    res.status(200).json({
        Count: count,
        Items: profession
    });     
});
