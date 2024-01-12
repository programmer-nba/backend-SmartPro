const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const customerSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, //(ชื่อบริษัท หรือ ชื่อลูกค้า)
    typecustomer:{type:String,required: true}, //(ประเภทลูกค้า เช่น ในประเทศ , นอกประเทศ)
    address:{type:String,required: true}, //(ที่อยู่) 
    province:{type:String,required: true}, //(จังหวัด)
    amphure:{type:String,required: true}, //(อำเภอ)
    tambon:{type:String,required: true}, //(ตำบล)
    zipcode:{type:String,required:true}, 
    email:{type:String,required: true}, //(อีเมล์)
    contact:{type:String,required: true}, //(ผู้ติดต่อ)
    telephone:{type:String,required: true}, //(เบอร์โทรศัพท์)
    taxcustomerid:{type:String} // เลขประจำตัวผู้เสียภาษี
  },
  {timestamps: true}
);

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;