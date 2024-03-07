const express = require('express');
const router = express.Router();
const productsupplier = require("../../controllers/supplier/productsupplier.controller")
const newAuth = require("../../authentication/newAuth")


//เพิ่ม productsupplier
router.post('/one/:id',newAuth.supplier,productsupplier.add)
//เพิ่มสินค้าที่ละเยอะๆๆ
router.post('/many/:id',newAuth.supplier,productsupplier.addmany)

//ดึงข้อมูลตาม  supplier_id
router.get('/byid/:id',newAuth.all,productsupplier.getbyid)

// แก้ไขข้อมูล productsupplier 
router.put('/:id',newAuth.supplier,productsupplier.edit)

// ลบข้อมูล productsupplier
router.delete('/:id',newAuth.supplier,productsupplier.delete)

module.exports = router;