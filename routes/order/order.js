const express = require('express');
const router = express.Router();
const Order = require("../../controllers/order/order.controller")
const auth = require("../../authentication/userAuth")



//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Order.getall)

// //ดึงข้อมูล by id
// router.get('/byid/:id',auth.all,Profit.getbyid)

// // แก้ไขกำไร
// router.put('/:id',auth.verifyTokenadmin,Profit.edit)

// // ลบข้อมูลกำไร
// router.delete('/:id',auth.verifyTokenadmin,Profit.delete)

module.exports = router;