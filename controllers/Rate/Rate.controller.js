const Rate = require("../../models/Rate/Rate.schema")

//เพิ่ม Rate
module.exports.add = async (req, res) => {
  try {
    const {name,rateprice,symbol} = req.body
    const data = new Rate({
        name:name, //(ชื่อ)
        symbol:symbol,
        rateprice:rateprice
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลเรทสกุลเงินแล้ว",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const ratedata = await Rate.find();
    if (!ratedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลเรทสกุลเงิน" });
    }
    return res.status(200).send({ status: true, data: ratedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const ratedata = await Rate.findOne({ _id: req.params.id });
    if (!ratedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: ratedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล Rate
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const ratedata = await Rate.findById(id)
    if (!ratedata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {name,rateprice,symbol} = req.body
    
    const data = {
        name:name, //(ชื่อ)
        symbol:symbol,
        rateprice:rateprice
    }
    const edit = await Rate.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลเรทเรียบร้อยแล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล Rate
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const ratedata = await Rate.findOne({ _id: id });
    if (!ratedata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deleterate = await Rate.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleterate });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
