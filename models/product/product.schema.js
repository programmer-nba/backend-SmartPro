const { Double } = require("mongodb");
const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const productSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อสินค้า)
    brand:{type:String}, //(แบรนด์)
    model:{type:String,default:""},
    price: {type: Number,default:0},  
    rate :{type: mongoose.Schema.Types.ObjectId,ref:'rate'}, // (รหัสซัพพลาย)(เรทเงิน)
    image:{type:String,default:null}, //(รูปภาพ)
    spec:{type:String,default:null},
    detail:{type:String,default:""},
    quotationsupplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'quotationsupplier'},
    supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier'}, // (รหัสซัพพลาย)
    producttype:{type: mongoose.Schema.Types.ObjectId,ref:'producttype'},
    unit:{type:String,required:true}
  },
  {timestamps: true}
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;