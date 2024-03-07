const express = require('express');
const router = express.Router();
const Loan = require("../../controllers/loan/loan.controller");
const newAuth = require("../../authentication/newAuth")
// สร้างเงินกู้
router.post("/",newAuth.loan,Loan.createLoan);
// get ข้อมูลเงินกู้
router.get('/byid/:id',newAuth.all,Loan.getLoanById);
// getall ข้อมูลเงินกู้
router.get('/',newAuth.all,Loan.getLoan);
// ชำระเงินตามงวด
router.put('/payment/:id',newAuth.loan,Loan.paymentLoan);
// ชำระเงินทั้งหมด
router.put('/paymentall/:id',newAuth.loan,Loan.paymentAllLoan);
// ลบข้อมูลเงินกู้
router.delete('/:id',newAuth.loan,Loan.deleteLoan)  ;

module.exports = router;