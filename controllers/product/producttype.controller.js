const Producttype = require("../../models/product/producttype.schema") 

//เพิ่ม ประเภทสินค้า
module.exports.add = async (req, res) => {
  try {

    const {name} = req.body
    const data = new Producttype({
        name:name, //(ชื่อ)
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลประเภทสินค้า",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const producttypedata = await Producttype.find();
    if (!producttypedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลประเภทสินค้า" });
    }
    return res.status(200).send({ status: true, data: producttypedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const producttypedata = await Producttype.findOne({ _id: req.params.id });
    if (!producttypedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลประเภทสินค้า" });
    }
    return res.status(200).send({ status: true, data: producttypedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลประเภทสินค้า
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const producttypedata = await Producttype.findById(id)
    if (!producttypedata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลประเภทสินค้า" });
    }
    const {name} = req.body
    
    const data = {
        name:name, //(ชื่อ)  
    }
    const edit = await Producttype.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลประเภทสินค้าเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลประเภทสินค้า
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const producttypedata = await Producttype.findOne({ _id: id });
    if (!producttypedata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลประเภทสินค้า"});
    }
    const deleteproducttype = await Producttype.findByIdAndDelete(id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deleteproducttype });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
