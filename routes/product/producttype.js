const express = require('express');
const router = express.Router();
const producttype = require("../../controllers/product/producttype.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มประเภทสินค้า
router.post('/',auth.sales,producttype.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,producttype.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,producttype.getbyid)

//แก้ไขข้อมูลประเภทสินค้า
router.put('/:id',auth.sales,producttype.edit)

//ลบข้อมูลประเภทสินค้า
router.delete('/:id',auth.sales,producttype.delete)

module.exports = router;