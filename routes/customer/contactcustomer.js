const express = require('express');
const router = express.Router();
const contactcustomer = require("../../controllers/customer/contactcustomer.controller")

const newAuth = require("../../authentication/newAuth")

//เพิ่มผู้ติดต่อ
router.post('/',newAuth.customer,contactcustomer.add)
//เพิ่มผู้ติดต่อจาก excel
router.post('/excel',newAuth.customer,contactcustomer.addexcel)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,contactcustomer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,contactcustomer.getbyid)

//ดึงข้อมูล by customer
router.get('/bycustomer/:id',newAuth.all,contactcustomer.getbycutomer)

//แก้ไขข้อมูลผู้ติดต่อ
router.put('/:id',newAuth.customer,contactcustomer.edit)

//ลบข้อมูลผู้ติดต่อ
router.delete('/:id',newAuth.customer,contactcustomer.delete)

//ดึงข้อมูล by sale_id

//ห้ามใช้ //เพิ่มข้อมูลเซลล์ที่เป็นคนเพิ่ม แต่ใช้แล้วจะ ลูกค้า ทุกคน จะเพิ่มด้วย แล้วเซลล์ที่ใช้ใน id
// router.post('/addsales',contactcustomer.edit_sale_id)

module.exports = router;