const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const typeofbusinessSchema = new mongoose.Schema(
  {
    name:{type:String,required:true}
  },
  {timestamps: true}
);

const Typeofbusiness = mongoose.model("typeofbusiness", typeofbusinessSchema);

module.exports = Typeofbusiness;