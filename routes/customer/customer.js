const express = require('express');
const router = express.Router();
const customer = require("../../controllers/customer/customer.controller")

const newAuth = require("../../authentication/newAuth")

//เพิ่มลูกค้า
router.post('/',newAuth.customer,customer.add)
//เพิ่มลูกค้าจาก excel
router.post('/excel',newAuth.customer,customer.addexcel)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,customer.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,customer.getbyid)

//แก้ไขข้อมูลลูกค้า
router.put('/:id',newAuth.customer,customer.edit)

//ลบข้อมูลลูกค้า
router.delete('/:id',newAuth.customer,customer.delete)

//ดึงข้อมูล by sale_id
router.get('/bysaleid/:id',newAuth.all,customer.getbysaleid)

//ห้ามใช้ //เพิ่มข้อมูลเซลล์ที่เป็นคนเพิ่ม แต่ใช้แล้วจะ ลูกค้า ทุกคน จะเพิ่มด้วย แล้วเซลล์ที่ใช้ใน id
// router.post('/addsales',customer.edit_sale_id)

module.exports = router;