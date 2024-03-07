const express = require('express');
const router = express.Router();
const signatureauthorized = require("../../controllers/information/signatureauthorized.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มลายเซ็นผู้ลงนาม
router.post('/',newAuth.information,signatureauthorized.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,signatureauthorized.getall)

// แก้ไขลายเซ็นผู้ลงนาม
router.put('/:id',newAuth.information,signatureauthorized.edit)

// ลบข้อมูลลายเซ็นผู้ลงนาม
router.delete('/:id',newAuth.information,signatureauthorized.delete)

module.exports = router;