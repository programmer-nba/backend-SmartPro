const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const suppliershippingSchema = new mongoose.Schema(
  {
    quotation_id:{type: mongoose.Schema.Types.ObjectId,ref:'quotation',default:null}, 
    shipping:{type:String,default:""},
    price:{type:Number,default:0}
  },
  {timestamps: true}
);

const Suppliershipping = mongoose.model("suppliershipping", suppliershippingSchema);

module.exports = Suppliershipping;