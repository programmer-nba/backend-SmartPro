const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const orderSchema = new mongoose.Schema(
  { 
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(รหัสลูกค้า)
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
    priceprofit:{type:Number,default:0}, // ราคา+กำไร
    discount: {type:Number,default:0},
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
    status:{type:String,default:"รอเปิดใบสั่งซื้อ"},
    statusdetail:{type:[{
        status:{type:String},
        date:{type:Date,default:Date.now()}
    }],default:null},
    file:{type:String,default:""}
  },
  {timestamps: true}
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;