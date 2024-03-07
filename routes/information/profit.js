const express = require('express');
const router = express.Router();
const Profit = require("../../controllers/information/profit.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มกำไร
router.post('/',newAuth.information,Profit.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,Profit.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,Profit.getbyid)

// แก้ไขกำไร
router.put('/:id',newAuth.information,Profit.edit)

// ลบข้อมูลกำไร
router.delete('/:id',newAuth.information,Profit.delete)

module.exports = router;