const express = require('express');
const router = express.Router();
const Order = require("../../controllers/order/order.controller")
const auth = require("../../authentication/userAuth")



//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,Order.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,Order.getbyid)

// เพิ่มออเดอร์ เมื่อลูกค้าต้องการออเดอร์
router.post("/",auth.sales,Order.addorder);

//ขายงานผ่าน
router.put("/approve/:id",auth.sales,Order.acceptdeal);

//ขายงานไม่ผ่าน
router.put("/unapprove/:id",auth.sales,Order.unacceptdeal);

//เปิดใบสั่งซื้อ
router.put("/openop/:id",auth.procurement,Order.openop);

//เพิ่มใบสั้่งซื้อตาม ใบเสนอราคา
router.put("/genpo/:id",auth.procurement,Order.genpo);


//จัดส่งสินค้าให้กับลูกค้า
router.put("/delivery/:id",auth.procurement,Order.delivery);
//ลูกค้าตรวจสอบสินค้าแล้ว
router.put("/customercheck/:id",auth.procurement,Order.customercheck);


// // ลบข้อมูลออเดอร์
// router.delete('/:id',auth.verifyTokenadmin,Order.delete)

// //พนักงาน po เปิดใบสั่งซื้อ
// router.put("/openop/:id",auth.procurement,Order.openop);


module.exports = router;