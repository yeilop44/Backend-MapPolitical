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
        redNetworks: req.body.redNetworks,

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
                User: user,
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
                        req.session.user = user;                        
                        const usernameSession = req.session.user;
                        
                        res.status(200).json({
                            isLogged: true,
                            user: usernameSession,
                            passwordHash: user.password,
                            token: token                            
                        });
                    }else{
                        res.status(200).json({
                            isLogged: false,
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

//test sesion 
router.get('/session', async(req, res) => {
    if(req.session.user){
        req.session.cuenta = req.session.cuenta? req.session.cuenta + 1: 1;
        res.status(200).json({
            isLogged: true, 
            user: req.session.user,
            session: req.session.cuenta
        });
        }else{
        res.status(200).json({
            isLogged: false
        });        
        }
});

//logout
router.post('/logout', (req, res) => { 
    req.session.destroy((err) => {
        if(err){
            res.status(200).json({
                message: "error when logout",
                isLogout: false
            });
        }else{
            res.status(200).json({
                message: "session closed successfully",
                isLogout: true
            });
        }
     });
});

//change password
router.post('/changepass', async (req, res) => {
   
    var user = new User({
        userName: req.body.userName,
        password: req.body.currentpass                
    });
    
    var newpass = req.body.newpass;
    var newpassconfirm = req.body.newpassconfirm;   
   
   const userFind = await User.findOne({userName: user.userName});
   if(userFind){       
        await bcrypt.compare(user.password, userFind.password,  async (err, result) => {        
            if (result){
                console.log("la contraseña actual es correcta");
                if(newpass === newpassconfirm){
                    user.password = newpass;
                    bcrypt.hash(user.password, 10, async (err, data) => {
                        await User.updateOne({ _id: userFind._id },{$set:{password: data}}, {upsert:true});
                            res.status(200).json({                        
                            message: 'password chaneged sucessfull',
                            isChanged: true  

                            });
                    });                                        
                }else{
                    res.status(200).json({       
                        message: 'la contraseña nueva no coinciden',
                        isChanged: false

                    });
                }
            }else{
                res.status(200).json({                
                message: 'Incorrect current password',
                isChanged: false
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