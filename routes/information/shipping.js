const express = require('express');
const router = express.Router();
const shipping = require("../../controllers/information/shipping.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มภาษีนำเข้า
router.post('/',auth.verifyTokenadmin,shipping.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,shipping.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,shipping.getbyid)

// แก้ไขภาษีนำเข้า
router.put('/:id',auth.verifyTokenadmin,shipping.edit)

// ลบข้อมูลภาษีนำเข้า
router.delete('/:id',auth.verifyTokenadmin,shipping.delete)

module.exports = router;