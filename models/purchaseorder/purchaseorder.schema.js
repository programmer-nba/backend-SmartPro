const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const purchaseorderSchema = new mongoose.Schema(
  { 
    supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier',required:true} ,//(บริษัทซัพพลายเออร์)
    sale_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสSales Department )
    procurement_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true}, //(รหัส procurement)
    quotation_id:{type: mongoose.Schema.Types.ObjectId,ref:'quotation',required:true}, //รหัสใบเสนอราคา
    order_id:{type:mongoose.Schema.Types.ObjectId,ref:'order',required:true},
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    productdetail:{type:[{
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
    total:{type:Number,default:0}, //(ราคารวมสินค้า)
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
  

  },
  {timestamps: true}
);

const Purchaseorder = mongoose.model("purchaseorder", purchaseorderSchema);

module.exports = Purchaseorder;