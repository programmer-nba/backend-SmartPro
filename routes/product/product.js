const express = require('express');
const router = express.Router();
const product = require("../../controllers/product/product.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มสินค้า
router.post('/',newAuth.supplier,product.add)

//เพิ่มสินค้าจาก excel
router.post('/addexcel',newAuth.supplier,product.addexcel)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,product.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,product.getbyid)
//ดึงข้อมูล by supplier
router.get('/bysupplier/:id',newAuth.all,product.getbysupplier)
//แก้ไขข้อมูลสินค้า
router.put('/:id',newAuth.supplier,product.edit)

//ลบข้อมูลสินค้า
router.delete('/:id',newAuth.supplier,product.delete)

router.put("/image/:id",newAuth.supplier,product.addimage)
router.put("/spec/:id",newAuth.supplier,product.addspec)

module.exports = router;