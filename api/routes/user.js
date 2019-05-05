const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Sign Up
router.post('/signup', async (req, res) => {
    var isExist;
    const user = new User({
        userName: req.body.userName,
        password: req.body.password,
        names: req.body.names,
        surnames: req.body.surnames,
        position: req.body.position,
        place: req.body.place,
        positionLat: req.body.positionLat,
        positionLng: req.body.positionLng,

    });

    const userDB = await User.find();
    for(let i=0; i<userDB.length; i++){
        if(userDB[i].userName == user.userName){
            isExist = true
        }else{
            isExist = false;
        }
    }
    
    if(isExist){
        res.status(400).json({
            message: "User Exist",
            User: user.userName
        }); 
    }else{
        await user.save()
        res.status(200).json({
            message: "User Created",
            User: user
        }); 
    }  
        
});

//Sign In
router.post('/signin', async (req, res) => {
    
    var userName = req.body.userName
    var password = req.body.password
    
    const user = await User.find({userName:userName, password:password});
     if( user.length == 0 || user == null ){
        res.status(401).json({
            message: 'Incorrect user or password XXXXXX'  
        });
     }else{
        const token = jwt.sign({ user }, 'my_secret_key', { expiresIn: "1h" });
        res.status(200).json({
            ok: 'true',
            User: user[0].userName,
            token: token
        });
     }
});

//getAllUsers
router.get('/', async (req, res) => {
    
    const user = await User.find();
    const count = user.length;

    res.status(200).json({
        Count: count,
        Users: user
    });
       
});

//getAllUserByUserName
router.get('/:userName', async (req, res) => {
    const userName = req.params.userName;
    const user = await User.find({userName: userName});
    const count = user.length;

    res.status(200).json({
        Count: count,
        User: user
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