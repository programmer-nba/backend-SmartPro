const express = require('express');
const router = express.Router();
const quotation = require("../../controllers/quotation/quotation.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มใบเสนอราคา
router.post('/',newAuth.quotation,quotation.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,quotation.getall)

//ดึงข้อมูล ตาม id ลูกค้า
router.get("/bycustomer/:id",newAuth.all,quotation.getcustomer)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,quotation.getbyid)

//แก้ไขข้อมูลใบเสนอราคา
router.put('/:id',newAuth.quotation,quotation.edit)

//ลบข้อมูลใบเสนอราคา
router.delete('/:id',newAuth.quotation,quotation.delete)

//admin อนุมัติ
router.put("/admin/accept/:id",newAuth.managerquotation,quotation.accept)

// //ดึงข้อมูลเฉพาะ ที่ admin อนุมัติให้ออกใบแล้ว
// router.get("/getaccept/",auth.all,quotation.getaccept)

// //เดลงานผ่าน
// router.put("/deal/accept/:id",auth.sales,quotation.acceptdeal)
// //เดลงานไม่ผ่าน
// router.put("/deal/unaccept/:id",auth.sales,quotation.unacceptdeal)

// //ดึงข้อมูลที่ดีลงานผ่าน 
// router.get("/po/",auth.all,quotation.getquotationtopo)
module.exports = router;