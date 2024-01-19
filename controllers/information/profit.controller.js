const Profit = require("../../models/information/profit.schama") 

//เพิ่มกำไร
module.exports.add = async (req, res) => {
  try {
    const {profitstart,profitend,percent} = req.body
    const data = new Profit({
        profitstart:profitstart, // (ราคาเริ่มต้น)
        profitend:profitend, // (ราคาถึง)
        percent:percent // เปอร์เซ็นต์
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลกำไร",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const Profitdata = await Profit.find();
    if (!Profitdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: Profitdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const Profitdata = await Profit.findOne({ _id: req.params.id });
    if (!Profitdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: Profitdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลกำไร
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const Profitdata = await Profit.findById(id)
    if (!Profitdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {profitstart,profitend,percent} = req.body
    
    const data = {
        profitstart:profitstart, // (ราคาเริ่มต้น)
        profitend:profitend, // (ราคาถึง)
        percent:percent // เปอร์เซ็นต์
    }
    const edit = await Profit.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลกำไร
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const Profitdata = await Profit.findOne({ _id: id });
    if (!Profitdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletesupplier = await Profit.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
