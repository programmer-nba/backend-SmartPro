const express = require('express');
const router = express.Router();
const quotationsupplier = require("../../controllers/quotationsupplier/quotationsupplier.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบเสนอราคา
router.post('/',auth.sales,quotationsupplier.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,quotationsupplier.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,quotationsupplier.getbyid)
//ดึงข้อมูล by supplier
router.get('/bysupplier/:id',auth.all,quotationsupplier.getbysupplier)
//แก้ไขข้อมูลใบเสนอราคา
router.put('/:id',auth.sales,quotationsupplier.edit)

//ลบข้อมูลใบเสนอราคา
router.delete('/:id',auth.sales,quotationsupplier.delete)
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    
router.put("/quotationfile/:id",auth.sales,quotationsupplier.addfilequotation)
router.put("/email/:id",auth.sales,quotationsupplier.addfileemail)

router.get("/allproduct/",auth.all,quotationsupplier.getbyproduct)
module.exports = router;