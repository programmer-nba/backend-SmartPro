const Billingaccount = require("../../models/information/billingaccount.schama");

//เพิ่มบัญชีธนาคารที่วางบิล
module.exports.add = async (req, res) => {
  try {
    
    const data = new Billingaccount({
        nameaccount:req.body.nameaccount,
        bankname:req.body.bankname,
        bankid:req.body.bankid,
        bankbranch:req.body.bankbranch,
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณเพิ่มบัญชีในวางบิลเรียบร้อยแล้ว",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const billingaccountdata = await Billingaccount.find();
    if (!billingaccountdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: billingaccountdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลบัญชีธนาคารที่วางบิล
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const billingaccountdata = await Billingaccount.findById(id)
    if (!billingaccountdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }

    const data = {
        nameaccount:req.body.nameaccount,
        bankname:req.body.bankname,
        bankid:req.body.bankid,
        bankbranch:req.body.bankbranch,
    }
    const edit = await Billingaccount.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลบัญชีที่วางบิลเรียบร้อยแล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลบัญชีธนาคารที่วางบิล
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const billingaccountdata = await Billingaccount.findOne({ _id: id });
    if (!billingaccountdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletebillingaccountdata = await Billingaccount.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletebillingaccountdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
