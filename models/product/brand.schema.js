const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const brandSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อ)
    supplier_id:{type: mongoose.Schema.Types.ObjectId,ref:'supplier',default:null} ,//(รหัส supplier)
  },
  {timestamps: true}
);

const Brand = mongoose.model("c", brandSchema);

module.exports = Brand;