const Order = require("../../models/order/order.schema");
const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema") 

//เพิ่มใบสั่งซื้อสินค้าเรียบร้อยแล้ว
module.exports.add = async (req, res) => {
  try {
    const {supplier_id,sale_id,procurement_id,productdetail,rate,ratename,rateprice,ratesymbol,total,tax,alltotal,order_id,quotation_id} = req.body
    const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
    const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
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
        quotation_id:quotation_id, //รหัสใบสั่งซื้อสินค้าเรียบร้อยแล้ว
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
        statusapprove:false,
        approvedetail:[{status:"รออนุมัติ",date:Date.now()}]
      });
      const add = await data.save();
      const order = await Order.findById(order_id);
      order.purchaseorder.push({_id:add._id,refpurchaseorder:refno})
      const editdata = await Order.findByIdAndUpdate(order_id,{ purchaseorder:order.purchaseorder},{new:true})
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
    //ลบข้อมูลorder ดว้ย
    const order = await Order.findById(purchaseorderdata?.order_id);
    order.purchaseorder.pull({_id:id})
    const editdata = await Order.findByIdAndUpdate(purchaseorderdata?.order_id,{ purchaseorder:order.purchaseorder},{new:true})
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletequotion });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};



//admin อนุมัติ
module.exports.accept = async (req, res) => {
  try {
    const id = req.params.id
    const purchaseorderdata = await Purchaseorder.findOne({ _id: id });
    if (!purchaseorderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลใบเสนอราคา" });
    }
    purchaseorderdata.approvedetail.push({status:"ออกใบสั่งซื้อสำเร็จ",date:Date.now()})
    
    const data ={
      statusapprove:true,
      approvedetail:purchaseorderdata.approvedetail,
      shippingdetail:[{
        status:"รอการจัดส่ง",
        date:Date.now()
      }]
    }
    const edit = await Purchaseorder.findByIdAndUpdate(id,data,{new:true})
    const checkstatusorder = await Purchaseorder.find({order_id:purchaseorderdata?.order_id,statusapprove:false })
    
    if(checkstatusorder.length == 0){

      const order = await Order.findById(purchaseorderdata?.order_id);
      const editdata = await Order.findByIdAndUpdate(purchaseorderdata?.order_id,{ status:"รอการจัดส่งสินค้า"},{new:true})
    }

    
    return res.status(200).send({status: true,message: "ใบสั่งซื้อได้รับการอนุมัติแล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//สินค้ามาจัดส่งแล้ว
module.exports.productshipped = async (req,res) =>{
  try{
    const id = req.params.id;
    console.log(id);
    const productshipped = await Purchaseorder.findById(id);
    if(productshipped == undefined)
    {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }
    const {hscode,importtax,shippingcost,operationcost,serialnumber,dateget,warranty,deliverystatus} = req.body;
    productshipped?.shippingdetail.push({status:"รอจัดส่งให้ลูกค้า",date:Date.now()})

    const data ={
      statusshipping:true,
      hscode:hscode,
      importtax:importtax,
      shippingcost:shippingcost,
      operationcost:operationcost,
      serialnumber:serialnumber,
      dateget:dateget,
      warranty:warranty,
      statusshippingcustomer:false,
      deliverystatus:deliverystatus,
      shippingdetail:productshipped?.shippingdetail,
    }
    const edit =await Purchaseorder.findByIdAndUpdate(id,data,{new:true});
    const checkstatusorder = await Purchaseorder.find({order_id:edit?.order_id,statusshipping:false})
    if(checkstatusorder.length == 0){

      const order = await Order.findById(edit?.order_id); 
      const editdata = await Order.findByIdAndUpdate(edit?.order_id,{ status:"รอจัดส่งให้ลูกค้า",deliverystatus:true},{new:true})
    }

    return res.status(200).send({ status: true,message:"คุณได้รับสินค้าแล้ว", data: edit });
  } catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
}

const multer = require("multer");
const {
  uploadFileCreate,
  deleteFile,
} = require("../../functions/uploadfilecreate");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    //console.log(file.originalname);
  },
});

//เพื่มรูปภาพสินค้า
module.exports.imageproduct = async (req,res)=>{
  try {
    let upload = multer({ storage: storage }).array("image", 20);
    upload(req, res, async function (err) {
      //เช็คว่ามีข้อมูลก่อนไหม
      const id = req.params.id;
      const purchaseorderdata = await Purchaseorder.findById(id);
      if (!purchaseorderdata) {
        return res
          .status(404)
          .send({ status: false, message: "ไม่มีข้อมูล" });
      }

      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = '' // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }

        //ไฟล์รูป
        image = reqFiles[0]
      }
      
      const data = {
        imageproduct:image
      }
    const edit = await Purchaseorder.findByIdAndUpdate(id, data, { new: true });
    return res
      .status(200)
      .send({
        status: true,
        message: "คุณได้เพิ่มรูปภาพสินค้า",
        data: edit,
      });
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}
//เพิ่มไฟล์เอกสาร
module.exports.file = async (req,res)=>{
  try {
    let upload = multer({ storage: storage }).array("file", 20);
    upload(req, res, async function (err) {
      //เช็คว่ามีข้อมูลก่อนไหม
      const id = req.params.id;
      const purchaseorderdata = await Purchaseorder.findById(id);
      if (!purchaseorderdata) {
        return res
          .status(404)
          .send({ status: false, message: "ไม่มีข้อมูล" });
      }

      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let image = '' // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }

        //ไฟล์รูป
        image = reqFiles[0]
      }
      
      const data = {
        file:image
      }
    const edit = await Purchaseorder.findByIdAndUpdate(id, data, { new: true });
    return res
      .status(200)
      .send({
        status: true,
        message: "คุณได้เพิ่มรูปภาพสินค้า",
        data: edit,
      });
    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}