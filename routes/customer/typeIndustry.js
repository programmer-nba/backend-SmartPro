const express = require('express');
const router = express.Router();
const TypeIndustry = require("../../controllers/customer/typeIndustry.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มประเภทอุสาหกรรม
router.post('/',auth.all,TypeIndustry.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,TypeIndustry.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,TypeIndustry.getbyid)

// แก้ไขข้อมูล Typeofbusiness 
router.put('/:id',auth.all,TypeIndustry.edit)

// ลบข้อมูล Typeofbusiness
router.delete('/:id',auth.all,TypeIndustry.delete)

module.exports = router;