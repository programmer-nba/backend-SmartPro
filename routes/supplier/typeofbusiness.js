const express = require('express');
const router = express.Router();
const Typeofbusiness = require("../../controllers/supplier/typeofbusiness.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มประเภทธุรกิจ
router.post('/',newAuth.typebusiness,Typeofbusiness.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,Typeofbusiness.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,Typeofbusiness.getbyid)

// แก้ไขข้อมูล Typeofbusiness 
router.put('/:id',newAuth.typebusiness,Typeofbusiness.edit)

// ลบข้อมูล Typeofbusiness
router.delete('/:id',newAuth.typebusiness,Typeofbusiness.delete)

module.exports = router;