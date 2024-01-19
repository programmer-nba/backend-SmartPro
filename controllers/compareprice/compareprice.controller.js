const Compareprice = require("../../models/compareprice/compareprice.schema")

//เพิ่มใบเปรียบเทียบราคา
module.exports.add = async (req, res) => {
  try {
    const {customer_id,user_id,productdetail,rate,ratename,rateprice,ratesymbol} = req.body
    // gen อ้างอิง
    const startDate = new Date();
    // สร้างวันที่ของวันถัดไป
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    // ปรับเวลาให้เป็นเริ่มต้นของวัน
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const comparepricedata = await Compareprice.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      });

     
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const referenceNumber = String(comparepricedata.length).padStart(5, '0')
    const refno = `${currentDate}${referenceNumber}`
    const data = new Compareprice({
        customer_id:customer_id,
        user_id:user_id,
        refno:refno,
        productdetail:productdetail,
        rate:rate,
        ratename:ratename,
        rateprice:rateprice,
        ratesymbol: ratesymbol, 
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบเปรียบเทียบราคา",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const comparepricedata = await Compareprice.find()
    .populate('customer_id')
    .populate('user_id')
    if (!comparepricedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
    }
    return res.status(200).send({ status: true, data: comparepricedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.getcustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const comparepricedata = await Compareprice.find({customer_id:id})
    .populate('customer_id')
    .populate('user_id')
    if (!comparepricedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
    }
    return res.status(200).send({ status: true, data: comparepricedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const comparepricedata = await Compareprice.findOne({ _id: req.params.id }).populate('customer_id')
    .populate('customer_id')
    .populate('user_id')
    if (!comparepricedata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
    }
    return res.status(200).send({ status: true, data: comparepricedata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลใบเปรียบเทียบราคา
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const comparepricedata = await Compareprice.findById(id)
    if (!comparepricedata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
    }
    const {productdetail,rate,ratename,rateprice,ratesymbol} = req.body
    const data = {
      productdetail:productdetail, //(ชื่อ)
      rate:rate,
      ratename:ratename,
      rateprice:rateprice,
      ratesymbol: ratesymbol, 
    }
    const edit = await Compareprice.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลใบเปรียบเทียบราคาเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลใบเปรียบเทียบราคา
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const comparepricedata = await Compareprice.findOne({ _id: id });
    if (!comparepricedata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบเปรียบเทียบราคา" });
    }
    const deletesupplier = await Compareprice.findByIdAndDelete(id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
