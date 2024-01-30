const express = require('express');
const router = express.Router();
const suppliershipping = require("../../controllers/supplier/suppliershipping.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม suppliershipping
router.post('/',auth.sales,suppliershipping.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,suppliershipping.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,suppliershipping.getbyid)

// แก้ไขข้อมูล suppliershipping 
router.put('/:id',auth.sales,suppliershipping.edit)

// ลบข้อมูล suppliershipping
router.delete('/:id',auth.sales,suppliershipping.delete)

module.exports = router;