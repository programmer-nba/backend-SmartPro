const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const RateSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อสกุลเงิน)
    symbol:{type:String,required:true},
    rateprice:{type:Number,required:true}
  },
  {timestamps: true}
);

const Rate = mongoose.model("rate", RateSchema);

module.exports = Rate;