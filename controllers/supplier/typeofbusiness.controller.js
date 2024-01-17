const Typeofbusiness = require("../../models/supplier/typeofbusiness.schema");

//เพิ่มประเภทธุรกิจ
module.exports.add = async (req, res) => {
  try {
    const {name} = req.body
    const data = new Typeofbusiness({
        name:name, //(ชื่อบริษัทของ supplier)
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลประเภทธุรกิจ",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const typeofbusinessdata = await Typeofbusiness.find();
    if (!typeofbusinessdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: typeofbusinessdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const typeofbusinessdata = await Typeofbusiness.findOne({ _id: req.params.id });
    if (!typeofbusinessdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: typeofbusinessdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลประเภทธุรกิจ
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const typeofbusinessdata = await Typeofbusiness.findById(id)
    if (!typeofbusinessdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล " });
    }
    const {name} = req.body
    
    const data = {
        name:name, //(ชื่อประเภทธุรกิจ)
    }
    const edit = await Typeofbusiness.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล supplier เรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล supplier
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const typeofbusinessdata = await Typeofbusiness.findOne({ _id: id });
    if (!typeofbusinessdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletetypeofbusiness = await Typeofbusiness.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletetypeofbusiness });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
