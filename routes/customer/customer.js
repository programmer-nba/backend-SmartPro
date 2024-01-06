const express = require('express');
const router = express.Router();
const customer = require("../../controllers/customer/customer.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มลูกค้า
router.post('/',auth.sales,customer.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,customer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,customer.getbyid)

//แก้ไขข้อมูลลูกค้า
router.put('/:id',auth.sales,customer.edit)

//ลบข้อมูลลูกค้า
router.delete('/:id',auth.sales,customer.delete)

module.exports = router;