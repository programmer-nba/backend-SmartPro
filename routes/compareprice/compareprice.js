const express = require('express');
const router = express.Router();
const compareprice = require("../../controllers/compareprice/compareprice.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบเปรียบเทียบราคา ของ sale
router.post('/',auth.sales,compareprice.add)
//แก้ไขใบเปรียบเทียบราคา  ของ sale
router.put('/:id',auth.sales,compareprice.editsale)

//เพิ่มใบเปรียบเทียบราคา  ของ procurement
router.post('/procurement',auth.procurement,compareprice.addpro)

//แก้ไขใบเปรียบเทียบราคา  ของ procurement
router.put('/procurement/:id',auth.procurement,compareprice.editpro)

// //เพิ่มใบเปรียบเทียบราคา
// router.post('/',auth.sales,compareprice.add)

// //ดึงข้อมูลทั้งหมด
// router.get('/',auth.all,compareprice.getall)

// //ดึงข้อมูล ตาม id ลูกค้า
// router.get("/bycustomer/:id",auth.all,compareprice.getcustomer)

// //ดึงข้อมูล by id
// router.get('/byid/:id',auth.all,compareprice.getbyid)

// //แก้ไขข้อมูลใบเปรียบเทียบราคา
// router.put('/:id',auth.sales,compareprice.edit)

// //ลบข้อมูลใบเปรียบเทียบราคา
// router.delete('/:id',auth.sales,compareprice.delete)

module.exports = router;