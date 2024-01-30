const Order = require("../../models/order/order.schema");
const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema") 

//เพิ่มใบสั่งซื้อสินค้าเรียบร้อยแล้ว
module.exports.add = async (req, res) => {
  try {
    const {supplier_id,sale_id,procurement_id,productdetail,rate,ratename,rateprice,ratesymbol,total,tax,alltotal,order_id} = req.body
    const startDate = new Date();
    // สร้างวันที่ของวันถัดไป
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 1);
    // ปรับเวลาให้เป็นเริ่มต้นของวัน
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    const purchaseorderprice = await Purchaseorder.find({
        createdAt: {
          $gte: startDate,
          $lt: endDate
        }
      });
    const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const referenceNumber = String(purchaseorderprice.length).padStart(5, '0')
    const refno = `PO${currentDate}${referenceNumber}`
    
    const findquotation = await Order.findById(order_id)
    const data = new Purchaseorder({
        supplier_id: supplier_id ,//(บริษัทซัพพลายเออร์)
        sale_id:sale_id,//(รหัสSales Department )
        procurement_id:procurement_id, //(รหัส procurement)
        quotation_id:findquotation?.quotation_id, //รหัสใบสั่งซื้อสินค้าเรียบร้อยแล้ว
        order_id: order_id,
        refno:refno, //(เลขที่เอกสาร)
        date :Date.now(), //(วันที่ลงเอกสาร)
        productdetail:productdetail,
        rate:rate,
        ratename:ratename,
        rateprice:rateprice,
        ratesymbol:ratesymbol,
        total:total, //(ราคารวมสินค้า)
        tax:tax, //(หักภาษี 7 %)
        alltotal:alltotal, //(ราคารวมทั้งหมด)
      });
      const add = await data.save();
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบสั่งซื้อสินค้าแล้ว",data: add});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const purchaseorderdata = await Purchaseorder.find()
    .populate('supplier_id')
    .populate('sale_id')
    .populate('procurement_id');
    if (!purchaseorderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }
    return res.status(200).send({ status: true, data: purchaseorderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

module.exports.getorder = async (req, res) => {
    try {
        const purchaseorderdata = await Purchaseorder.find({ order_id: req.params.id })
        .populate('supplier_id')
        .populate('sale_id')
        .populate('procurement_id');
        if (!purchaseorderdata) {
          return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
        }
        return res.status(200).send({ status: true, data: purchaseorderdata });
      } catch (error) {
        return res.status(500).send({ status: false, error: error.message });
      }
  };
//ดึงข้อมูล by id
module.exports.getbyid = async (req, res) => {
  try {
    const purchaseorderdata = await Purchaseorder.findOne({_id: req.params.id })
    .populate('supplier_id')
    .populate('sale_id')
    .populate('procurement_id');
    if (!purchaseorderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }
    return res.status(200).send({ status: true, data: purchaseorderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูลใบสั่งซื้อสินค้าเรียบร้อยแล้ว
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const purchaseorderdata = await Purchaseorder.findById(id)
    if (!purchaseorderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }
    const {productdetail,total,tax,alltotal,rate,ratename,rateprice,ratesymbol} = req.body
    const data = {
        productdetail:productdetail,
        rate:rate,
        ratename:ratename,
        rateprice:rateprice,
        ratesymbol:ratesymbol,
        total:total, //(ราคารวมสินค้า)
        tax:tax, //(หักภาษี 7 %)
        alltotal:alltotal, //(ราคารวมทั้งหมด)
    }
    const edit = await Purchaseorder.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูลใบสั่งซื้อสินค้าเรียบร้อยแล้วเรียบร้อย",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//ลบข้อมูลใบสั่งซื้อสินค้าเรียบร้อยแล้ว
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id
    const purchaseorderdata = await Purchaseorder.findOne({ _id: id });
    if (!purchaseorderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }
    const deletequotion = await Purchaseorder.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletequotion });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};