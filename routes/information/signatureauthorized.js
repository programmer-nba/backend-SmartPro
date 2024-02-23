const express = require('express');
const router = express.Router();
const signatureauthorized = require("../../controllers/information/signatureauthorized.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มลายเซ็นผู้ลงนาม
router.post('/',auth.verifyTokenadmin,signatureauthorized.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,signatureauthorized.getall)

// แก้ไขลายเซ็นผู้ลงนาม
router.put('/:id',auth.verifyTokenadmin,signatureauthorized.edit)

// ลบข้อมูลลายเซ็นผู้ลงนาม
router.delete('/:id',auth.verifyTokenadmin,signatureauthorized.delete)

module.exports = router;