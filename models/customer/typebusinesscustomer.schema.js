const mongoose = require("mongoose");

const typebusinesscustomerSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, //ชื่อประเภทธุรกิจของลูกค้า
  },
  {timestamps: true}
);

const Typebusinesscustomer = mongoose.model("typebusinesscustomer", typebusinesscustomerSchema);

module.exports = Typebusinesscustomer;