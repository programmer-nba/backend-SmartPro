const express = require('express');
const router = express.Router();
const Invoice = require("../../controllers/invoice/invoice.controller");
const newAuth = require("../../authentication/newAuth")

// เปิดใบแจ้งหนี้  และ วางบิล
router.post("/",newAuth.invoice,Invoice.openinvoice);
//อนุมัติใบแจ้งหนี้และวางบิล
router.put('/approve/:id',newAuth.managerinvoice,Invoice.approveinvoice);
// get ข้อมูลใบแจ้งหนี้และวางบิล
router.get('/byid/:id',newAuth.all,Invoice.getinvoice);
// getall ข้อมูลใบแจ้งหนี้และวางบิล  
router.get('/',newAuth.all,Invoice.getallinvoice);
// ลบข้อมูลใบแจ้งหนี้และวางบิล
router.delete('/:id',newAuth.invoice,Invoice.deleteinvoice);
//แจ้งชำระเงิน
router.put('/payment/:id',newAuth.invoice,Invoice.paymentnotification);

//คาดการ์ณการวางบิล
router.post('/predictbill/',newAuth.invoice,Invoice.predictbill);

module.exports = router;