const express = require('express');
const router = express.Router();
const purchaseorder = require("../../controllers/purchaseorder/purchaseorder.controller")
const auth = require("../../authentication/userAuth")

//เพิ่มใบสั่งซื้อสินค้า
router.post('/',auth.procurement,purchaseorder.add)

//ดึงข้อมูลทั้งหมด
router.get('/',auth.all,purchaseorder.getall)

//ดึงข้อมูล ตาม  order_id
router.get("/bypo/:id",auth.all,purchaseorder.getorder)

//ดึงข้อมูล by id
router.get('/byid/:id',auth.all,purchaseorder.getbyid)

//แก้ไขข้อมูลใบสั่งซื้อสินค้า
router.put('/:id',auth.procurement,purchaseorder.edit)

//ลบข้อมูลใบสั่งซื้อสินค้า
router.delete('/:id',auth.procurement,purchaseorder.delete)


module.exports = router;