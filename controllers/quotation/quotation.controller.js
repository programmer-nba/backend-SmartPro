const Quotation = require("../../models/quotation/quotation.schema") 

//เพิ่มใบเสนอราคา
module.exports.add = async (req, res) => {
  try {
    const {customer_id,user_id,productdetail,total,tax,alltotal,rate,ratename,rateprice,ratesymbol,profitpercent,profit} = req.body
    const startDate = new Date();
    // สร้างวันที่ของวันถัดไป
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    // ปรับเวลาให้เป็นเริ่มต้นของวัน
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const quotationprice = await Quotation.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      });
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const referenceNumber = String(quotationprice.length).padStart(5, '0')
    const refno = `PQ${currentDate}${referenceNumber}`
    
    const data = new Quotation({
        customer_id:customer_id,
        user_id:user_id,
        refno:refno ,
        date:Date.now(),
        status:false,
        statusdetail:[{
            status:"รออนุมัติ",
            date:Date.now(),
        }],
        productdetail:productdetail,
        total:total, //(ราคารวมสินค้า)
        rate:rate,
        ratename:ratename,
        rateprice:rateprice,
        ratesymbol:ratesymbol,
        profitpercent:profitpercent, // ค่าเปอร์เซ็นต์ดำเนินการ
        profit:profit, // ค่าดำเนินการ
        tax: tax, //(หักภาษี 7 %)
        alltotal: alltotal //(ราคารวมทั้งหมด)
      });

      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบเสนอราคา",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const quotationdata = await Quotation.find()
    .populate('customer_id')
    .populate('user_id');
    if (!quotationdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    return res.status(200).send({ status: true, data: quotationdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.getcustomer = async (req, res) => {
    try {
        const quotationdata = await Quotation.find({ customer_id: req.params.id })
        .populate('customer_id')
        .populate('user_id');
        if (!quotationdata) {
          return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
        }
        return res.status(200).send({ status: true, data: quotationdata });
      } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
      }
  };
//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const quotationdata = await Quotation.findOne({_id: req.params.id })
    .populate('customer_id')
    .populate('user_id');
    if (!quotationdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    return res.status(200).send({ status: true, data: quotationdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลใบเสนอราคา
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const quotationdata = await Quotation.findById(id)
    if (!quotationdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    const {productdetail,total,tax,alltotal,rate,ratename,rateprice,ratesymbol,profitpercent,profit} = req.body
    const data = {
        productdetail:productdetail,
        total:total, //(ราคารวมสินค้า)
        rate:rate,
        ratename:ratename,
        rateprice:rateprice,
        ratesymbol:ratesymbol,
        profitpercent:profitpercent, // ค่าเปอร์เซ็นต์ดำเนินการ
        profit:profit, // ค่าดำเนินการ
        tax: tax, //(หักภาษี 7 %)
        alltotal: alltotal //(ราคารวมทั้งหมด)
    }
    const edit = await Quotation.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลใบเสนอราคาเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลใบเสนอราคา
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const quotationdata = await Quotation.findOne({ _id: id });
    if (!quotationdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    const deletequotion = await Quotation.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletequotion });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


//admin อนุมัติ
module.exports.accept = async (req, res) => {
    try {
      const id = req.params.id
      const quotationdata = await Quotation.findOne({ _id: id });
      if (!quotationdata) {
        return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
      }
      quotationdata.statusdetail.push({status:"ออกใบเสนอราคาสำเร็จ",date:Date.now()})
      const data ={
        status:true,
        statusdetail:quotationdata.statusdetail
      }
     
      const edit = await Quotation.findByIdAndUpdate(id,data,{new:true})
      return res.status(200).send({status: true,message: "ใบเสนอราคาได้รับการอนุมัติแล้ว",data: edit});
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  };