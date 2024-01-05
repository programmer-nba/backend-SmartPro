const Brand = require("../../models/product/brand.schema") 

//เพิ่ม brand
module.exports.add = async (req, res) => {
  try {
    const {name,supplier_id} = req.body
    const data = new Brand({
        name:name, //(ชื่อ)
        supplier_id: supplier_id, //ผู้จัดหาสินค้า
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูล brand",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const branddata = await Brand.find().populate("supplier_id");
    if (!branddata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Brand" });
    }
    return res.status(200).send({ status: true, data: branddata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const branddata = await Brand.findOne({ _id: req.params.id }).populate("supplier_id");
    if (!branddata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Brand" });
    }
    return res.status(200).send({ status: true, data: branddata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล brand
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const branddata = await Brand.findById(id)
    if (!branddata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Brand" });
    }
    const {name,supplier_id} = req.body
    
    const data = {
        name:name, //(ชื่อ)
        supplier_id:supplier_id // รหัสผู้จัดหา  
    }
    const edit = await Brand.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล Brand เรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล brand
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const branddata = await Brand.findOne({ _id: id });
    if (!branddata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล brand" });
    }
    const deletesupplier = await Brand.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
