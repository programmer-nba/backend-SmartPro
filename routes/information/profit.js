const express = require('express');
const router = express.Router();
const Profit = require("../../controllers/information/profit.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มกำไร
router.post('/',auth.verifyTokenadmin,Profit.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Profit.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Profit.getbyid)

// แก้ไขกำไร
router.put('/:id',auth.verifyTokenadmin,Profit.edit)

// ลบข้อมูลกำไร
router.delete('/:id',auth.verifyTokenadmin,Profit.delete)

module.exports = router;