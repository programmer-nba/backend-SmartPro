const express = require('express');
const router = express.Router();
const Typeofbusiness = require("../../controllers/supplier/typeofbusiness.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มประเภทธุรกิจ
router.post('/',auth.all,Typeofbusiness.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Typeofbusiness.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Typeofbusiness.getbyid)

// แก้ไขข้อมูล Typeofbusiness 
router.put('/:id',auth.all,Typeofbusiness.edit)

// ลบข้อมูล Typeofbusiness
router.delete('/:id',auth.all,Typeofbusiness.delete)

module.exports = router;