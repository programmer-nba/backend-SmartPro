const express = require('express');
const router = express.Router();
const supplierimporttax = require("../../controllers/supplier/supplierimporttax.controller")
const auth = require("../../authentication/userAuth")

//เพิ่ม supplierimporttax
router.post('/',auth.sales,supplierimporttax.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,supplierimporttax.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,supplierimporttax.getbyid)

// แก้ไขข้อมูล supplierimporttax 
router.put('/:id',auth.sales,supplierimporttax.edit)

// ลบข้อมูล supplierimporttax
router.delete('/:id',auth.sales,supplierimporttax.delete)

module.exports = router;