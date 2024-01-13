const express = require('express');
const router = express.Router();
const quotation = require("../../controllers/quotation/quotation.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบเปรียบเทียบราคา
router.post('/',auth.sales,quotation.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,quotation.getall)

//ดึงข้อมูล ตาม id ลูกค้า
router.get("/bycustomer/:id",auth.all,quotation.getcustomer)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,quotation.getbyid)

//แก้ไขข้อมูลใบเปรียบเทียบราคา
router.put('/:id',auth.sales,quotation.edit)

//ลบข้อมูลใบเปรียบเทียบราคา
router.delete('/:id',auth.sales,quotation.delete)

//admin อนุมัติ
router.put("/admin/accept",auth.verifyTokenadmin,quotation.accept)

module.exports = router;