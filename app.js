const express = require('express');
const app = express();
const routePublic = require('./src/routes/public');
const routeAuth = require('./src/routes/auth');
const morgan = require('morgan');

const bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, DELETE, GET, POST, PATCH');
        res.status(200).send({});
    }

    next();
});

app.use("/", routePublic);
app.use("/auth", routeAuth);



module.exports = app;