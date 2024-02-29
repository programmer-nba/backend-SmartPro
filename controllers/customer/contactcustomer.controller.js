const Contactcustomer = require("../../models/customer/contactcustomer.schema");

//เพิ่มผุ้ติดต่อลูกค้า
module.exports.add = async (req, res) => {
  try {
    const {name,nickname,department,position,telephone,mobile,email,lineid,facebookid,dateofbirth,remark,customer_id} = req.body
    const data = new Contactcustomer({
        name:name, //(ชื่อจริง)
        nickname:nickname, // ชื่อเล่น
        department:department,
        position:position,
        telephone:telephone,
        mobile:mobile,
        email:email,
        lineid:lineid,
        facebookid:facebookid,
        dateofbirth:dateofbirth,
        remark:remark,
        customer_id:customer_id,
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลผุ้ติดต่อลูกค้า",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//เพิ่มผุ้ติดต่อลูกค้าจาก excel
module.exports.addexcel = async (req, res) => {
  try {
    const {name,nickname,department,position,telephone,mobile,email,lineid,facebookid,dateofbirth,remark,customer_id} = req.body
    const data = new Contactcustomer({
        name:name, //(ชื่อจริง)
        nickname:nickname, // ชื่อเล่น
        department:department,
        position:position,
        telephone:telephone,
        mobile:mobile,
        email:email,
        lineid:lineid,
        facebookid:facebookid,
        dateofbirth:dateofbirth,
        remark:remark,
        customer_id:customer_id,
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลผุ้ติดต่อลูกค้า",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const contactcustomerdata = await Contactcustomer.find().populate('customer_id');
    if (!contactcustomerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: contactcustomerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const id = req.params.id
    const contactcustomerdata = await Contactcustomer.findOne({ _id: id }).populate('customer_id');
    if (!contactcustomerdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: contactcustomerdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by customer
module.exports.getbycutomer = async (req, res) => {
    try {
      const id = req.params.id
      const contactcustomerdata = await Contactcustomer.find({customer_id:id}).populate('customer_id');
      if (!contactcustomerdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
      }
      return res.status(200).send({ status: true, data: contactcustomerdata });
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };

//แก้ไขข้อมูล customer
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const contactcustomerdata = await Contactcustomer.findById(id)
    if (!contactcustomerdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {name,nickname,department,position,telephone,mobile,email,lineid,facebookid,dateofbirth,remark,customer_id} = req.body
    const data = {
        name:name, //(ชื่อจริง)
        nickname:nickname, // ชื่อเล่น
        department:department,
        position:position,
        telephone:telephone,
        mobile:mobile,
        email:email,
        lineid:lineid,
        facebookid:facebookid,
        dateofbirth:dateofbirth,
        remark:remark,
        customer_id:customer_id,
    };
    const edit = await Contactcustomer.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลลูกค้าเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล customer
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const contactcustomerdata = await Contactcustomer.findOne({ _id: id });
    if (!contactcustomerdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletecustomer = await Contactcustomer.findByIdAndDelete(id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletecustomer });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ห้ามใช้//เพิ่มข้อมูลเซลล์ที่เป็นคนเพิ่ม แต่ใช้แล้วจะ ลูกค้า ทุกคน จะเพิ่มด้วย แล้วเซลล์ที่ใช้ใน id
// module.exports.edit_sale_id = async (req, res) => {
//   try {
//     const sale_id = req.body.sale_id
//     const customer_id = req.body.customer_id
//     const data = {
//       sale_id:sale_id
//     };
//     const edit = await Contactcustomer.updateMany({sale:undefined},data)
//     return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลเซลล์เรียบร้อย",data: edit});
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// }