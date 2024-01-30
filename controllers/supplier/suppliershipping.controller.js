const Suppliershipping = require("../../models/supplier/suppliershipping.schema") 

//เพิ่ม ค่าขนส่งจากประเทศ
module.exports.add = async (req, res) => {
  try {
    const {quotation_id,shipping,price} = req.body
    const data = new Suppliershipping({
        quotation_id:quotation_id,
        shipping:shipping,
        price:price
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลค่าขนส่งจากประเทศ",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const supplierimporttaxdata = await Suppliershipping.find().populate({ path: "quotation_id", select: "refno" });
    if (!supplierimporttaxdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: supplierimporttaxdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const supplierimporttaxdata = await Suppliershipping.findOne({ _id: req.params.id });
    if (!supplierimporttaxdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: supplierimporttaxdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล ค่าขนส่งจากประเทศ
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const supplierimporttaxdata = await Suppliershipping.findById(id)
    if (!supplierimporttaxdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล " });
    }
    const {quotation_id,shipping,price} = req.body
    
    const data = {
        quotation_id:quotation_id,
        shipping:shipping,
        price:price
    }
    const edit = await Suppliershipping.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลค่าขนส่งจากประเทศเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล ค่าขนส่งจากประเทศ
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const supplierimporttaxdata = await Suppliershipping.findOne({ _id: id });
    if (!supplierimporttaxdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล brand" });
    }
    const deletesupplier = await Suppliershipping.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
