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

//ประเภทสินค้า
app.use(prefix+'/producttype',require("./routes/product/producttype"))
//สินค้า
app.use(prefix+'/product',require("./routes/product/product"))
//ลูกค้า
app.use(prefix+'/customer',require("./routes/customer/customer"))
// supplier ผู้จัดหาสินค้า
app.use(prefix+'/supplier',require("./routes/supplier/supplier"))
// product supplier เพิ่มสินค้าของผู้จัดหาสินค้า
app.use(prefix+'/productsupplier',require("./routes/supplier/productsupplier"))
// ทำใบเปรียบเทียบราคา
app.use(prefix+'/compareprice',require("./routes/compareprice/compareprice"))
//ใบเสนอราคา
app.use(prefix+'/quotation',require("./routes/quotation/quotation"))

// Rate เรท
app.use(prefix+'/rate',require("./routes/Rate/Rate"))
//ประเภทธุรกิจ
app.use(prefix+'/typeofbusiness',require("./routes/supplier/typeofbusiness"))
// กำไร
app.use(prefix+'/profit',require("./routes/information/profit"))
// ใบสั่งซื้อ
app.use(prefix+'/purchaseorder',require("./routes/purchaseorder/purchaseorder"))
// ออเดอร์
app.use(prefix+"/order",require("./routes/order/order"))
//ใบเสนอราคาของ supplier 
app.use(prefix+'/quotationsupplier',require("./routes/quotationsupplier/quotationsupplier"))
//ประเภทธุรกิจของลูกค้า
app.use(prefix+'/typebusinesscustomer',require("./routes/customer/typebusinesscustomer"))
//ประเภทอุสาหกรรม
app.use(prefix+'/typelndustry',require("./routes/customer/typeIndustry"))
//ผู้ติดต่อ
app.use(prefix+'/contactcustomer',require("./routes/customer/contactcustomer"))
//รีพอร์ท 
app.use(prefix+'/report',require("./routes/report/report"))

//ค่าคอมมิสชั่น
app.use(prefix+'/commission',require("./routes/information/commission"))

//เคลมสินค้า
app.use(prefix+"/insurance",require("./routes/Insurance/Insurance"))
// ใบแจ้งหนี้ และ วางบิล
app.use(prefix+"/invoice",require("./routes/invoice/invoice"))

// เงินกู้
app.use(prefix+"/loan",require("./routes/loan/loan"))

// บัญชีธนาคารที่วางบิล
app.use(prefix+"/billingaccount",require("./routes/information/billingaccount"))

//เพิ่มลายเซ็นผู้ลงนาม
app.use(prefix+"/signatureauthorized",require("./routes/information/signatureauthorized"))

//ใบส่งของ
app.use(prefix+"/deliverynote",require("./routes/deliverynote/deliverynote"))

//postion ตำแหน่ง
app.use(prefix+"/position",require("./routes/position/position"))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // หรือกำหนด origin ที่เฉพาะเจาะจง
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
const port = process.env.PORT || 3252;
app.listen(port, console.log(`Listening on port ${port}`));
