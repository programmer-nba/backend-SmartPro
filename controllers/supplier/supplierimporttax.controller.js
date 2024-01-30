const Supplierimporttax = require("../../models/supplier/supplierimporttax.schema") 

//เพิ่ม ค่าภาษีนำเข้า
module.exports.add = async (req, res) => {
  try {
    const {quotation_id,percent,price} = req.body
    const data = new Supplierimporttax({
        quotation_id:quotation_id,
        percent:percent,
        price:price
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลค่าภาษีนำเข้า",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const supplierimporttaxdata = await Supplierimporttax.find().populate({ path: "quotation_id", select: "refno" });
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
    const supplierimporttaxdata = await Supplierimporttax.findOne({ _id: req.params.id });
    if (!supplierimporttaxdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: supplierimporttaxdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล ค่าภาษีนำเข้า
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const supplierimporttaxdata = await Supplierimporttax.findById(id)
    if (!supplierimporttaxdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล " });
    }
    const {quotation_id,percent,price} = req.body
    
    const data = {
        quotation_id:quotation_id,
        percent:percent,
        price:price
    }
    const edit = await Supplierimporttax.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลค่าภาษีนำเข้าเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล ค่าภาษีนำเข้า
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const supplierimporttaxdata = await Supplierimporttax.findOne({ _id: id });
    if (!supplierimporttaxdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล brand" });
    }
    const deletesupplier = await Supplierimporttax.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
