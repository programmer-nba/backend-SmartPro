var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cor = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

process.env.TZ='UTC'
var app = express();
//เชื่ิอมdatabase
const urldatabase =process.env.ATLAS_MONGODB
mongoose.Promise = global.Promise
mongoose.connect(urldatabase).then(()=>console.log("connect")).catch((err)=>console.error(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cor())
//router
const prefix = '/v1/Backend-Smartpro'
app.use(prefix+'/', require('./routes/index'));
//ผู้ใช้งาน
app.use(prefix+'/user',require('./routes/user/user'))
//ล็อคอิน
app.use(prefix+'/login',require('./routes/user/login'))
// supplier ผู้จัดหาสินค้า
app.use(prefix+'/supplier',require("./routes/supplier/supplier"))


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // หรือกำหนด origin ที่เฉพาะเจาะจง
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
const port = process.env.PORT || 3252;
app.listen(port, console.log(`Listening on port ${port}`));
