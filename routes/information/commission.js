const express = require('express');
const router = express.Router();
const commission = require("../../controllers/information/commission.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มค่าคอมมิสชั่น
router.post('/',newAuth.information,commission.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,commission.getall)

// แก้ไขค่าคอมมิสชั่น
router.put('/:id',newAuth.information,commission.edit)

// ลบข้อมูลค่าคอมมิสชั่น
router.delete('/:id',newAuth.information,commission.delete)

module.exports = router;