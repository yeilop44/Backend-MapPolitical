const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

const AffiliateModel = require('../models/affiliate');

router.use(express.json());
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    //const error = new Error('Not found');
    //error.status = 404;
    next();
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const DIR = '/uploads';

var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        console.log("Este es el archivo: " + file.originalname + " mas tamaño: " + file.path);
        console.log(JSON.stringify(file));
        cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
    }
});

//let upload = multer({storage: storage});
let upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }

        callback(null, true);
    }
}).single('file');

router.post('/uploaddos', function(req, res) {
    console.log("Al menos ya llegué al post de uploaddos")
    var exceltojson; //Initialization
    upload(req,res,function(err){
        if(err){
            res.json({error_code:1,err_desc:err});
            return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            res.json({error_code:1,err_desc:"No file passed"});
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders:true
            }, function(err,result){
                if(err) {
                    return res.json({error_code:1,err_desc:err, data: null});
                }
                res.json({error_code:0,err_desc:null, data: result});
            });
        } catch (e){
            res.json({error_code:1,err_desc:"El archivo está corrupto o no contiene un formato aceptado."});
        }
    });
});

module.exports = router;
