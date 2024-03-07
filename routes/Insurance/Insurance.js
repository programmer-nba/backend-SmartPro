const express = require('express');
const router = express.Router();
const Insurance = require("../../controllers/Insurance/Insurance.controller")
const newAuth = require("../../authentication/newAuth")


//ดึงข้อมูลทั้งหมด
router.get("/",newAuth.all,Insurance.getAll);

//แจ้งเคลมสินค้า
router.post("/",newAuth.insurance,Insurance.claim);

//ส่งให้บริษัทประกัน
router.put("/sendtoinsurance/:id",newAuth.insurance,Insurance.sendtoinsurance);

//บริษัทประกันส่งกลับมาให้เรา
router.put("/sendback/:id",newAuth.insurance,Insurance.sendback);

//สินค้าส่งให้ลูกค้า
router.put("/sendtocustomer/:id",newAuth.insurance,Insurance.sendtocustomer);

module.exports = router;