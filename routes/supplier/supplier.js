const express = require('express');
const router = express.Router();
const Supplier = require("../../controllers/supplier/supplier.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม supplier
router.post('/',auth.sales,Supplier.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Supplier.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Supplier.getbyid)

// แก้ไขข้อมูล supplier 
router.put('/:id',auth.sales,Supplier.edit)

// ลบข้อมูล supplier
router.delete('/:id',auth.sales,Supplier.delete)

module.exports = router;