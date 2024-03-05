const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const invoiceSchema = new mongoose.Schema(
  { 

    order_id:{type: mongoose.Schema.Types.ObjectId,ref:'order',default:null}, //(รหัสใบสั่งซื้อ)
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',default:null},
    contact_id:{type: mongoose.Schema.Types.ObjectId,ref:'contactcustomer',default:null},
    sale_id :{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
    procurement_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
    refno:{type:String,default:""}, //(เลขที่เอกสาร)
    date :{type:Date,default:null}, //(วันที่ลงเอกสาร)
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
    //
    discount:{type:Number}, //เพิ่มเข้ามาใหม่
    tax:{type:Number,default:0}, //(หักภาษี 7 %)
    alltotal:{type:Number,default:0}, //(ราคารวมทั้งหมด)
    
    //ส่วนเพิ่มใหม่
    project: {type:String,default:""}, //ชื่อโปรเจค
    paymentterm :{type:String,default:""}, //เงื่อนไขการชำระเงิน
    timeofdelivery: {type:Date,default:null} ,//กำหนดส่งของ  
    remark:{type:String,default:""},

    stauts:{type:String}, 
    
    account_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
    // การชำระเงิน
    silp:{type:String,default:""},
    dateofpayment:{type:Date,default:null}, //วันที่ชำระเงิน
    //วันที่คาดการจะวางบิล
    datepredictbill:{type:Date,default:null},
    //วันที่ลูกค้าต้องชำระเงิน
    datepredictpaybill:{type:Date,default:null},
    

  },
  {timestamps: true}
);

const Invoice = mongoose.model("invoice", invoiceSchema);

module.exports = Invoice;