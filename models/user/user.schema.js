const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const userSchema = new mongoose.Schema(
  {
    username: {type: String, required: true,unique: true},
    password: {type: String, required: true},
    firstname: {type: String, required: true}, // ชื่อจริง
    lastname:{type:String,require:true}, //  นามสกุล
    nickname:{type:String,require:true}, // ชื่อเล่น
    // position:{type:String,require:true}, // ตำแหน่ง
    position:{type:mongoose.Schema.Types.ObjectId,ref:"position"},
    telephone:{type:String},
    image:{type:String,default:null}, // รูปภาพ
    email:{type:String,default:""},
    signature:{type:String,default:null}, // ลายเซ็น
  },
  {timestamps: true}
);

const User = mongoose.model("user", userSchema);

module.exports = User;