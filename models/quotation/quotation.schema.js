const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const quotationSchema = new mongoose.Schema(
  { 
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(ชื่อลูกค้า)
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสแผนกขาย)
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    status:{type:Boolean,default:false},
    statusdetail:{type:[{
        status:{type:String},
	    date:{type:Date,default:Date.now()},
    }],default:null},
    productdetail:{type:[{
        product_id :{type: mongoose.Schema.Types.ObjectId,ref:'product'}, //(ข้อมูลสินค้า)
	    name:{type:String}, // (ชื่อสินค้า)
        brand: {type: mongoose.Schema.Types.ObjectId,ref:'brand'},
        image:{type:String},
        producttype:{type:mongoose.Schema.Types.ObjectId,ref:'producttype'},
        quantity:{type:Number},//(จำนวน)
        supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
        price :{type:Number},
	    total:{type:Number} //(ราคารวมในสินค้า)
    }],default:null},    
    total:{type:Number,default:0}, //(ราคารวมสินค้า)
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0} //(ราคารวมทั้งหมด)
  },
  {timestamps: true}
);

const Quotation = mongoose.model("quotation", quotationSchema);

module.exports = Quotation;