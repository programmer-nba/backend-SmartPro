const Loan = require("../../models/loan/loan.schema");

const createLoan = async (req, res) => {
    try {
        // คำนวณดอกเบี้ยต่องวด
        

        const monthlyInterestRate = req.body.interest / 100 / 12;
       
        const monthlyPayment = req.body.cash * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, req.body.payment_period)) / (Math.pow(1 + monthlyInterestRate, req.body.payment_period) - 1);
        const totalPayment = monthlyPayment * req.body.payment_period;
        


        const loan = new Loan({
            creditor: req.body.creditor,
            cash: req.body.cash.toFixed(2),
            interest: req.body.interest.toFixed(2),
            payment: req.body.payment_period,
            principal: req.body.cash.toFixed(2),
            interestpal: (totalPayment - req.body.cash).toFixed(2),
            balance: totalPayment.toFixed(2),
            paidmonth: monthlyPayment.toFixed(2),
            payment_period: req.body.payment_period,
            payment_history: []
        });

        const add = await loan.save();
        res.status(200).json({ status: true, message: "ได้เพิ่มเงินกู้แล้ว", data: add });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getLoan = async (req, res) => {
    try {
        const loan = await Loan.find();
        return res.status(200).json({status:true, message: "ได้ข้อมูลเงินกู้แล้ว", data: loan});
    } catch (error) {
        return res.status(500).json({ status:false,message: error.message });
    }
}

const getLoanById = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        return res.status(200).json({status:true, message: "ได้ข้อมูลเงินกู้แล้ว", data: loan});
    } catch (error) {
        return res.status(400).json({ status:false,message: error.message });
    }
}

//ชำระเงินตามงวด
const paymentLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (loan) {
            const payment = loan.paidmonth;
            const date = new Date();
            // // คำนวณจำนวนเงินที่ไปชำระเงินต้นในงวดนี้
            // const principalPayment = Math.min(payment, loan.principal);
            
            // // คำนวณจำนวนเงินที่ไปชำระดอกเบี้ยในงวดนี้
            // const interestPayment = Math.min(payment - principalPayment, loan.interestpal);

            // หักลดเงินต่อดอกเบี้ย สูตร คือ เงินต้น * อัตราดอกเบี้ย * จำนวนวันในงวด / 365
            const interestPayment = loan.principal * loan.interest / 100 * 30 / 365;
            // หักเงินต้น
            const principalPayment = payment - interestPayment;
            // ลดเงินต้น
            loan.principal -= principalPayment.toFixed(2);
            // ลดดอกเบี้ย
            loan.interestpal-= interestPayment.toFixed(2);
            loan.payment_history.push({
                date: date,
                payment: payment,
                interest: interestPayment,
                principal: principalPayment,
                balance: loan.balance - payment,
                status: "ชำระเงิน"
            });
            loan.payment_period -= 1;
            loan.balance = loan.balance - payment;
            await loan.save();
            return res.status(200).json({status:true, message: "ได้ชำระเงินตามงวดแล้ว", data: loan});
        }
        return res.status(404).json({status:false, message: "ไม่พบข้อมูลเงินกู้"});
    } catch (error) {
        return res.status(400).json({ status:false,message: error.message });
    }
}
 
// ชำระเงินทั้งหมด
const paymentAllLoan = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);
        if (loan) {
            const date = new Date();
            const payment = loan.balance;
           
            loan.payment_history.push({
                date: date,
                payment: payment,
                interest: loan.interestpal,
                principal: loan.principal,
                balance: loan.balance,
                status: "ชำระเงิน"
            });
            loan.payment_period = 0;
            loan.balance = 0;
            await loan.save();
            return res.status(200).json({status:true, message: "ได้ชำระเงินทั้งหมดแล้ว", data: loan});
        }
        return res.status(404).json({status:false, message: "ไม่พบข้อมูลเงินกู้"});
    } catch (error) {
        return res.status(400).json({ status:false,message: error.message });
    }
}

// ลบข้อมูลเงินกู้
const deleteLoan = async (req, res) => {
    try {
        const loan = await Loan.findByIdAndDelete(req.params.id);
        return res.status(200).json({status:true, message: "ได้ลบข้อมูลเงินกู้แล้ว", data: loan});
    } catch (error) {
        return res.status(400).json({ status:false,message: error.message });
    }
}

module.exports = {
    createLoan,
    getLoan,
    getLoanById,
    paymentLoan,
    paymentAllLoan,
    deleteLoan
};