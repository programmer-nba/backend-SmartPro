const express = require('express');
const router = express.Router();
const rate = require("../../controllers/Rate/Rate.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มเรท
router.post('/',auth.verifyTokenadmin,rate.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,rate.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,rate.getbyid)

// แก้ไขข้อมูลเรท 
router.put('/:id',auth.verifyTokenadmin,rate.edit)

// ลบข้อมูลเรท
router.delete('/:id',auth.verifyTokenadmin,rate.delete)

module.exports = router;