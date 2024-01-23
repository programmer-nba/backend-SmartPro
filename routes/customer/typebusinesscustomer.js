const express = require('express');
const router = express.Router();
const Typeofbusinesscustomer = require("../../controllers/customer/typebusinesscustomer.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มประเภทธุรกิจ
router.post('/',auth.all,Typeofbusinesscustomer.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Typeofbusinesscustomer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Typeofbusinesscustomer.getbyid)

// แก้ไขข้อมูล Typeofbusiness 
router.put('/:id',auth.all,Typeofbusinesscustomer.edit)

// ลบข้อมูล Typeofbusiness
router.delete('/:id',auth.all,Typeofbusinesscustomer.delete)

module.exports = router;