const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const contactcustomerSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, //(ชื่อจริง)
    nickname:{type:String,required:true}, // ชื่อเล่น
    department:{type:String,required:true},
    position:{type:String,required:true},
    telephone:{type:String,default:""},
    mobile:{type:String,default:""},
    email:{type:String,required:true},
    lineid:{type:String,default:""},
    facebookid:{type:String,default:""},
    dateofbirth:{type:Date,dafault:null},
    remark:{type:String},
    customer_id:{type: mongoose.Schema.Types.ObjectId,ref:'customer',default:null},
    sale_id:{type: mongoose.Schema.Types.ObjectId,ref:'user',default:null},
  },
  {timestamps: true}
);

const Contactcustomer = mongoose.model("contactcustomer", contactcustomerSchema);

module.exports = Contactcustomer;