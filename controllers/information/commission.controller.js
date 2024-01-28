const Commission = require("../../models/information/commission.schama");

//เพิ่มค่าคอมมิสชั่น
module.exports.add = async (req, res) => {
  try {
    const {percent} = req.body
    const data = new Commission({
        percent:percent
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้ค่าคอมมิสชั่นเสร็จแล้ว",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const commission = await Commission.find();
    if (!commission) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: commission });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลภาษีนำเข้า
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const commission = await Commission.findById(id)
    if (!commission) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {percent} = req.body
    
    const data = {
      percent:percent
    }
    const edit = await Commission.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลค่าคอมมิสชั่นแล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลภาษีนำเข้า
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const commissiondata = await Commission.findOne({ _id: id });
    if (!commissiondata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletecommission = await Commission.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletecommission });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
