const express = require('express');
const router = express.Router();
const Supplier = require("../../controllers/supplier/supplier.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม supplier
router.post('/',auth.all,Supplier.add)
//เพิ่ม supplier จาก excel
router.post('/addexcel',auth.all,Supplier.addexcel)


//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Supplier.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Supplier.getbyid)

// แก้ไขข้อมูล supplier 
router.put('/:id',auth.all,Supplier.edit)

// ลบข้อมูล supplier
router.delete('/:id',auth.all,Supplier.delete)

//ดึงข้อมูลตาม by user_id
router.get('/byuserid/:id',auth.all,Supplier.getbyuserid)

//เพิ่มชื่อ user_id ใน supplier
// router.post('/adduserid/',Supplier.edit_user_id)

module.exports = router;