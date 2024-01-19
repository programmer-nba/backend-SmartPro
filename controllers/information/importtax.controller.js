const Importtax = require("../../models/information/importtax.schama") 

//เพิ่มภาษีนำเข้า
module.exports.add = async (req, res) => {
  try {
    const {name,price} = req.body
    const data = new Importtax({
        name:name, //(ชื่อ)
        price:price
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลภาษีนำเข้า",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const Importtaxdata = await Importtax.find();
    if (!Importtaxdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: Importtaxdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const Importtaxdata = await Importtax.findOne({ _id: req.params.id });
    if (!Importtaxdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: Importtaxdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลภาษีนำเข้า
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const Importtaxdata = await Importtax.findById(id)
    if (!Importtaxdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const {name,price} = req.body
    
    const data = {
        name:name, //(ชื่อ)
        price:price
    }
    const edit = await Importtax.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลภาษีนำเข้า
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const Importtaxdata = await Importtax.findOne({ _id: id });
    if (!Importtaxdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletesupplier = await Importtax.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
