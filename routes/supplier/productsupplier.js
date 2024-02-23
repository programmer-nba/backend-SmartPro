const express = require('express');
const router = express.Router();
const productsupplier = require("../../controllers/supplier/productsupplier.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม productsupplier
router.post('/one/:id',auth.all,productsupplier.add)
//เพิ่มสินค้าที่ละเยอะๆๆ
router.post('/many/:id',auth.all,productsupplier.addmany)

//ดึงข้อมูลตาม  supplier_id
router.get('/byid/:id',auth.all,productsupplier.getbyid)

// แก้ไขข้อมูล productsupplier 
router.put('/:id',auth.all,productsupplier.edit)

// ลบข้อมูล productsupplier
router.delete('/:id',auth.all,productsupplier.delete)

module.exports = router;