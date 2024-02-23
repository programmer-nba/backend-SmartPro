const express = require('express');
const router = express.Router();
const billingaccount = require("../../controllers/information/billingaccount.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มบัญชีธนาคารที่วางบิล
router.post('/',auth.verifyTokenadmin,billingaccount.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,billingaccount.getall)

// แก้ไขบัญชีธนาคารที่วางบิล
router.put('/:id',auth.verifyTokenadmin,billingaccount.edit)

// ลบข้อมูลบัญชีธนาคารที่วางบิล
router.delete('/:id',auth.verifyTokenadmin,billingaccount.delete)

module.exports = router;