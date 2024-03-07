const express = require('express');
const router = express.Router();
const Order = require("../../controllers/order/order.controller")
const newAuth = require("../../authentication/newAuth")


//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,Order.getall)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,Order.getbyid)

// เพิ่มออเดอร์ เมื่อลูกค้าต้องการออเดอร์x
router.post("/",newAuth.openorder,Order.addorder);
// แก้ไขออเดอร์ 
router.put("/:id",newAuth.openorder,Order.editorder);


//ขายงานผ่าน
router.put("/approve/:id",newAuth.dealwork,Order.acceptdeal);

//ขายงานไม่ผ่าน
router.put("/unapprove/:id",newAuth.dealwork,Order.unacceptdeal);

//เปิดใบสั่งซื้อ
router.put("/openop/:id",newAuth.openpurchaseorder,Order.openop);


//จัดส่งสินค้าให้กับลูกค้า
router.put("/delivery/:id",newAuth.delivery,Order.delivery);
//ลูกค้าตรวจสอบสินค้าแล้ว
router.put("/customercheck/:id",newAuth.delivery,Order.customercheck);

//ดึงข้อมูล by sale_id
router.get('/bysaleid/:id',newAuth.all,Order.getbysaleid)



// // ลบข้อมูลออเดอร์
// router.delete('/:id',auth.verifyTokenadmin,Order.delete)

// //พนักงาน po เปิดใบสั่งซื้อ
// router.put("/openop/:id",auth.procurement,Order.openop);


module.exports = router;