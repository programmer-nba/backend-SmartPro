const express = require('express');
const router = express.Router();
const purchaseorder = require("../../controllers/purchaseorder/purchaseorder.controller")

const newAuth = require("../../authentication/newAuth")
//เพิ่มใบสั่งซื้อสินค้า
router.post('/',newAuth.openpurchaseorder,purchaseorder.add)

//ดึงข้อมูลทั้งหมด
router.get('/',newAuth.all,purchaseorder.getall)

//ดึงข้อมูล ตาม  order_id
router.get("/bypo/:id",newAuth.all,purchaseorder.getorder)

//ดึงข้อมูล by id
router.get('/byid/:id',newAuth.all,purchaseorder.getbyid)

//แก้ไขข้อมูลใบสั่งซื้อสินค้า
router.put('/:id',newAuth.openpurchaseorder,purchaseorder.edit)

//ลบข้อมูลใบสั่งซื้อสินค้า
router.delete('/:id',newAuth.openpurchaseorder,purchaseorder.delete)



router.put("/admin/accept/:id",newAuth.managerpurchaseorder,purchaseorder.accept);
// admin อนุมัติด้วย order
router.put("/admin/acceptbyorder/:id",newAuth.managerpurchaseorder,purchaseorder.acceptorder);


router.put("/shipping/:id",newAuth.openpurchaseorder,purchaseorder.productshipped);
router.put("/shippingexcel/:id",newAuth.openpurchaseorder,purchaseorder.productshippedexcel);
router.put("/imageproduct/:id",newAuth.openpurchaseorder,purchaseorder.imageproduct);
router.put("/file/:id",newAuth.openpurchaseorder,purchaseorder.file);



//เพิ่มใบสั่งซื้อสินค้าจาก ใบเปรียบเทียบราคา
router.post("/fromcompare",newAuth.openpurchaseorder,purchaseorder.createpo)

module.exports = router;