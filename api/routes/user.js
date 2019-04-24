const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');

//Sign Up
router.post('/signup', async (req, res) => {
    var isExist;
    const user = new User({
        email: req.body.email,
        password: req.body.password
    });

    const userDB = await User.find();
    for(let i=0; i<userDB.length; i++){
        if(userDB[i].email == user.email){
            isExist = true
        }else{
            isExist = false;
        }
    }
    
    if(isExist){
        res.status(400).json({
            message: "User Exist",
            User: user.email
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
    
    var email = req.body.email
    var password = req.body.password
    
    const user = await User.find({email:email, password:password});
     if( user.length == 0 || user == null ){
        res.status(401).json({
            message: 'Incorrect user or password XXXXXX'  
        });
     }else{
        const token = jwt.sign({ user }, 'my_secret_key', { expiresIn: "1h" });
        res.status(200).json({
            ok: 'true',
            User: user,
            token: token
        });
     }
});

//getAllUsers
router.get('/', ensureToken, async (req, res) => {
    const user = await User.find();
    const count = user.length;
    var userEmail =[];
    
    for(let i=0; i<user.length; i++){
        userEmail.push(user[i].email);
    }
   
    res.status(200).json({
        Count: count,
        Users: userEmail
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