const express = require('express');
const router = express.Router();
const contactcustomer = require("../../controllers/customer/contactcustomer.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มผู้ติดต่อ
router.post('/',auth.sales,contactcustomer.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,contactcustomer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,contactcustomer.getbyid)

//ดึงข้อมูล by customer
router.get('/bycustomer/:id',auth.all,contactcustomer.getbycutomer)

//แก้ไขข้อมูลผู้ติดต่อ
router.put('/:id',auth.sales,contactcustomer.edit)

//ลบข้อมูลผู้ติดต่อ
router.delete('/:id',auth.sales,contactcustomer.delete)

module.exports = router;