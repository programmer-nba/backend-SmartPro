const express = require('express');
const router = express.Router();
const Typeofbusinesscustomer = require("../../controllers/customer/typebusinesscustomer.controller")

const newAuth = require("../../authentication/newAuth")

//เพิ่มประเภทธุรกิจ
router.post('/',newAuth.typebusinesscustomer,Typeofbusinesscustomer.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,Typeofbusinesscustomer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,Typeofbusinesscustomer.getbyid)

// แก้ไขข้อมูล Typeofbusiness 
router.put('/:id',newAuth.typebusinesscustomer,Typeofbusinesscustomer.edit)

// ลบข้อมูล Typeofbusiness
router.delete('/:id',newAuth.typebusinesscustomer,Typeofbusinesscustomer.delete)

module.exports = router;