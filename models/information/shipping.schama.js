const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ค่าขนส่ง)
    price:{type:Number}
  },
  {timestamps: true}
);

const Shipping = mongoose.model("shipping", ShippingSchema);

module.exports = Shipping;