const Order = require("../../models/order/order.schema"); 

const Purchaseorder = require("../../models/purchaseorder/purchaseorder.schema") 
//ดึงข้อมูลทั้งหมด
module.exports.getall = async (req, res) => {
  try {
    const orderdata = await Order.find()
    .populate('customer_id')
    .populate('contact_id')
    .populate('sale_id')
    .populate({
      path:'quotation_id',
      populate:[
        {path:'customer_id'},
        {path:'user_id'},
      ]
    })
    .populate({
      path:'invoiceid',
      populate:[
        {path:'customer_id'},
        {path:'sale_id'},
        {path:'account_id'},
        {path:'contact_id'}
      ]
    }).populate({
      path:'purchaseorder._id',
      populate:[
        {path:'supplier_id'},
        {path:'sale_id'},
        {path:'procurement_id'}
      ]
    }).populate(
      {
        path:'compareprice_id',
        populate:[
          {path:'supplier1'},
          {path:'supplier2'},
          {path:'supplier3'},
          {path:'supplier4'},
          {path:'supplier5'},
          {path:'supplier6'},
          {path:'supplierpro1'},
          {path:'supplierpro2'},
          {path:'supplierpro3'},
          {path:'supplierpro4'},
          {path:'supplierpro5'},
          {path:'supplierpro6'},
        ]
      }).populate('procurement_id').populate(
        {
          path:'deliverynoteid',
          populate:[
            {path:'customer_id'},
            {path:'logistic_id'},
          ]
        });
    
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
    const orderdata = await Order.findOne({ _id: req.params.id })
    .populate('customer_id')
    .populate('contact_id')
    .populate('sale_id')
    .populate({
      path:'quotation_id',
      populate:[
        {path:'customer_id'},
        {path:'user_id'},
      ]
    })
    .populate({
      path:'invoiceid',
      populate:[
        {path:'customer_id'},
        {path:'sale_id'},
        {path:'account_id'},
        {path:'contact_id'}
      ]
    }).populate({
      path:'purchaseorder._id',
      populate:[
        {path:'supplier_id'},
        {path:'sale_id'},
        {path:'procurement_id'}
      ]
    }).populate(
      {
        path:'compareprice_id',
        populate:[
          {path:'supplier1'},
          {path:'supplier2'},
          {path:'supplier3'},
          {path:'supplier4'},
          {path:'supplier5'},
          {path:'supplier6'},
          {path:'supplierpro1'},
          {path:'supplierpro2'},
          {path:'supplierpro3'},
          {path:'supplierpro4'},
          {path:'supplierpro5'},
          {path:'supplierpro6'},
        ]
      }).populate('procurement_id')
      .populate(
        {
          path:'deliverynoteid',
          populate:[
            {path:'customer_id'},
            {path:'logistic_id'},
          ]
        });
    if (!orderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    return res.status(200).send({ status: true, data: orderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};


// เพิ่มออเดอร์ เมื่อลูกค้าต้องการออเดอร์
module.exports.addorder =  async (req,res)=>{
    try{
      //ทำการgenerate reforder ขึ้นต้นด้วย Order ตามด้วยปีเดือน และเลขที่เอกสารตามลำดับ
      const startDate = new Date(new Date().setHours(0, 0, 0, 0)); // เริ่มต้นของวันนี้
      const endDate = new Date(new Date().setHours(23, 59, 59, 999)); // สิ้นสุดของวันนี้
      const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const referenceNumber = String(await Order.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments()).padStart(5, '0');
      const reforder = `Order${currentDate}${referenceNumber}`;
      const data = Order({
        reforder:reforder,
        customer_id:req.body.customer_id,
        contact_id:req.body.contact_id,
        sale_id :req.body.sale_id,
        requested_products :req.body.requested_products,
        status:"ออเดอร์ใหม่",
      })
      const add = await data.save();
      return res.status(200).send({ status: true, data: add });
    }catch (error){
      return res.status(500).send({ status: false, error: error.message });
      
    }
}

module.exports.editorder = async (req, res) => { 
  try{

    const id = req.params.id
    const orderdata = await Order.findById(id);
    if (!orderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const data = {
      customer_id:req.body.customer_id,
      contact_id:req.body.contact_id,
      sale_id :req.body.sale_id,
      requested_products :req.body.requested_products,
    }
    const edit = await Order.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล Order เรียบร้อย",data: edit});
    
  }catch (error){ 
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

//ค่าคอมมิสชั่น
const Commission = require("../../models/information/commission.schama");
//ผ่านงาน
module.exports.acceptdeal = async (req, res) => {
  try {

    let upload = multer({ storage: storage }).array("filedata", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let file = '' // ตั้งตัวแปรรูป
      //ถ้ามีรูปให้ทำฟังก์ชั่นนี้ก่อน
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        file = reqFiles[0]
      }

    const id = req.params.id
    const orderdata = await Order.findById(id)
    if (!orderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const commission =  await Commission.find();
    const data = {
      dealstatus:true,
      status:"ดีลงานผ่านแล้ว",
      dealremark:req.body.dealremark,
      file:file,
      commissionpercent:commission[0]?.percent,
       //วันจะที่จบดีลวันที่ผ่าน  
      dealenddate: Date.now() ,
      //วันที่ต้องส่งของให้กับลูกค้า
      deliverydate:req.body.deliverydate,
    }
    const edit = await Order.findByIdAndUpdate(id,data,{new:true})
    return res.status(200).send({status: true,message: "ดีลงานผ่านแล้ว",data: edit});

    });
    
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

// ไม่ผ่านงาน
module.exports.unacceptdeal = async (req, res) => {
  try {
    const id = req.params.id
    const orderdata = await Order.findById(id);
    if (!orderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const data = {
      dealstatus:false,
      status:"ดีลงานไม่ผ่าน",
      dealremark:req.body.dealremark,
    }
   
    const edit = await Order.findByIdAndUpdate(id,data,{new:true});

    return res.status(200).send({status: true,message: "ดีลงานไม่ผ่าน",data: edit});
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//เปิดใบสั่งซื้อ
module.exports.openop = async (req,res)=>{
  try {
    const id= req.params.id;
    const orderdata = await Order.findById(id);
    if (!orderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const data ={
      status:"เปิดใบสั่งซื้อ",
      procurement_id:req.body.procurement_id,
    }
    const edit = await Order.findByIdAndUpdate(id,data,{new:true});
    return res.status(200).send({ status: true, message: "เปิดใบสั่งซื้อสำเร็จ", data: edit });
  } catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
}




//จัดส่งสินค้าให้กับลูกค้า
module.exports.delivery = async (req,res)=>{
  try {
    const id = req.params.id
    const orderdata = await Order.findById(id);
    if (!orderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const data ={
      logistic_id:req.body.logistic_id,
      date_delivery:req.body.date_delivery,
      status:"จัดส่งให้กับลูกค้าแล้ว",

    }
    const edit = await Order.findByIdAndUpdate(id,data,{new:true});
    return res.status(200).send({ status: true, message: "จัดส่งสินค้าให้กับลูกค้าสำเร็จ", data: edit });
  } catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
}

//ลูกค้าตรวจสอบสินค้าแล้ว
module.exports.customercheck = async (req,res)=>{
  try {
    const id = req.params.id
    const orderdata = await Order.findById(id);
    if (!orderdata) {
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const data ={
      date_customer_delivery:req.body.date_customer_delivery,
      deliverycustomerstatus:true,
      status:"จัดส่งสมบูรณ์",

    }
    const edit = await Order.findByIdAndUpdate(id,data,{new:true});
    return res.status(200).send({ status: true, message: "ลูกค้าตรวจสอบสินค้าแล้ว", data: edit });
  } catch(error){
    return res.status(500).send({ status: false, error: error.message });
  }
}

//ดึงข้อมูล by sale_id
module.exports.getbysaleid = async (req, res) => {
  try {
    const orderdata = await Order.find({ sale_id: req.params.id })
    .populate('customer_id')
    .populate('contact_id')
    .populate('sale_id')
    .populate({
      path:'quotation_id',
      populate:[
        {path:'customer_id'},
        {path:'user_id'},
      ]
    })
    .populate({
      path:'invoiceid',
      populate:[
        {path:'customer_id'},
        {path:'sale_id'},
        {path:'account_id'},
        {path:'contact_id'}
      ]
    }).populate({
      path:'purchaseorder._id',
      populate:[
        {path:'supplier_id'},
        {path:'sale_id'},
        {path:'procurement_id'}
      ]
    }).populate(
      {
        path:'compareprice_id',
        populate:[
          {path:'supplier1'},
          {path:'supplier2'},
          {path:'supplier3'},
          {path:'supplier4'},
          {path:'supplier5'},
          {path:'supplier6'},
          {path:'supplierpro1'},
          {path:'supplierpro2'},
          {path:'supplierpro3'},
          {path:'supplierpro4'},
          {path:'supplierpro5'},
          {path:'supplierpro6'},
        ]
      }).populate('procurement_id').populate(
        {
          path:'deliverynoteid',
          populate:[
            {path:'customer_id'},
            {path:'logistic_id'},
          ]
        });;
    if (!orderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    return res.status(200).send({ status: true, data: orderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};



// //แก้ไขข้อมูล order
// module.exports.edit = async (req, res) => {
//   try {
//     const id = req.params.id
//     const orderdata = await Order.findById(id)
//     if (!orderdata) {
//         return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
//     }
  
//     const data = {
//       refno:req.body.refno, //(เลขที่เอกสาร)
//       customer_id:req.body.customer_id ,//(รหัสลูกค้า)
//       sale_id:req.body.sale_id,//(รหัสSales Department )
//       procurement_id:req.body.procurement_id, //(รหัส procurement)
//       quotation_id:req.body.quotation_id, //รหัสใบเสนอราคา
//       purchaseorder:req.body.purchaseorder,
//       date :req.body.date, //(วันที่ลงเอกสาร) 
//       productdetail:req.body.productdetail,
//       ////
//       rate:req.body.rate,
//       ratename:req.body.ratename,
//       rateprice:req.body.rateprice,
//       ratesymbol: req.body.ratesymbol,
//       ////
//       total:req.body.total, //(ราคารวมสินค้า)
//       profitpercent:req.body.profitpercent, // ค่าเปอร์เซ็นต์ดำเนินการ
//       profit:req.body.profit, // ค่าดำเนินการ
//       tax:req.body.tax, //(หักภาษี 7 %)
//       alltotal:req.body.alltotal, //(ราคารวมทั้งหมด)
//       status:req.body.status,
//       statusdetail:req.body.statusdetail,
//       file:req.bodyfile
//     }
//     const edit = await Order.findByIdAndUpdate(id,data,{new:true})
//     return res.status(200).send({status: true,message: "คุณได้แก้ไขข้อมูล Brand เรียบร้อย",data: edit});
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };

// //ลบข้อมูล brand
// module.exports.delete = async (req, res) => {
//   try {
//     const id = req.params.id
//     const orderdata = await Order.findOne({ _id: id });
//     if (!orderdata) {
//       return res.status(200).send({ status: false, message: "ไม่มีข้อมูลOrder" });
//     }
//     const deletesupplier = await Order.findByIdAndDelete(req.params.id);
//     return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
//   } catch (error) {
//     return res.status(500).send({ status: false, error: error.message });
//   }
// };





const calculatorrate = (num,rate,rate_id,main_rate,mate_price) =>{
       
  if(main_rate != rate_id)
  {
      
    if(mate_price !=0)
    {
      const ratetotal= (num*rate)/mate_price
      return parseFloat(Math.ceil(ratetotal).toFixed(2))
    }
  }
  
   return  parseFloat(num.toFixed(2))
}