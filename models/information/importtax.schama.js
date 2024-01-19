const mongoose = require("mongoose");

const ImporttaxSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อภาษีนำเข้า)
    price:{type:Number}
  },
  {timestamps: true}
);

const Importtax = mongoose.model("importtax", ImporttaxSchema);

module.exports = Importtax;