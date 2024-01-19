const Shipping = require("../../models/information/shipping.schama") 

//เพิ่มค่าขนส่ง
module.exports.add = async (req, res) => {
  try {
    const {name,price} = req.body
    const data = new Shipping({
        name:name, //(ชื่อ)
        price:price
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลขนส่ง",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const shippingdata = await Shipping.find();
    if (!shippingdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: shippingdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const shippingdata = await Shipping.findOne({ _id: req.params.id });
    if (!shippingdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: shippingdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลค่าขนส่ง
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const shippingdata = await Shipping.findById(id)
    if (!shippingdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {name,price} = req.body
    
    const data = {
        name:name, //(ชื่อ)
        price:price
    }
    const edit = await Shipping.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลค่าขนส่ง
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const shippingdata = await Shipping.findOne({ _id: id });
    if (!shippingdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletesupplier = await Shipping.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
