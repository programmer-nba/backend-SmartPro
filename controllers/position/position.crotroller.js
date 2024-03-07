const Position = require("../../models/position/position.schema");

//เพิ่มตำแหน่ง
module.exports.add = async (req, res) => {
  try {
      const data = new Position(req.body);
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลตำแหน่ง",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const positiondata = await Position.find();
    return res.status(200).send({ status: true, data: positiondata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const positiondata = await Position.findById(id);
    if (!positiondata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลตำแหน่ง" });
    }
    return res.status(200).send({ status: true, data: positiondata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขตำแหน่ง
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const positiondata = await Position.findById(id);
    if (!positiondata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลตำแหน่ง" });
    }
    const data = req.body
    const edit = await Position.findByIdAndUpdate(id, data, { useFindAndModify: false });
    return res.status(200).send({ status: true, message: "แก้ไขข้อมูลตำแหน่งสำเร็จ", data: edit });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบตำแหน่ง
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const positiondata = await Position.findById(id);
    if (!positiondata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลตำแหน่ง" });
    }
    const deletepostion = await Position.findByIdAndDelete(id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletepostion });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};




