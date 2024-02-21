const express = require('express');
const router = express.Router();
const Loan = require("../../controllers/loan/loan.controller");
const auth = require("../../authentication/userAuth")
// สร้างเงินกู้
router.post("/",auth.account,Loan.createLoan);
// get ข้อมูลเงินกู้
router.get('/byid/:id',auth.all,Loan.getLoanById);
// getall ข้อมูลเงินกู้
router.get('/',auth.all,Loan.getLoan);
// ชำระเงินตามงวด
router.put('/payment/:id',auth.account,Loan.paymentLoan);
// ชำระเงินทั้งหมด
router.put('/paymentall/:id',auth.account,Loan.paymentAllLoan);
// ลบข้อมูลเงินกู้
router.delete('/:id',auth.account,Loan.deleteLoan)  ;

module.exports = router;