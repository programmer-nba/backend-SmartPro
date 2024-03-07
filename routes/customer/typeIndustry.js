const express = require('express');
const router = express.Router();
const TypeIndustry = require("../../controllers/customer/typeIndustry.controller")

const newAuth = require("../../authentication/newAuth")
//เพิ่มประเภทอุสาหกรรม
router.post('/',newAuth.typelndustry,TypeIndustry.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,TypeIndustry.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,TypeIndustry.getbyid)

// แก้ไขข้อมูลประเภทอุสาหกรรม
router.put('/:id',newAuth.typelndustry,TypeIndustry.edit)

// ลบข้อมูลประเภทอุสาหกรรม
router.delete('/:id',newAuth.typelndustry,TypeIndustry.delete)

module.exports = router;