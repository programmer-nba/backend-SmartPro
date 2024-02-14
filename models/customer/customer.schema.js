const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const customerSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, //(ชื่อบริษัท หรือ ชื่อลูกค้า)
    typebussinecustomer:{type: mongoose.Schema.Types.ObjectId,ref:'typebusinesscustomer',default:null},
    typelndustry:{type: mongoose.Schema.Types.ObjectId,ref:'typeindustry',default:null},
    capitalvalue:{type:Number}, // มูลค่าบริษัท
    address:{type:String,required: true}, //(ที่อยู่) 
    country:{type:String,required:true},
    telephone:{type:String,required: true}, //(เบอร์โทรศัพท์)
    email:{type:String,required: true}, //(อีเมล์)
    contact:{type:String,required: true}, //(ผู้ติดต่อ)
    website:{type:String,required:true},
    taxcustomerid:{type:String,required:true,unique: true}, // เลขประจำตัวผู้เสียภาษี
    remark:{type:String}
  },
  {timestamps: true}
);

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;