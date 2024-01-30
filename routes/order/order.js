const express = require('express');
const router = express.Router();
const Order = require("../../controllers/order/order.controller")
const auth = require("../../authentication/userAuth")



//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Order.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Order.getbyid)

// ลบข้อมูลออเดอร์
router.delete('/:id',auth.verifyTokenadmin,Order.delete)

//พนักงาน po เปิดใบสั่งซื้อ
router.put("/openop/:id",auth.procurement,Order.openop);


module.exports = router;