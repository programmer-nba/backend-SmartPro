const Order = require("../../models/order/order.schema"); 


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
    const orderdata = await Order.findOne({ _id: req.params.id }).populate({
      path:'quotation_id',
      populate:[
          {path:"customer_id"},
          {path:"user_id"},
      ]
  })
  .populate('purchaseorder.purchaseorder_id')
  .populate('customer_id');;
    if (!orderdata) {
      return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    return res.status(200).send({ status: true, data: orderdata });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};

//แก้ไขข้อมูล order
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id
    const orderdata = await Order.findById(id)
    if (!orderdata) {
        return res.status(404).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
  
    const data = {
      refno:req.body.refno, //(เลขที่เอกสาร)
      customer_id:req.body.customer_id ,//(รหัสลูกค้า)
      sale_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสSales Department )
      procurement_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null}, //(รหัส procurement)
      quotation_id:{type: mongoose.Schema.Types.ObjectId,ref:'quotation',required:true}, //รหัสใบเสนอราคา
      purchaseorder:{type:[{purchaseorder_id:{type: mongoose.Schema.Types.ObjectId,ref:'purchaseorder'}}]},
      date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร) 
      productdetail:{type:[{
          status:{type:Boolean,default:false},
          product_id :{type: mongoose.Schema.Types.ObjectId,ref:'product'}, //(ข้อมูลสินค้า)
          product_name:{type:String}, // (ชื่อสินค้า)
          brand: {type: mongoose.Schema.Types.ObjectId,ref:'brand'},
          image:{type:String},
          quantity:{type:Number},//(จำนวน)
          price :{type:Number},
          rate: {type:mongoose.Schema.Types.ObjectId,ref:'rate'},
          rate_name: {type:String},
          rate_rateprice: {type:Number},
          rate_symbol: {type:String},
          supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
        total:{type:Number} //(ราคารวมในสินค้า)
      }],default:null},
      ////
      rate:{type: mongoose.Schema.Types.ObjectId,ref:'rate',default:null},
      ratename:{type:String,default:""},
      rateprice:{type:Number,default:0},
      ratesymbol: {type:String,default:""},
      ////
      total:{type:Number,default:0}, //(ราคารวมสินค้า)
      profitpercent:{type:Number,default:0}, // ค่าเปอร์เซ็นต์ดำเนินการ
      profit:{type:Number,default:0}, // ค่าดำเนินการ
      tax:{type:Number,default:0}, //(หักภาษี 7 %)
      alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
      status:{type:String,default:"รอเปิดใบสั่งซื้อ"},
      statusdetail:{type:[{
          status:{type:String},
          date:{type:Date,default:Date.now()}
      }],default:null},
      file:{type:String,default:""}
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
      return res.status(200).send({ status: false, message: "ไม่มีข้อมูลOrder" });
    }
    const deletesupplier = await Brand.findByIdAndDelete(req.params.id);
    return res.status(200).send({ status: true, message: "ลบข้อมูลสำเร็จ", data: deletesupplier });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};