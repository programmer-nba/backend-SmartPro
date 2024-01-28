const express = require('express');
const router = express.Router();
const commission = require("../../controllers/information/commission.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มค่าคอมมิสชั่น
router.post('/',auth.verifyTokenadmin,commission.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,commission.getall)

// แก้ไขค่าคอมมิสชั่น
router.put('/:id',auth.verifyTokenadmin,commission.edit)

// ลบข้อมูลค่าคอมมิสชั่น
router.delete('/:id',auth.verifyTokenadmin,commission.delete)

module.exports = router;