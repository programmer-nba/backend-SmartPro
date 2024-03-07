const Order = require("../../models/order/order.schema");
const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema") 
const Deliverynote = require("../../models/deliverynote/deliverynote.schema")

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
        approvedetail:[{status:"รออนุมัติ",date:Date.now()}],
        warrantyproduct:req.body.warrantyproduct,//ระยะเวลารับประกันสินค้า
        deliveryproduct:req.body.deliveryproduct, //กำหนดการส่งของ
        paymentproduct:req.body.paymentproduct, //เงื่อนไขการชำระเงิน
        remake:req.body.remake, //หมายเหตุ
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
        warrantyproduct:req.body.warrantyproduct,//ระยะเวลารับประกันสินค้า
        deliveryproduct:req.body.deliveryproduct, //กำหนดการส่งของ
        paymentproduct:req.body.paymentproduct, //เงื่อนไขการชำระเงิน
        remake:req.body.remake, //หมายเหตุ
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
    

    
    return res.status(200).send({status: true,message: "ใบสั่งซื้อได้รับการอนุมัติแล้ว",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//admin อนุมัติด้วย order
module.exports.acceptorder = async (req, res) => {
    try{
      const order_id = req.params.id;
      const order = await Order.findById(order_id).populate('purchaseorder');
      if(order == undefined)
      {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
      }
     order.purchaseorder.forEach(async (element) => {
      const id = element._id
      const purchaseorderdata = await Purchaseorder.findOne({_id: id });
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
      const edit = await Purchaseorder.findByIdAndUpdate(id ,data,{new:true})

     });
     return res.status(200).send({status: true,message: "ใบสั่งซื้อได้รับการอนุมัติแล้ว"});

    }catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
}

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
    productshipped?.shippingdetail.push({status:"จัดส่งแล้ว",date:Date.now()})

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
    const edit = await Purchaseorder.findByIdAndUpdate(id,data,{new:true});
    const checkstatusorder = await Purchaseorder.find({order_id:edit?.order_id,statusshipping:false})
    if(checkstatusorder.length == 0){
      
      const order = await Order.findById(edit?.order_id).populate('quotation_id'); 
      const deliverynote = new Deliverynote({
        customer_id:order?.customer_id,//(ชื่อลูกค้า)
        contact_id:order?.contact_id,//(ชื่อผู้ติดต่อ)
        order_id:order?._id, //(รหัสใบสั่งซื้อ)
        reforder:order?.reforder, //(เลขที่เอกสาร)
        date :Date.now(), //(วันที่ลงเอกสาร)
        productdetail: order?.quotation_id?.productdetail,
        ////
        rate:order?.quotation_id?.rate,
        ratename:order?.quotation_id?.ratename,
        rateprice:order?.quotation_id?.rateprice,
        ratesymbol:order?.quotation_id?.ratesymbol,
        ////
        warranty:order?.quotation_id?.warranty, //ประกัน
        timeofdelivery: order?.quotation_id?.timeofdelivery ,//กำหนดส่งของ
        paymentterm :order?.quotation_id?.paymentterm, //เงื่อนไขการชำระเงิน
        remark:order?.quotation_id?.remark,
        //
        total:order?.quotation_id?.total, //(ราคารวมสินค้า)
        priceprofit:order?.quotation_id?.priceprofit, // ราคา +กำไรแล้ว
        profitpercent:order?.quotation_id?.profitpercent, // ค่าเปอร์เซ็นต์ดำเนินการ
        profit:order?.quotation_id?.profit, // กำไร
        //
        tax:order?.quotation_id?.tax, //(หักภาษี 7 %)
        alltotal:order?.quotation_id?.alltotal, //(ราคารวมทั้งหมด)
        //ส่วนเพิ่มใหม่
        project: order?.quotation_id?.project,
        discount:order?.quotation_id?.discount, //เพิ่มเข้ามาใหม่
        totalprofit:order?.quotation_id?.totalprofit, //กำไรที่ - กับส่วนลดแล้ว
        ////
        status:false,
        statusdetail:[{
          status:"รออนุมัติ",
          date:Date.now(),
        }],
      })
      const adddeliverynote = await deliverynote.save();
      const editdata = await Order.findByIdAndUpdate(edit?.order_id,{ status:"รออนุมัติใบส่งของ",deliverynoteid:adddeliverynote?._id},{new:true})
      
    }

    return res.status(200).send({ status: true,message:"คุณได้รับสินค้าแล้ว", data: edit });
  } catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
}

//excel สินค้ามาจัดส่งแล้ว
module.exports.productshippedexcel = async (req,res) =>{
  try{
    const id = req.params.id;
    const productshipped = await Purchaseorder.findOne({refno:id});
    if(productshipped == undefined)
    {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
    }

    if(productshipped?.shippingdetail[productshipped?.shippingdetail.length-1]?.status != "รอการจัดส่ง")
    {
      return res.status(400).send({ status: false, message: "ข้อมูลนี้ไม่อยู่ในสถานะรอการจัดส่ง" });
    }
    const {hscode,importtax,shippingcost,operationcost,serialnumber,dateget,warranty,deliverystatus} = req.body;
    productshipped?.shippingdetail.push({status:"จัดส่งแล้ว",date:Date.now()})

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
    const edit = await Purchaseorder.findOneAndUpdate({refno:id},data,{new:true});
    const checkstatusorder = await Purchaseorder.find({order_id:edit?.order_id,statusshipping:false})
    if(checkstatusorder.length == 0){
      
      const order = await Order.findById(edit?.order_id).populate('quotation_id'); 
      const deliverynote = new Deliverynote({
        customer_id:order?.customer_id,//(ชื่อลูกค้า)
        contact_id:order?.contact_id,//(ชื่อผู้ติดต่อ)
        order_id:order?._id, //(รหัสใบสั่งซื้อ)
        reforder:order?.reforder, //(เลขที่เอกสาร)
        date :Date.now(), //(วันที่ลงเอกสาร)
        productdetail: order?.quotation_id?.productdetail,
        ////
        rate:order?.quotation_id?.rate,
        ratename:order?.quotation_id?.ratename,
        rateprice:order?.quotation_id?.rateprice,
        ratesymbol:order?.quotation_id?.ratesymbol,
        ////
        warranty:order?.quotation_id?.warranty, //ประกัน
        timeofdelivery: order?.quotation_id?.timeofdelivery ,//กำหนดส่งของ
        paymentterm :order?.quotation_id?.paymentterm, //เงื่อนไขการชำระเงิน
        remark:order?.quotation_id?.remark,
        //
        total:order?.quotation_id?.total, //(ราคารวมสินค้า)
        priceprofit:order?.quotation_id?.priceprofit, // ราคา +กำไรแล้ว
        profitpercent:order?.quotation_id?.profitpercent, // ค่าเปอร์เซ็นต์ดำเนินการ
        profit:order?.quotation_id?.profit, // กำไร
        //
        tax:order?.quotation_id?.tax, //(หักภาษี 7 %)
        alltotal:order?.quotation_id?.alltotal, //(ราคารวมทั้งหมด)
        //ส่วนเพิ่มใหม่
        project: order?.quotation_id?.project,
        discount:order?.quotation_id?.discount, //เพิ่มเข้ามาใหม่
        totalprofit:order?.quotation_id?.totalprofit, //กำไรที่ - กับส่วนลดแล้ว
        ////
        status:false,
        statusdetail:[{
          status:"รออนุมัติ",
          date:Date.now(),
        }],
      })
      const adddeliverynote = await deliverynote.save();
      const editdata = await Order.findByIdAndUpdate(edit?.order_id,{ status:"รออนุมัติใบส่งของ",deliverynoteid:adddeliverynote?._id},{new:true})
      
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



// สร้างใบ po จากใบเปรียบเทียบราคา
module.exports.createpo = async (req,res)=>{
  try{
      const selectproduct = req.body.selectproduct;
      
      const order_id = req.body.order_id;
      const procurement_id = req.body.procurement_id;
      const order = await Order.findById(order_id).populate('quotation_id');
      if(order == undefined){
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลใบสั่งซื้อนี้" });
      }
      const supplier_id  =[];
      selectproduct.forEach(async (element) => {
        const find = supplier_id.findIndex(items=>JSON.parse(JSON.stringify(items?.supplier_id)) ==JSON.parse(JSON.stringify(element?.supplier_id?._id)));
        
        if(find ==-1){
          supplier_id.push({supplier_id:element.supplier_id._id})
        }
      });

      let editdata = order.purchaseorder;
      supplier_id.forEach(async (element) => {
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
        // ค้นหาสินค้าที่อยู่ ในsupplier นั้น
        const rateproduct  =  selectproduct.filter(items=>JSON.parse(JSON.stringify(items?.supplier_id?._id)) == JSON.parse(JSON.stringify(element?.supplier_id)))
        
        const total = rateproduct.reduce((a, b) => a + (b['price'] || 0), 0)
        const tax = total * 0.07
        const alltotal = total + tax
        
        const productdetail = [];
        rateproduct.forEach(async (dataproduct) => {
          productdetail.push({
            product_id :dataproduct?._id, //(ข้อมูลสินค้า)
            product_name:dataproduct?.name, // (ชื่อสินค้า)
            brand: dataproduct?.brand,
            image:dataproduct?.image,
            quantity:dataproduct?.quantity,//(จำนวน)
            price :dataproduct?.price,
            unit:dataproduct?.unit,
            rate: rateproduct[0]?.rate?._id ,
            rate_name: rateproduct[0]?.rate?.name,
            rate_rateprice: rateproduct[0]?.rate?.rateprice,
            rate_symbol: rateproduct[0]?.rate?.symbol,
            supplier_id:element?.supplier_id,
	          total:dataproduct?.price * dataproduct?.quantity //(ราคารวมในสินค้า)
          })
        })
      
        
        const data = new Purchaseorder({
          supplier_id: element.supplier_id,
          sale_id:order.sale_id,
          procurement_id:procurement_id,
          quotation_id:order?.quotation_id?._id,
          order_id: order_id,
          refno:refno, //(เลขที่เอกสาร)
          date :Date.now(), //(วันที่ลงเอกสาร)
          productdetail:productdetail,
          rate:rateproduct[0]?.rate?._id,
          ratename:rateproduct[0]?.rate?.name,
          rateprice:rateproduct[0]?.rate?.rateprice,
          ratesymbol:rateproduct[0]?.rate?.symbol,
          total:total,
          tax:tax,
          alltotal:alltotal,
          statusapprove:false,
          approvedetail:[{status:"รออนุมัติ",date:Date.now()}],
          warrantyproduct:rateproduct[0]?.quotationsupplier_id?.warranty, //ระยะเวลารับประกันสินค้า
          deliveryproduct:rateproduct[0]?.quotationsupplier_id?.delivery, //กำหนดการส่งของ
          paymentproduct:rateproduct[0]?.quotationsupplier_id?.payment, //เงื่อนไขการชำระเงิน
          remake:rateproduct[0]?.quotationsupplier_id?.remake, //หมายเหตุ

        });
        const add = await data.save();
        order.purchaseorder.push({_id:add._id,refpurchaseorder:refno})
        editdata = await Order.findByIdAndUpdate(order_id,{ purchaseorder:order.purchaseorder},{new:true})
      });
     
      
      return res.status(200).send({status: true,message:"คุณได้เพิ่มข้อมูลใบสั่งซื้อสินค้าแล้ว",data: editdata});
       

  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}


