const mongoose = require("mongoose");

// Define the schema for the HotelUser entity
const supplierimporttaxSchema = new mongoose.Schema(
  {
    quotation_id:{type: mongoose.Schema.Types.ObjectId,ref:'quotation',default:null}, 
    percent:{type:Number,default:0},
    price:{type:Number,default:0}
  },
  {timestamps: true}
);

const Supplierimporttax = mongoose.model("supplierimporttax", supplierimporttaxSchema);

module.exports = Supplierimporttax;