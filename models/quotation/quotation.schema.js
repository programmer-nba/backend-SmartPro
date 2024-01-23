const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const quotationSchema = new mongoose.Schema(
  { 
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',required:true} ,//(ชื่อลูกค้า)
    user_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',required:true},//(รหัสSales Department )
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:Date.now()}, //(วันที่ลงเอกสาร)
    status:{type:Boolean,default:false},
    statusdetail:{type:[{
        status:{type:String},
	    date:{type:Date,default:Date.now()},
    }],default:null},
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
    ////

    total:{type:Number,default:0}, //(ราคารวมสินค้า)
    ///
    profitpercent:{type:Number,default:0}, // ค่าเปอร์เซ็นต์ดำเนินการ
    profit:{type:Number,default:0}, // ค่าดำเนินการ
    //
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
    //ส่วนการดีลงาน
    statusdeal:{type:Boolean,default:false},
    statusdealdetail:{type:[{
      status:{type:String},
      date:{type:Date,default:Date.now()},
    }],default:null},
    dealremark:{type:String,default:""},
    file:{type:String,default:""}
  },
  {timestamps: true}
);

const Quotation = mongoose.model("quotation", quotationSchema);

module.exports = Quotation;