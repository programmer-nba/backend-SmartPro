const express = require('express');
const router = express.Router();
const purchaseorder = require("../../controllers/purchaseorder/purchaseorder.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบเปรียบเทียบราคา
router.post('/',auth.sales,purchaseorder.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,purchaseorder.getall)

//ดึงข้อมูล ตาม id ลูกค้า
router.get("/byquotation/:id",auth.all,purchaseorder.getquotation)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,purchaseorder.getbyid)

//แก้ไขข้อมูลใบเปรียบเทียบราคา
router.put('/:id',auth.sales,purchaseorder.edit)

//ลบข้อมูลใบเปรียบเทียบราคา
router.delete('/:id',auth.sales,purchaseorder.delete)

module.exports = router;