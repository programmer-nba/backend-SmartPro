const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const brandSchema = new mongoose.Schema(
  {
    name:{type:String,required: true}, // (ชื่อแบรนด์)
  },
  {timestamps: true}
);

const Brand = mongoose.model("brand", brandSchema);

module.exports = Brand;