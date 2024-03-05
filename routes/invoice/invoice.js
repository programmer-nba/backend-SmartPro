const express = require('express');
const router = express.Router();
const Invoice = require("../../controllers/invoice/invoice.controller");
const auth = require("../../authentication/userAuth")
// เปิดใบแจ้งหนี้  และ วางบิล
router.post("/",auth.account,Invoice.openinvoice);
//อนุมัติใบแจ้งหนี้และวางบิล
router.put('/approve/:id',auth.manager,Invoice.approveinvoice);
// get ข้อมูลใบแจ้งหนี้และวางบิล
router.get('/byid/:id',auth.all,Invoice.getinvoice);
// getall ข้อมูลใบแจ้งหนี้และวางบิล  
router.get('/',auth.all,Invoice.getallinvoice);
// ลบข้อมูลใบแจ้งหนี้และวางบิล
router.delete('/:id',auth.account,Invoice.deleteinvoice);
//แจ้งชำระเงิน
router.put('/payment/:id',auth.account,Invoice.paymentnotification);

//คาดการ์ณการวางบิล
router.post('/predictbill/',auth.account,Invoice.predictbill);

module.exports = router;