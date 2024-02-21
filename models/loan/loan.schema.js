const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    creditor:{type:String},//เจ้าหนี้ :
    cash:{type:Number},//จำนวนเงินที่กู้ :
    interest:{type:Number},//ดอกเบี้ยต่อปี:
    payment:{type:Number},//งวดที่ผ่อน:
    principal:{type:Number},//เงินต้น:
    interestpal:{type:Number},//ดอกเบี้ย:
    balance:{type:Number},//เงินต้นคงเหลือ:
    paidmonth:{type:Number},//จำนวนเงินที่ผ่อนต่องวด:
    //งวดที่ผ่อน:
    payment_period:{type:Number},//จำนวนงวดที่ผ่อน:
    
    payment_history:{type:[{
        date:{type:Date},//วันที่:
        payment:{type:Number},//จำนวนเงินที่ผ่อน:
        interest:{type:Number},//ดอกเบี้ย:
        principal:{type:Number},//เงินต้น:
        balance:{type:Number},//เงินต้นคงเหลือ:
        status:{type:String}//สถานะการผ่อน:
    }],default:null}//ประวัติการผ่อน :
    
     

    
  },
  {timestamps: true}
);

const Loan = mongoose.model("loan", loanSchema);

module.exports = Loan;