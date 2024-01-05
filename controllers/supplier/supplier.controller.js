const Supplier = require("../../models/supplier/supplier.schema");

//เพิ่ม supplier
module.exports.add = async (req, res) => {
  try {
    const {name,email,contact,telephone,address,province,amphure,tambon,website} = req.body
    const data = new Supplier({
        name:name, //(ชื่อบริษัทของ supplier)
        email:email, //(อีเมล์)
        contact:contact,//(ผู้ติดต่อ)
        telephone:telephone ,//(เบอร์โทรศัพท์)
        address:address, // (ที่อยู่)
        province: province, //(จังหวัด)
        amphure:amphure, //(อำเภอ)
        tambon : tambon,//(ตำบล)
        website : website, //(เว็บไซต์)
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูล supplier",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const supplierdata = await Supplier.find();
    if (!supplierdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    return res.status(200).send({ status: true, data: supplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const supplierdata = await Supplier.findOne({ _id: req.params.id });
    if (!supplierdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    return res.status(200).send({ status: true, data: supplierdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล supplier
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const supplierdata = await Supplier.findById(id)
    if (!supplierdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Supplier" });
    }
    const {name,email,contact,telephone,address,province,amphure,tambon,website} = req.body
    
    const data = {
        name:name, //(ชื่อบริษัทของ supplier)
        email:email, //(อีเมล์)
        contact:contact,//(ผู้ติดต่อ)
        telephone:telephone ,//(เบอร์โทรศัพท์)
        address:address, // (ที่อยู่)
        province: province, //(จังหวัด)
        amphure:amphure, //(อำเภอ)
        tambon : tambon,//(ตำบล)
        website : website, //(เว็บไซต์)
    }
    const edit = await Supplier.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล supplier เรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล supplier
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const supplierdata = await Supplier.findOne({ _id: id });
    if (!supplierdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล admin" });
    }
    const deletesupplier = await Supplier.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
