const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt');

const User = require('../models/user');

//Sign Up
router.post('/signup', async (req, res) => {

     var user = new User({
        userName: req.body.userName,
        password: req.body.password,
        names: req.body.names,
        surnames: req.body.surnames,
        position: req.body.position,
        place: req.body.place,
        positionLat: req.body.positionLat,
        positionLng: req.body.positionLng,

    });

    
    const userFind = await User.findOne({userName: user.userName});
    if(userFind){
        console.log("user exist");
        res.status(400).json({
            message: "User Exist",
            User: user.userName
        }); 
    }else{
        bcrypt.hash(user.password, 10, async (err, data) => {
            user.password = data;
            await user.save()
            console.log(user.password);
            console.log("user created");
            res.status(200).json({
                message: "User Created",
                User: user.userName,
                password: user.password
            }); 
        });
        
    }  
        
});

//Sign In
router.post('/signin', async (req, res) => {
    try {
        var userName = req.body.userName
        var password = req.body.password    
        const user = await User.findOne({userName:userName});
        console.log(user); 
        if(!user){
            res.status(401).json({
                message: 'Incorrect user or password'  
            });
        }else{
            try {
                await bcrypt.compare(password, user.password,  (err, result) => {
                    if(err) throw err; 
                    if (result){
                        const token = jwt.sign({ user }, 'my_secret_key', { expiresIn: "1h" });
                        res.status(200).json({
                            ok: 'true',
                            User: user.userName,
                            passwordHash: user.password,
                            token: token                            
                        });
                    }else{
                        res.status(401).json({
                        ok: 'false',
                        message: 'Incorrect password'  
                        });    
                    }
                })
         
            } catch (error) {
                console.log(error);
                res.status(500).send(`something wen't wrong`);
            }                       
        }
    } catch (error) {
        console.log(error);
        res.status(500).send(`something wen't wrong`);
    }    
});

//change password
router.post('/changepass', async (req, res) => {
   
    var username =  req.body.userName;
    var currentpass =  req.body.currentpass;
    var newpass = req.body.newpass;
    var newpassconfirm = req.body.newpassconfirm;   
   
   const userFind = await User.findOne({userName: username});
   if(userFind){       
        await bcrypt.compare(currentpass, userFind.password,  (err, result) => {        
            if (result){
                console.log("la contraseña actual es correcta");
                if(newpass === newpassconfirm){
                    var user = new User({
                        userName = username,
                        password = newpas                
                    });
                    await user.save();
                    res.status(200).json({                        
                        message: 'password chaneged sucessfull'  
                    });
                }else{
                    res.status(401).json({       
                        message: 'la contraseña nueva no coinciden'  
                    });

                }
            }else{
                res.status(401).json({
                ok: 'false',
                message: 'Incorrect currente password'  
                });    
            }
        });  
   }else{ 
        res.status(401).json({       
            message: 'No existe el usuario'  
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