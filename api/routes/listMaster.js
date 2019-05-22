const express = require('express');
const router = express.Router();

const ListMaster = require('../models/listMaster');

//post
router.post('/', async (req, res, next) => {
    
    const listMaster = new ListMaster({    
        type: req.body.type,
        name: req.body.name
    });
    await listMaster.save()
    res.status(200).json({
        message: "ListMaster Created",
        ListMaster: listMaster
    });
});

//getAll
router.get('/', async (req, res) => {

    const listMaster = await ListMaster.find();
    const count = listMaster.length; 
    res.status(200).json({
        Count: count,
        Items: listMaster
    });     
});

module.exports = router;