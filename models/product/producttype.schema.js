const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const producttypeSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อ)
  },
  {timestamps: true}
);

const Producttype = mongoose.model("producttype", producttypeSchema);

module.exports = Producttype;