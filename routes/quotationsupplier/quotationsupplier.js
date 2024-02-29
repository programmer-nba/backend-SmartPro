const express = require('express');
const router = express.Router();
const quotationsupplier = require("../../controllers/quotationsupplier/quotationsupplier.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบเสนอราคา
router.post('/',auth.all,quotationsupplier.add)
//เพิ่มใบเสนอราคา จาก excel
router.post('/addexcel',auth.all,quotationsupplier.addexcel)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,quotationsupplier.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,quotationsupplier.getbyid)
//ดึงข้อมูล by supplier
router.get('/bysupplier/:id',auth.all,quotationsupplier.getbysupplier)
//แก้ไขข้อมูลใบเสนอราคา
router.put('/:id',auth.all,quotationsupplier.edit)

//ลบข้อมูลใบเสนอราคา
router.delete('/:id',auth.all,quotationsupplier.delete)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
router.put("/quotationfile/:id",auth.all,quotationsupplier.addfilequotation)
router.put("/email/:id",auth.all,quotationsupplier.addfileemail)
//ดึงใบเสนอราคา supplier และ product มาด้วย
router.get("/allproduct/",auth.all,quotationsupplier.getbyproduct)
//
router.get("/getbysupplierproduct/:id",auth.all,quotationsupplier.getbysupplierproduct);
module.exports = router;