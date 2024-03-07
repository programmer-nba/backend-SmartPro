const express = require('express');
const router = express.Router();
const position = require("../../controllers/position/position.crotroller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มตำแหน่ง
router.post('/',newAuth.setposition,position.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,position.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,position.getbyid)

//แก้ไขข้อมูลลูกค้า
router.put('/:id',newAuth.setposition,position.edit)

//ลบข้อมูลลูกค้า
router.delete('/:id',newAuth.setposition,position.delete)

module.exports = router;