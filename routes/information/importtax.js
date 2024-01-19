const express = require('express');
const router = express.Router();
const importtax = require("../../controllers/information/importtax.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มภาษีนำเข้า
router.post('/',auth.verifyTokenadmin,importtax.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,importtax.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,importtax.getbyid)

// แก้ไขภาษีนำเข้า
router.put('/:id',auth.verifyTokenadmin,importtax.edit)

// ลบข้อมูลภาษีนำเข้า
router.delete('/:id',auth.verifyTokenadmin,importtax.delete)

module.exports = router;