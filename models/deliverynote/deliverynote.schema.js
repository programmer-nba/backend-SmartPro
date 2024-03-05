const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const deliverynoteSchema = new mongoose.Schema(
  { 
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(ชื่อลูกค้า)
    contact_id:{type: mongoose.Schema.Types.ObjectId,ref:'contact',required:true} ,//(ชื่อผู้ติดต่อ)
    logistic_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null} ,//(ชื่อพนักงานขนส่ง)
    order_id:{type: mongoose.Schema.Types.ObjectId,ref:'order',default:null}, //(รหัสใบสั่งซื้อ)
    reforder:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    productdetail:{type:[{
        product_id :{type: mongoose.Schema.Types.ObjectId,ref:'product'}, //(ข้อมูลสินค้า)
        product_name:{type:String}, // (ชื่อสินค้า)
        brand: {type: mongoose.Schema.Types.ObjectId,ref:'brand'},
        image:{type:String},
        quantity:{type:Number},//(จำนวน)
        unit:{type:String}, // หน่วย
        rate: {type:mongoose.Schema.Types.ObjectId,ref:'rate'},
        rate_name: {type:String},
        rate_rateprice: {type:Number},
        rate_symbol: {type:String},
        supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'},
        price :{type:Number}, // ราคาต้นทุน
        priceprofit:{type:Number}, // ราคา +กำไรแล้ว
        discount:{type:Number}, //เพิ่มเข้ามาใหม่
        numdiscount:{type:Number},
	    total:{type:Number} //(ราคารวมในสินค้า)
    }],default:null},
     ////
     rate:{type: mongoose.Schema.Types.ObjectId,ref:'rate',default:null},
     ratename:{type:String,default:""},
     rateprice:{type:Number,default:0},
     ratesymbol: {type:String,default:""},
     ////
    warranty:{type:String,default:""}, //ประกัน
    timeofdelivery: {type:String,default:""} ,//กำหนดส่งของ
    paymentterm :{type:String,default:""}, //เงื่อนไขการชำระเงิน
    remark:{type:String,default:""},
    //
    total:{type:Number,default:0}, //(ราคารวมสินค้า)
    priceprofit:{type:Number,default:0}, // ราคา +กำไรแล้ว
    profitpercent:{type:Number,default:0}, // ค่าเปอร์เซ็นต์ดำเนินการ
    profit:{type:Number,default:0}, // กำไร
    //
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
    //ส่วนเพิ่มใหม่
    project: {type:String,default:""},
    discount:{type:Number}, //เพิ่มเข้ามาใหม่
    totalprofit:{type:Number,default:0}, //กำไรที่ - กับส่วนลดแล้ว
     ////
     status:{type:Boolean,default:false},
     statusdetail:{type:[{
         status:{type:String},
         date:{type:Date,default:Date.now()},
     }],default:null},
     ///
     evidence:{type:String,default:""}, // หลักฐานการรับของสินค้าของลูกค้า 
    
  },
  {timestamps: true}
);

const Deliverynote = mongoose.model("deliverynote", deliverynoteSchema);

module.exports = Deliverynote;