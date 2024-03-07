const express = require('express');
const router = express.Router();
const Supplier = require("../../controllers/supplier/supplier.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่ม supplier
router.post('/',newAuth.supplier,Supplier.add)
//เพิ่ม supplier จาก excel
router.post('/addexcel',newAuth.supplier,Supplier.addexcel)


//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,Supplier.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,Supplier.getbyid)

// แก้ไขข้อมูล supplier 
router.put('/:id',newAuth.supplier,Supplier.edit)

// ลบข้อมูล supplier
router.delete('/:id',newAuth.supplier,Supplier.delete)

//ดึงข้อมูลตาม by user_id
router.get('/byuserid/:id',newAuth.all,Supplier.getbyuserid)

//เพิ่มชื่อ user_id ใน supplier
// router.post('/adduserid/',Supplier.edit_user_id)

module.exports = router;