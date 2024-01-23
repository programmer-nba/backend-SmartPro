const mongoose = require("mongoose");

const typeindustrySchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, //ชื่อประเภทธุรกิจของลูกค้า
  },
  {timestamps: true}
);

const Typeindustry = mongoose.model("typeindustry", typeindustrySchema);

module.exports = Typeindustry;