const express = require('express');
const app = express();
const morgan = require('morgan');
const { mongoose } = require('./api/database/database');
const cors = require('cors');

//const bodyParser = require('body-parser');

const affiliateRoutes = require('./api/routes/affiliates'); 
const userRoutes = require('./api/routes/user'); 
const listMasterRoutes = require('./api/routes/listMaster'); 

app.use(morgan('dev')); 
app.use(express.json());
//app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json());
//app.use(cors());
app.use(cors({origin: 'http://localhost:4200'}));

//Routes
app.use('/affiliates', affiliateRoutes);
app.use('/user', userRoutes);
app.use('/listMaster', listMasterRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app; 