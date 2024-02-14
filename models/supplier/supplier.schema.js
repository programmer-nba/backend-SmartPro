const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const supplierSchema = new mongoose.Schema(
  {
    name:{type:String,required: true},  //(ชื่อบริษัทของ supplier)
    typeofbusiness:{type: mongoose.Schema.Types.ObjectId,ref:'typeofbusiness',default:null},
    categoryofproducts:{type: mongoose.Schema.Types.ObjectId,ref:'producttype',default:null},
    address:{type:String,required:true},  //(ที่อยู่)
    country:{type:String,required:true},
    telephone:{type:String,required:true}, //(เบอร์โทรศัพท์)
    email:{type:String,required:true}, // (อีเมล์)
    contact:{type:String,required:true}, //(ผู้ติดต่อ)
    website:{type:String,required:true}, //(เว็บไซต์)
    taxid:{type:String,required:true,unique: true},
    remake:{type:String}
  },
  {timestamps: true}
);

const Supplier = mongoose.model("supplier", supplierSchema);

module.exports = Supplier;