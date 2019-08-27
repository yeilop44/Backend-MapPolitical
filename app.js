const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const morgan = require('morgan');
const { mongoose } = require('./api/database/database');
const mongoosedos = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const orderedFlag = 1;
const batchSize = 100000;

//const bodyParser = require('body-parser');

const affiliateRoutes = require('./api/routes/affiliates'); 
const commitmentRoutes = require('./api/routes/commitment'); 
const userRoutes = require('./api/routes/user'); 
const listMasterRoutes = require('./api/routes/listMaster'); 
const electoralMasterRoutes = require('./api/routes/electoralMaster'); 
const geographyMasterRoutes = require('./api/routes/geographyMaster'); 
const divipolMasterRoutes = require('./api/routes/divipolMaster');
const commitmentMasterRoutes = require('./api/routes/commitmentMaster');
const uploadDos = require('./api/routes/uploadApi');
const Affiliate = require('./api/models/affiliate');

app.use(morgan('dev')); 
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//app.use(cors());
app.use(cors({origin: 'http://mappoliticalfrontend-env.semmrdp3zc.us-east-2.elasticbeanstalk.com', credentials: true}));
app.use(session({ 
    secret: 'keyboard cat', 
    resave: true, 
    saveUninitialized: true,
    cookie: { secure: false } 
 }));
//app.use(cors({origin: 'http://localhost:4200'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    const error = new Error('Not found');
    error.status = 404;
    next();
}); 

//Routes
app.use('/affiliates', affiliateRoutes);
app.use('/commitments', commitmentRoutes);
app.use('/user', userRoutes);
app.use('/listMaster', listMasterRoutes);
app.use('/electoralMaster', electoralMasterRoutes);
app.use('/geographyMaster', geographyMasterRoutes);
app.use('/divipolMaster', divipolMasterRoutes);
app.use('/commitmentMaster', commitmentMasterRoutes);
app.use('/uploadApi', uploadDos);


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

const DIR = './uploads';

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
            return callback(new Error('La extensión del archivo no es correcta. Sólo se permite cargar archivos excel.'));
        }

        callback(null, true);
    }
}).single('file');

app.post('/upload', function(req, res) {
    console.log("Al menos ya llegué al post");
    var exceltojson; //Initialization
    upload(req,res,function(err){
        if(err){
            console.log("Esto está generando error");
            res.json({error_code:1,err_desc:err.toString()});
            return;
        }
        /** Multer gives us file info in req.file object */
        if(!req.file){
            console.log("Esto también está generando error");
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

        try
        {
            exceltojson({
                input: req.file.path, //la misma ruta en la que acabamos de cargar el archivo
                output: null, //null cuando no necesitamos generar una salida en archivo json
                lowerCaseHeaders:false
            }, function(err,result){
                if(err) {
                    console.log("Imaginate que estoy en este err...")
                    return res.json({error_code:1,err_desc:err, data: null});
                }

                var i = 0;
                var j = 0;
                var arr = new Array();
                var errores = "";
                for( var contacto in result )
                {
                    i++;
                    j++;

                    arr.push( new Affiliate(result[contacto]) );

                    if ( (i === batchSize) || (j === result.length))
                    {
                        try
                        {
                            console.log("Insertando registros cuando i="+i + " y arr=" + arr.length + ", y j="+j)
                            i = 0;
                            Affiliate.insertMany(arr, function(error, docs) {
                                arr = new Array();
                                if(error){
                                    //console.log("JOder... hubo errores!!!" + error.message);
                                    //errores = error.message;
                                    //console.log(JSON.stringify(errores, null, 4));
                                    return res.json({error_code:1,err_desc:error.message, data: null});
                                }
                                else{
                                    if(j === result.length){
                                        return res.json({error_code:0,err_desc:null, data: null, message:"El archivo ha sido cargado exitosamente!"});
                                    }
                                }
                            });
                        }
                        catch (e)
                        {
                            console.log("AHORA ESTOY EN EL CATCH")
                            print(e);
                        }

                    }
                }
                /*console.log("Errores: " + errores);
                if(errores !== "" && typeof errores !== "undefined"){
                    res.json({error_code:1,err_desc:errores.message, data: null})
                }
                else{
                    res.json({error_code:0,err_desc:null, data: null, message:"El archivo ha sido cargado exitosamente."})
                }*/

            });
        } catch (e){
            console.log("Estoy en el otro catch")
            res.json({error_code:1,err_desc:"El archivo está corrupto o no contiene un formato válido."});
        }
    });
});

module.exports = app; 
