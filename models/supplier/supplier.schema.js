const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const supplierSchema = new mongoose.Schema(
  {
    name:{type:String,required: true},  //(ชื่อบริษัทของ supplier)
    email:{type:String,required:true}, // (อีเมล์)
    contact:{type:String,required:true}, //(ผู้ติดต่อ)
    telephone:{type:String,required:true}, //(เบอร์โทรศัพท์)
    address:{type:String,required:true},  //(ที่อยู่)
    province:{type:String,required:true}, //(จังหวัด)
    amphure:{type:String,required:true}, //(อำเภอ)
    tambon:{type:String,required:true}, //(ตำบล)
    website:{type:String,required:true} //(เว็บไซต์)

  },
  {timestamps: true}
);

const Supplier = mongoose.model("supplier", supplierSchema);

module.exports = Supplier;