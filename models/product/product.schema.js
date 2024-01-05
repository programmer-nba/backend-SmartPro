const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const productSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อสินค้า)
    price :{type:Number,required: true}, //(ราคา)
    brand:{type: mongoose.Schema.Types.ObjectId,ref:'brand',required:true}, //(แบรนด์)
    image:{type:String,required: true}, //(รูปภาพ)
    producttype:{type: mongoose.Schema.Types.ObjectId,ref:'producttype',required:true}, //(ประเภทสินค้า)
    supplier_id :{type: mongoose.Schema.Types.ObjectId,ref:'supplier',required:true} , //(id ผู้จัดหาสินค้า)
  },
  {timestamps: true}
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;