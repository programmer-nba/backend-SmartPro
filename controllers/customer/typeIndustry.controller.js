const TypeIndustry = require("../../models/customer/typeIndustry.schema");

//เพิ่มประเภทอุตสาหกรรม
module.exports.add = async (req, res) => {
  try {
    const {name} = req.body
    const data = new TypeIndustry({
        name:name, //(ชื่อประเภทอุตสาหกรรม)
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลประเภทอุตสาหกรรมลูกค้าแล้ว",data: add});
 
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const typelndustrydata = await TypeIndustry.find();
    if (!typelndustrydata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: typelndustrydata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const typelndustrydata = await TypeIndustry.findOne({ _id: req.params.id });
    if (!typelndustrydata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    return res.status(200).send({ status: true, data: typelndustrydata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลประเภทอุตสาหกรรม
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const typelndustrydata = await TypeIndustry.findById(id)
    if (!typelndustrydata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล " });
    }
    const {name} = req.body
    
    const data = {
        name:name, //(ชื่อประเภทอุตสาหกรรม)
    }
    const edit = await TypeIndustry.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขประเภทอุตสาหกรรมลูกค้าเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูล ประเภทอุตสาหกรรม
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const typelndustrydata = await TypeIndustry.findOne({ _id: id });
    if (!typelndustrydata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล" });
    }
    const deletetypeofbusiness = await TypeIndustry.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletetypeofbusiness });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
