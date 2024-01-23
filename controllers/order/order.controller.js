const Order = require("../../models/order/order.schema"); 
const { populate } = require("../../models/quotation/quotation.schema");

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const orderdata = await Order.find()
    .populate({
        path:'quotation_id',
        populate:[
            {path:"customer_id"},
            {path:"user_id"},
        ]
    })
    .populate('purchaseorder.purchaseorder_id')
    .populate('customer_id');
    if (!orderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลออเดอร์" });
    }
    return res.status(200).send({ status: true, data: orderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const orderdata = await Brand.findOne({ _id: req.params.id });
    if (!orderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Brand" });
    }
    return res.status(200).send({ status: true, data: orderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล brand
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const orderdata = await Brand.findById(id)
    if (!orderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูล Brand" });
    }
    const {name} = req.body
    
    const data = {
        name:name, //(ชื่อ)
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
    const orderdata = await Brand.findOne({ _id: id });
    if (!orderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูล brand" });
    }
    const deletesupplier = await Brand.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};