const express = require('express');
const router = express.Router();
const product = require("../../controllers/product/product.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มสินค้า
router.post('/',auth.sales,product.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,product.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,product.getbyid)

//แก้ไขข้อมูลสินค้า
router.put('/:id',auth.sales,product.edit)

//ลบข้อมูลสินค้า
router.delete('/:id',auth.sales,product.delete)

module.exports = router;