const express = require('express');
const router = express.Router();
const rate = require("../../controllers/Rate/Rate.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มเรท
router.post('/',newAuth.information,rate.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,rate.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,rate.getbyid)

// แก้ไขข้อมูลเรท 
router.put('/:id',newAuth.information,rate.edit)

// ลบข้อมูลเรท
router.delete('/:id',newAuth.information,rate.delete)

module.exports = router;