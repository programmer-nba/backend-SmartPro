const { Double } = require("mongodb");
const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const productSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อสินค้า)
    brand:{type:String}, //(แบรนด์)
    image:{type:String,default:null}, //(รูปภาพ)
    originproducts:{type:String,default:""},
    model:{type:String,default:""},
    detail:{type:String,default:""},
    order_code:{type:String,default:""}, //(เลขรหัสออเดอร์ใบเสนอราคาจากซัพพลายเออร์)
    price: {type: Number,default:0},  
    rate :{type: mongoose.Schema.Types.ObjectId,ref:'rate'}, // (รหัสซัพพลาย)(เรทเงิน)
    delivery:{type:String,default:""}, //  (เวลาในการจัดส่ง)
    dateoffer:{type:Date,default:""}, // (วันที่เสนอไป)
    quotationnumber :{type:String,default:""}, //(เลขใบที่ซัพพลายเออร์ไปให้)
    payment :{type:String,default:""},//(การจ่ายเงิน)
    remark:{type:String,default:""}, //(หมายเหตุ)
    supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'}, // (รหัสซัพพลาย)
    producttype:{type: mongoose.Schema.Types.ObjectId,ref:'producttype'}
  },
  {timestamps: true}
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;