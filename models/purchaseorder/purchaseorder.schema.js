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
        unit:{type:String},
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
    //เพิ่มต่อ
	  statusapprove:{type:Boolean,default:false},
	  approvedetail:{type:[{
      status:{type:String},
      date:{type:Date,default:Date.now()}
    }],default:null},
	  statusshipping:{type:Boolean,default:false},
	  shippingdetail:{type:[{
      status:{type:String},
      date:{type:Date,default:Date.now()}
    }],default:null},
	  //เก็บข้อมูล
	  hscode:{type:String,default:""},
    importtax:{type:Number,default:0},//ภาษีนำเข้า
    shippingcost:{type:Number,default:0}, //ค่าขนส่ง
    operationcost :{type:Number,default:0}, //ค่าดำเนินงานต่างๆ
    //
    imageproduct:{type:String,default:""}, //เก็บข้อมูลรูปภาพสินค้า
    serialnumber:{type:String,default:""},
    dateget: {type:Date,default:Date.now()},//วันที่ได้รับสินค้า
    warranty:{type:Date,default:Date.now()} ,//ระยะเวลารับประกันสินค้า
    deliverystatus:{type:String,default:""}, //ปรมาณว่าจะส่งตามดิวไหม 
    file:{type:String,default:""},
    statusshippingcustomer: {type:Boolean,default:false},
  },
  {timestamps: true}
);

const Purchaseorder = mongoose.model("purchaseorder", purchaseorderSchema);

module.exports = Purchaseorder;