const express = require('express');
const router = express.Router();
const billingaccount = require("../../controllers/information/billingaccount.controller")
const newAuth = require("../../authentication/newAuth")

//เพิ่มบัญชีธนาคารที่วางบิล
router.post('/',newAuth.information,billingaccount.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,billingaccount.getall)

// แก้ไขบัญชีธนาคารที่วางบิล
router.put('/:id',newAuth.information,billingaccount.edit)

// ลบข้อมูลบัญชีธนาคารที่วางบิล
router.delete('/:id',newAuth.information,billingaccount.delete)

module.exports = router;