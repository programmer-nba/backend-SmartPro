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

    total:{type:Number,default:0}, //(ราคารวมสินค้า)
    ///
    profitpercent:{type:Number,default:0}, // ค่าเปอร์เซ็นต์ดำเนินการ
    profit:{type:Number,default:0}, // กำไร
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
    file:{type:String,default:""},

    //ส่วนเพิ่มใหม่
    project: {type:String,default:""},
    discount:{type:Number}, //เพิ่มเข้ามาใหม่
    totalprofit:{type:Number,default:0}, //กำไรที่ - กับส่วนลดแล้ว
    warranty:{type:String,default:""}, //ประกัน
    timeofdelivery: {type:String,default:""} ,//กำหนดส่งของ
    paymentterm :{type:String,default:""}, //เงื่อนไขการชำระเงิน
    remark:{type:String,default:""},
    priceprofit:{type:Number,default:0},
    //ค่าคอมมิสชั่น
    commissionpercent:{type:Number,default:0},
  },
  {timestamps: true}
);

const Quotation = mongoose.model("quotation", quotationSchema);

module.exports = Quotation;