const express = require('express');
const router = express.Router();
const brand = require("../../controllers/product/brand.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม brand
router.post('/',auth.sales,brand.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,brand.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,brand.getbyid)

// แก้ไขข้อมูล brand 
router.put('/:id',auth.sales,brand.edit)

// ลบข้อมูล brand
router.delete('/:id',auth.sales,brand.delete)

module.exports = router;