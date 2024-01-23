const { Double } = require("mongodb");
const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const quotationsupplierSchema = new mongoose.Schema(
  {
    quotationnumber :{type:String,default:""}, //(เลขใบที่ซัพพลายเออร์ไปให้)
    originproducts:{type:String,default:""},
    order_code:{type:String,default:""}, //(เลขรหัสออเดอร์ใบเสนอราคาจากซัพพลายเออร์)
    delivery:{type:String,default:""}, //  (เวลาในการจัดส่ง)
    dateoffer:{type:Date,default:""}, // (วันที่เสนอไป)
    payment :{type:String,default:""},//(การจ่ายเงิน)
    remark:{type:String,default:""}, //(หมายเหตุ)
    supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'}, // (รหัสซัพพลาย)
    filequotation:{type:String,default:""},
    fileemail:{type:String,default:""}
  },
  {timestamps: true}
);

const Quotationsupplier = mongoose.model("quotationsupplier", quotationsupplierSchema);

module.exports = Quotationsupplier;