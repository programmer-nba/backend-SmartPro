const express = require('express');
const router = express.Router();
const Insurance = require("../../controllers/Insurance/Insurance.controller")

//ดึงข้อมูลทั้งหมด
router.get("/",Insurance.getAll);

//แจ้งเคลมสินค้า
router.post("/",Insurance.claim);

//ส่งให้บริษัทประกัน
router.put("/sendtoinsurance/:id",Insurance.sendtoinsurance);

//บริษัทประกันส่งกลับมาให้เรา
router.put("/sendback/:id",Insurance.sendback);

//สินค้าส่งให้ลูกค้า
router.put("/sendtocustomer/:id",Insurance.sendtocustomer);

module.exports = router;