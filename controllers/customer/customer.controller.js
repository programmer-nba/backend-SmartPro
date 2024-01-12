const Customer = require("../../models/customer/customer.schema");

//เพิ่มลูกค้า
module.exports.add = async (req, res) => {
  try {
    const {name,typecustomer,address,province,amphure,tambon,email,contact,telephone,zipcode,taxcustomerid} = req.body
    const data = new Customer({
        name:name, //(ชื่อบริษัท หรือ คนลูกค้า)
        typecustomer:typecustomer, //(ประเภทลูกค้า เช่น ในประเทศ , นอกประเทศ)
        address: address, //(ที่อยู่) 
        province:province, //(จังหวัด)
        amphure:amphure, //(อำเภอ)
        tambon: tambon, //(ตำบล)
        zipcode:zipcode,
        email:email, //(อีเมล์)
        contact:contact, //(ผู้ติดต่อ)
        telephone:telephone, //(เบอร์โทรศัพท์)
        taxcustomerid:taxcustomerid,
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลลูกค้า",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const customerdata = await Customer.find();
    if (!customerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
    }
    return res.status(200).send({ status: true, data: customerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const customerdata = await Customer.findOne({ _id: id });
    if (!customerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
    }
    return res.status(200).send({ status: true, data: customerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล customer
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const customerdata = await Customer.findById(id)
    if (!customerdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
    }
    const {name,typecustomer,address,province,amphure,tambon,email,contact,telephone,zipcode,taxcustomerid} = req.body
    const data = {
        name:name, //(ชื่อบริษัท หรือ คนลูกค้า)
        typecustomer:typecustomer, //(ประเภทลูกค้า เช่น ในประเทศ , นอกประเทศ)
        address: address, //(ที่อยู่) 
        province:province, //(จังหวัด)
        amphure:amphure, //(อำเภอ)
        tambon: tambon, //(ตำบล)
        zipcode:zipcode,
        email:email, //(อีเมล์)
        contact:contact, //(ผู้ติดต่อ)
        telephone:telephone, //(เบอร์โทรศัพท์)
        taxcustomerid:taxcustomerid
    };
    const edit = await Customer.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลลูกค้าเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล customer
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const customerdata = await Customer.findOne({ _id: id });
    if (!customerdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลลูกค้า" });
    }
    const deletecustomer = await Customer.findByIdAndDelete(id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletecustomer });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
