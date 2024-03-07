const express = require('express');
const router = express.Router();
const producttype = require("../../controllers/product/producttype.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มประเภทสินค้า
router.post('/',newAuth.typeproduct,producttype.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,producttype.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,producttype.getbyid)

//แก้ไขข้อมูลประเภทสินค้า
router.put('/:id',newAuth.typeproduct,producttype.edit)

//ลบข้อมูลประเภทสินค้า
router.delete('/:id',newAuth.typeproduct,producttype.delete)

module.exports = router;